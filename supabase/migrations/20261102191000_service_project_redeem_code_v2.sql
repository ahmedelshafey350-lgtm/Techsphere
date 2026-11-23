-- Redeeming an activation code must work for an order that already produced an access
-- row (revoked or expired): public.service_project_access has a unique constraint on
-- order_id, so v1's plain insert failed with 23505 and the customer saw a generic error.
-- v2 keeps every v1 validation and reactivates the existing row instead of inserting.

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
