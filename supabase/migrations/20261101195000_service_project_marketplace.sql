-- Additive schema for the Techshpere project marketplace.
-- Existing courses, profiles, requests, reviews, and training activations are
-- not modified. Back up the Supabase project before applying this migration.

do $$
declare
    object_name text;
begin
    foreach object_name in array array[
        'service_project_categories',
        'service_projects',
        'service_project_document_versions',
        'service_project_orders',
        'service_project_access',
        'service_project_activation_codes',
        'service_project_download_logs'
    ]
    loop
        if to_regclass('public.' || object_name) is not null then
            raise exception
                'public.% already exists; inspect and reconcile it before applying this migration.',
                object_name;
        end if;
    end loop;

    if to_regprocedure('public.techsphere_service_project_set_updated_at_v1()') is not null
        or to_regprocedure('public.techsphere_service_project_validate_order_price_v1()') is not null
        or to_regprocedure('public.techsphere_service_project_create_order_v1(uuid,uuid,text,text)') is not null
        or to_regprocedure('public.techsphere_service_project_confirm_order_v1(uuid,text)') is not null
        or to_regprocedure('public.techsphere_service_project_redeem_code_v1(text,uuid)') is not null
        or to_regprocedure('public.techsphere_service_project_extend_access_v1(uuid,integer,text)') is not null
        or to_regprocedure('public.techsphere_service_project_issue_code_v1(uuid,text,text,timestamp with time zone)') is not null then
        raise exception 'A versioned Techshpere project marketplace function already exists; inspect it before continuing.';
    end if;
end;
$$;

