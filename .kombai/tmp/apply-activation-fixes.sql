-- TechSphere — تطبيق إصلاحات رموز التفعيل مرة واحدة.
-- الصق كامل محتوى هذا الملف في Supabase Dashboard → SQL Editor → New query → Run.
-- آمن للتشغيل أكثر من مرة (idempotent).

-- 1) السماح بأكثر من رمز لكل طلب حتى يُحفظ الرمز القديم كأثر بدل استبداله.
do $$
declare
    unique_constraint text;
begin
    select con.conname
    into unique_constraint
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'service_project_activation_codes'
      and con.contype = 'u'
      and pg_get_constraintdef(con.oid) = 'UNIQUE (order_id)';

    if unique_constraint is not null then
        execute format(
            'alter table public.service_project_activation_codes drop constraint %I',
            unique_constraint
        );
    end if;
end
$$;

create index if not exists service_project_activation_codes_order_created_idx
    on public.service_project_activation_codes(order_id, created_at desc);

-- 2) دالة تفعيل جديدة: لو الطلب أنتج صلاحية سابقة (ملغاة أو منتهية) تُحدَّث بدل إدخال صف جديد.
create or replace function public.techsphere_service_project_redeem_code_v2(
    p_code_hash text,
    p_user_id uuid
)
returns table (access_id uuid, project_id uuid, activated_at timestamptz, expires_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
    code_row public.service_project_activation_codes%rowtype;
    existing_access_id uuid;
    new_access_id uuid;
    activation_time timestamptz := now();
begin
    if p_code_hash is null or p_code_hash !~ '^[0-9a-f]{64}$' or p_user_id is null then
        raise exception 'Activation code or customer is invalid.' using errcode = '22023';
    end if;

    select * into code_row
    from public.service_project_activation_codes
    where code_hash = p_code_hash
    for update;

    if not found or code_row.redeemed_at is not null or code_row.revoked_at is not null
        or (code_row.expires_at is not null and code_row.expires_at <= activation_time) then
        raise exception 'Activation code is invalid, expired, or already used.' using errcode = 'P0001';
    end if;

    perform pg_advisory_xact_lock(hashtextextended(
        p_user_id::text || ':' || code_row.project_id::text, 0
    ));

    if not exists (
        select 1
        from public.service_project_orders o
        where o.id = code_row.order_id
          and o.user_id = p_user_id
          and o.project_id = code_row.project_id
          and o.payment_status = 'confirmed'
          and o.payment_method = 'activation_code'
    ) then
        raise exception 'Activation code is not valid for this customer or project.' using errcode = 'P0001';
    end if;

    if exists (
        select 1
        from public.service_project_access a
        where a.user_id = p_user_id
          and a.project_id = code_row.project_id
          and a.status = 'active'
          and a.expires_at > activation_time
    ) then
        raise exception 'Customer already has active access to this project.' using errcode = 'P0001';
    end if;

    update public.service_project_access
    set status = 'expired'
    where user_id = p_user_id
      and project_id = code_row.project_id
      and status = 'active'
      and expires_at <= activation_time;

    update public.service_project_activation_codes
    set redeemed_by = p_user_id,
        redeemed_at = activation_time
    where id = code_row.id;

    select a.id into existing_access_id
    from public.service_project_access a
    where a.order_id = code_row.order_id
    for update;

    if existing_access_id is not null then
        update public.service_project_access
        set user_id = p_user_id,
            activation_code_id = code_row.id,
            activated_at = activation_time,
            expires_at = activation_time + interval '3 months',
            status = 'active',
            revoked_at = null,
            revoked_by = null,
            granted_by = code_row.created_by
        where id = existing_access_id
        returning id into new_access_id;
    else
        insert into public.service_project_access (
            user_id, project_id, order_id, activation_code_id, activated_at, expires_at, granted_by
        )
        values (
            p_user_id,
            code_row.project_id,
            code_row.order_id,
            code_row.id,
            activation_time,
            activation_time + interval '3 months',
            code_row.created_by
        )
        returning id into new_access_id;
    end if;

    return query
    select a.id, a.project_id, a.activated_at, a.expires_at
    from public.service_project_access a
    where a.id = new_access_id;
end;
$$;

revoke all on function public.techsphere_service_project_redeem_code_v2(text, uuid) from public, anon, authenticated;
grant execute on function public.techsphere_service_project_redeem_code_v2(text, uuid) to service_role;

-- 3) تحقق بعد التنفيذ: لازم ترجع دالة v2 + أي قيد UNIQUE متبقٍ على order_id لازم يكون فاضي.
select
    (select count(*) from pg_proc p
     join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname = 'techsphere_service_project_redeem_code_v2') as redeem_v2_exists,
    (select coalesce(string_agg(con.conname, ', '), '—')
     from pg_constraint con
     where con.conrelid = 'public.service_project_activation_codes'::regclass
       and con.contype = 'u'
       and pg_get_constraintdef(con.oid) = 'UNIQUE (order_id)') as remaining_order_unique;