create table public.service_project_categories (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    title_ar text not null check (char_length(title_ar) between 2 and 120),
    title_en text not null check (char_length(title_en) between 2 and 120),
    description_ar text not null default '',
    description_en text not null default '',
    image_url text,
    image_alt_text text not null default '',
    sort_order integer not null default 0 check (sort_order >= 0),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.service_projects (
    id uuid primary key default gen_random_uuid(),
    project_code text not null unique
        check (project_code ~ '^TXH-[A-Z]{2,4}-[0-9]{3,6}$'),
    slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    category_id uuid not null references public.service_project_categories(id) on delete restrict,
    title_ar text not null check (char_length(title_ar) between 2 and 200),
    title_en text not null check (char_length(title_en) between 2 and 200),
    public_description_ar text not null default '' check (char_length(public_description_ar) <= 4000),
    public_description_en text not null default '' check (char_length(public_description_en) <= 4000),
    image_url text,
    image_source_url text,
    image_license text,
    image_alt_text text not null default '',
    catalog_visible boolean not null default false,
    price numeric(12, 2) check (price is null or price >= 0),
    currency_code text not null default 'EGP' check (currency_code ~ '^[A-Z]{3}$'),
    difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
    source_document text,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (status <> 'published' or (catalog_visible and price is not null and price > 0))
);

create table public.service_project_document_versions (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.service_projects(id) on delete restrict,
    version text not null check (version ~ '^[0-9]+[.][0-9]+([.][0-9]+)?$'),
    changelog_ar text not null default '',
    changelog_en text not null default '',
    documentation jsonb not null default '{}'::jsonb
        check (jsonb_typeof(documentation) = 'object'),
    private_files jsonb not null default '[]'::jsonb
        check (jsonb_typeof(private_files) = 'array'),
    source_document text,
    published_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    unique (project_id, version)
);

create table public.service_project_orders (
    id uuid primary key default gen_random_uuid(),
    order_reference text not null unique
        default ('TXH-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))),
    user_id uuid not null references auth.users(id) on delete restrict,
    project_id uuid not null references public.service_projects(id) on delete restrict,
    order_type text not null default 'purchase' check (order_type in ('purchase', 'renewal')),
    amount numeric(12, 2) not null check (amount > 0),
    currency_code text not null default 'EGP' check (currency_code ~ '^[A-Z]{3}$'),
    payment_status text not null default 'pending'
        check (payment_status in ('pending', 'confirmed', 'rejected', 'cancelled')),
    payment_method text not null default 'manual'
        check (payment_method in ('manual', 'activation_code')),
    customer_message text not null default '' check (char_length(customer_message) <= 2000),
    admin_note text not null default '' check (char_length(admin_note) <= 2000),
    confirmed_at timestamptz,
    confirmed_by text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.service_project_access (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete restrict,
    project_id uuid not null references public.service_projects(id) on delete restrict,
    order_id uuid unique references public.service_project_orders(id) on delete restrict,
    activation_code_id uuid,
    extended_from uuid unique references public.service_project_access(id) on delete restrict,
    activated_at timestamptz not null default now(),
    expires_at timestamptz not null,
    status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
    granted_by text not null,
    revoked_at timestamptz,
    revoked_by text,
    admin_note text not null default '' check (char_length(admin_note) <= 2000),
    created_at timestamptz not null default now(),
    check (expires_at > activated_at),
    check (
        (status = 'revoked' and revoked_at is not null)
        or (status <> 'revoked' and revoked_at is null)
    )
);

create table public.service_project_activation_codes (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null unique
        references public.service_project_orders(id) on delete restrict,
    project_id uuid not null references public.service_projects(id) on delete restrict,
    code_hash text not null unique check (code_hash ~ '^[0-9a-f]{64}$'),
    expires_at timestamptz,
    redeemed_by uuid references auth.users(id) on delete restrict,
    redeemed_at timestamptz,
    revoked_at timestamptz,
    created_by text not null,
    created_at timestamptz not null default now(),
    check (
        (redeemed_by is null and redeemed_at is null)
        or (redeemed_by is not null and redeemed_at is not null)
    )
);

alter table public.service_project_access
    add constraint service_project_access_activation_code_fkey
    foreign key (activation_code_id)
    references public.service_project_activation_codes(id)
    on delete restrict;

create table public.service_project_download_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete restrict,
    access_id uuid not null references public.service_project_access(id) on delete restrict,
    document_version_id uuid not null
        references public.service_project_document_versions(id) on delete restrict,
    file_name text not null,
    downloaded_at timestamptz not null default now()
);

create index service_projects_category_status_idx
    on public.service_projects(category_id, status);
create index service_projects_status_created_idx
    on public.service_projects(status, created_at desc);
create index service_project_documents_project_published_idx
    on public.service_project_document_versions(project_id, published_at desc);
create index service_project_orders_user_created_idx
    on public.service_project_orders(user_id, created_at desc);
create unique index service_project_orders_one_pending_per_user_project_idx
    on public.service_project_orders(user_id, project_id)
    where payment_status = 'pending';
create index service_project_orders_status_created_idx
    on public.service_project_orders(payment_status, created_at desc);
create index service_project_orders_project_status_idx
    on public.service_project_orders(project_id, payment_status);
create index service_project_access_user_project_expiry_idx
    on public.service_project_access(user_id, project_id, expires_at desc);
create index service_project_access_status_expiry_idx
    on public.service_project_access(status, expires_at);
create index service_project_activation_codes_project_created_idx
    on public.service_project_activation_codes(project_id, created_at desc);
create index service_project_download_logs_user_date_idx
    on public.service_project_download_logs(user_id, downloaded_at desc);

create function public.techsphere_service_project_set_updated_at_v1()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger service_project_categories_set_updated_at
    before update on public.service_project_categories
    for each row execute function public.techsphere_service_project_set_updated_at_v1();
create trigger service_projects_set_updated_at
    before update on public.service_projects
    for each row execute function public.techsphere_service_project_set_updated_at_v1();
create trigger service_project_orders_set_updated_at
    before update on public.service_project_orders
    for each row execute function public.techsphere_service_project_set_updated_at_v1();

create function public.techsphere_service_project_validate_order_price_v1()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
    project_price numeric(12, 2);
    project_currency text;
    project_status text;
    project_catalog_visible boolean;
    category_active boolean;
begin
    if tg_op = 'UPDATE' then
        if new.project_id is distinct from old.project_id
            or new.amount is distinct from old.amount
            or new.currency_code is distinct from old.currency_code then
            raise exception 'Project order pricing fields are immutable.'
                using errcode = '22023';
        end if;
        return new;
    end if;

    select p.price, p.currency_code, p.status, p.catalog_visible, c.is_active
    into project_price, project_currency, project_status, project_catalog_visible, category_active
    from public.service_projects as p
    join public.service_project_categories as c on c.id = p.category_id
    where p.id = new.project_id
    for share of p, c;

    if not found or project_status <> 'published' or not project_catalog_visible
        or not category_active or project_price is null or project_price <= 0 then
        raise exception 'Project is not available for purchase without a valid published price.'
            using errcode = 'P0001';
    end if;

    new.amount := project_price;
    new.currency_code := project_currency;
    return new;
end;
$$;

create trigger service_project_orders_validate_price
    before insert or update on public.service_project_orders
    for each row execute function public.techsphere_service_project_validate_order_price_v1();

create function public.techsphere_service_project_create_order_v1(
    p_user_id uuid,
    p_project_id uuid,
    p_order_type text default 'purchase',
    p_customer_message text default ''
)
returns table (
    id uuid,
    order_reference text,
    project_id uuid,
    amount numeric(12, 2),
    currency_code text,
    payment_status text,
    order_type text,
    created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
    project_price numeric(12, 2);
    project_currency text;
    project_status text;
    project_catalog_visible boolean;
    category_active boolean;
begin
    if p_user_id is null or p_project_id is null or p_order_type is null
        or p_order_type not in ('purchase', 'renewal')
        or p_customer_message is null or char_length(p_customer_message) > 2000 then
        raise exception 'Project order data is invalid.' using errcode = '22023';
    end if;

    select p.price, p.currency_code, p.status, p.catalog_visible, c.is_active
    into project_price, project_currency, project_status, project_catalog_visible, category_active
    from public.service_projects as p
    join public.service_project_categories as c on c.id = p.category_id
    where p.id = p_project_id
    for share of p, c;

    if not found or project_status <> 'published' or not project_catalog_visible
        or not category_active or project_price is null or project_price <= 0 then
        raise exception 'Project is not available for purchase without a valid published price.'
            using errcode = 'P0001';
    end if;

    if p_order_type = 'renewal' and not exists (
        select 1
        from public.service_project_orders as existing_order
        where existing_order.user_id = p_user_id
          and existing_order.project_id = p_project_id
          and existing_order.payment_status = 'confirmed'
    ) then
        raise exception 'A confirmed purchase is required before renewal.'
            using errcode = 'P0001';
    end if;

    return query
    insert into public.service_project_orders as created_order (
        user_id, project_id, order_type, amount, currency_code, customer_message
    )
    values (
        p_user_id, p_project_id, p_order_type, project_price, project_currency,
        trim(p_customer_message)
    )
    returning created_order.id, created_order.order_reference, created_order.project_id,
        created_order.amount, created_order.currency_code, created_order.payment_status,
        created_order.order_type, created_order.created_at;
end;
$$;

create function public.techsphere_service_project_confirm_order_v1(
    p_order_id uuid,
    p_confirmed_by text
)
returns table (access_id uuid, activated_at timestamptz, expires_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
    order_row public.service_project_orders%rowtype;
    new_access_id uuid;
    activation_time timestamptz := now();
begin
    if p_confirmed_by is null or char_length(trim(p_confirmed_by)) not between 3 and 254 then
        raise exception 'An administrator identifier is required.' using errcode = '22023';
    end if;

    select * into order_row
    from public.service_project_orders
    where id = p_order_id
    for update;

    if not found then
        raise exception 'Project order was not found.' using errcode = 'P0002';
    end if;

    perform pg_advisory_xact_lock(hashtextextended(
        order_row.user_id::text || ':' || order_row.project_id::text, 0
    ));

    if order_row.payment_status = 'confirmed' then
        return query
        select a.id, a.activated_at, a.expires_at
        from public.service_project_access a
        where a.order_id = order_row.id;
        return;
    end if;

    if order_row.payment_status <> 'pending' then
        raise exception 'Only pending project orders can be confirmed.' using errcode = 'P0001';
    end if;

    if exists (
        select 1
        from public.service_project_access a
        where a.user_id = order_row.user_id
          and a.project_id = order_row.project_id
          and a.status = 'active'
          and a.expires_at > activation_time
    ) then
        raise exception 'Customer already has active access to this project.' using errcode = 'P0001';
    end if;

    update public.service_project_access
    set status = 'expired'
    where user_id = order_row.user_id
      and project_id = order_row.project_id
      and status = 'active'
      and expires_at <= activation_time;

    update public.service_project_orders
    set payment_status = 'confirmed',
        confirmed_at = activation_time,
        confirmed_by = trim(p_confirmed_by)
    where id = order_row.id;

    insert into public.service_project_access (
        user_id, project_id, order_id, activated_at, expires_at, granted_by
    )
    values (
        order_row.user_id,
        order_row.project_id,
        order_row.id,
        activation_time,
        activation_time + interval '3 months',
        trim(p_confirmed_by)
    )
    returning id into new_access_id;

    return query
    select a.id, a.activated_at, a.expires_at
    from public.service_project_access a
    where a.id = new_access_id;
end;
$$;

create function public.techsphere_service_project_redeem_code_v1(
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

    return query
    select a.id, a.project_id, a.activated_at, a.expires_at
    from public.service_project_access a
    where a.id = new_access_id;
end;
$$;

create function public.techsphere_service_project_issue_code_v1(
    p_order_id uuid,
    p_code_hash text,
    p_admin text,
    p_code_expires_at timestamptz default null
)
returns table (activation_code_id uuid, order_reference text)
language plpgsql
security definer
set search_path = ''
as $$
declare
    order_row public.service_project_orders%rowtype;
    new_code_id uuid;
begin
    if p_code_hash is null or p_code_hash !~ '^[0-9a-f]{64}$'
        or p_admin is null or char_length(trim(p_admin)) not between 3 and 254
        or (p_code_expires_at is not null and p_code_expires_at <= now()) then
        raise exception 'Activation code or administrator data is invalid.' using errcode = '22023';
    end if;

    select * into order_row
    from public.service_project_orders
    where id = p_order_id
    for update;
    if not found or order_row.payment_status <> 'pending' then
        raise exception 'Only pending project orders can receive an activation code.' using errcode = 'P0001';
    end if;

    perform pg_advisory_xact_lock(hashtextextended(
        order_row.user_id::text || ':' || order_row.project_id::text, 0
    ));

    if exists (
        select 1
        from public.service_project_access a
        where a.user_id = order_row.user_id
          and a.project_id = order_row.project_id
          and a.status = 'active'
          and a.expires_at > now()
    ) then
        raise exception 'Customer already has active access to this project.' using errcode = 'P0001';
    end if;

    update public.service_project_orders
    set payment_status = 'confirmed',
        payment_method = 'activation_code',
        confirmed_at = now(),
        confirmed_by = trim(p_admin)
    where id = order_row.id;

    insert into public.service_project_activation_codes (
        order_id, project_id, code_hash, expires_at, created_by
    )
    values (
        order_row.id,
        order_row.project_id,
        p_code_hash,
        p_code_expires_at,
        trim(p_admin)
    )
    returning id into new_code_id;

    return query
    select new_code_id, order_row.order_reference;
end;
$$;

create function public.techsphere_service_project_extend_access_v1(
    p_access_id uuid,
    p_months integer,
    p_admin text
)
returns table (access_id uuid, activated_at timestamptz, expires_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
    old_access public.service_project_access%rowtype;
    starts_at timestamptz := now();
    new_access_id uuid;
begin
    if p_months is null or p_months < 1 or p_months > 24
        or p_admin is null or char_length(trim(p_admin)) not between 3 and 254 then
        raise exception 'Extension duration or administrator is invalid.' using errcode = '22023';
    end if;

    select * into old_access
    from public.service_project_access
    where id = p_access_id
    for update;
    if not found or old_access.status = 'revoked' then
        raise exception 'Project access cannot be extended.' using errcode = 'P0001';
    end if;

    perform pg_advisory_xact_lock(hashtextextended(
        old_access.user_id::text || ':' || old_access.project_id::text, 0
    ));

    if old_access.status = 'active' and old_access.expires_at <= now() then
        update public.service_project_access
        set status = 'expired'
        where id = old_access.id;
    end if;

    starts_at := greatest(starts_at, old_access.expires_at);
    insert into public.service_project_access (
        user_id, project_id, extended_from, activated_at, expires_at, granted_by, admin_note
    )
    values (
        old_access.user_id,
        old_access.project_id,
        old_access.id,
        starts_at,
        starts_at + make_interval(months => p_months),
        trim(p_admin),
        'Administrative extension'
    )
    returning id into new_access_id;

    return query
    select a.id, a.activated_at, a.expires_at
    from public.service_project_access a
    where a.id = new_access_id;
end;
$$;

revoke all on function public.techsphere_service_project_set_updated_at_v1()
    from public, anon, authenticated;
revoke all on function public.techsphere_service_project_validate_order_price_v1()
    from public, anon, authenticated;
revoke all on function public.techsphere_service_project_create_order_v1(uuid, uuid, text, text)
    from public, anon, authenticated;
revoke all on function public.techsphere_service_project_confirm_order_v1(uuid, text),
    public.techsphere_service_project_redeem_code_v1(text, uuid),
    public.techsphere_service_project_extend_access_v1(uuid, integer, text),
    public.techsphere_service_project_issue_code_v1(uuid, text, text, timestamptz)
    from public, anon, authenticated;
grant execute on function public.techsphere_service_project_create_order_v1(uuid, uuid, text, text)
    to service_role;
grant execute on function public.techsphere_service_project_confirm_order_v1(uuid, text)
    to service_role;
grant execute on function public.techsphere_service_project_redeem_code_v1(text, uuid)
    to service_role;
grant execute on function public.techsphere_service_project_extend_access_v1(uuid, integer, text)
    to service_role;
grant execute on function public.techsphere_service_project_issue_code_v1(uuid, text, text, timestamptz)
    to service_role;

alter table public.service_project_categories enable row level security;
alter table public.service_projects enable row level security;
alter table public.service_project_document_versions enable row level security;
alter table public.service_project_orders enable row level security;
alter table public.service_project_access enable row level security;
alter table public.service_project_activation_codes enable row level security;
alter table public.service_project_download_logs enable row level security;

revoke all on table
    public.service_project_categories,
    public.service_projects,
    public.service_project_document_versions,
    public.service_project_orders,
    public.service_project_access,
    public.service_project_activation_codes,
    public.service_project_download_logs
from public, anon, authenticated;

grant select on table public.service_project_categories to anon, authenticated;
grant select (
    id, project_code, slug, category_id, title_ar, title_en,
    public_description_ar, public_description_en, image_url, image_alt_text,
    price, currency_code, difficulty
) on public.service_projects to anon, authenticated;
grant all on table
    public.service_project_categories,
    public.service_projects,
    public.service_project_document_versions,
    public.service_project_orders,
    public.service_project_access,
    public.service_project_activation_codes,
    public.service_project_download_logs
to service_role;

create policy "Active service project categories are readable"
    on public.service_project_categories for select
    to anon, authenticated using (is_active);
create policy "Visible service catalog projects are readable"
    on public.service_projects for select
    to anon, authenticated using (
        catalog_visible and exists (
            select 1
            from public.service_project_categories as category
            where category.id = service_projects.category_id and category.is_active
        )
    );
create policy "Customers can read their own project orders"
    on public.service_project_orders for select
    to authenticated using ((select auth.uid()) = user_id);
create policy "Customers can read their own project access"
    on public.service_project_access for select
    to authenticated using ((select auth.uid()) = user_id);
