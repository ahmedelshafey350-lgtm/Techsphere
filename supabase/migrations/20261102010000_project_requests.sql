-- Additive schema for Techshpere project quotation requests.
-- Existing tables (categories, projects, orders, access, courses, profiles, etc.) are not modified.
-- Back up the Supabase project before applying this migration.

do $$
declare
    object_name text;
begin
    foreach object_name in array array[
        'project_requests'
    ]
    loop
        if to_regclass('public.' || object_name) is not null then
            raise exception
                'public.% already exists; inspect and reconcile it before applying this migration.',
                object_name;
        end if;
    end loop;

    if to_regprocedure('public.techsphere_project_request_set_updated_at_v1()') is not null then
        raise exception 'A versioned project request function already exists; inspect it before continuing.';
    end if;
end;
$$;

create table public.project_requests (
    id uuid primary key default gen_random_uuid(),
    order_number text not null unique
        default ('TXH-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))),
    project_id uuid not null references public.service_projects(id) on delete restrict,
    category_id uuid not null references public.service_project_categories(id) on delete restrict,
    user_id uuid references auth.users(id) on delete set null,
    buyer_name text not null check (char_length(buyer_name) between 2 and 160),
    buyer_phone text not null check (char_length(buyer_phone) between 7 and 40),
    buyer_email text not null check (char_length(buyer_email) between 5 and 254),
    delivery_address text not null check (char_length(delivery_address) between 8 and 500),
    min_budget numeric(12, 2) not null check (min_budget >= 0),
    max_budget numeric(12, 2) not null check (max_budget >= 0),
    budget_currency text not null default 'EGP' check (budget_currency ~ '^[A-Z]{3}$'),
    delivery_deadline text not null check (char_length(delivery_deadline) between 1 and 120),
    additional_message text not null default '' check (char_length(additional_message) <= 2000),
    status text not null default 'pending_review'
        check (status in ('pending_review', 'contacted', 'negotiating', 'approved', 'in_progress', 'completed', 'rejected')),
    access_granted boolean not null default false,
    access_granted_by text,
    access_granted_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (min_budget <= max_budget)
);

create index project_requests_user_created_idx
    on public.project_requests(user_id, created_at desc);
create index project_requests_project_created_idx
    on public.project_requests(project_id, created_at desc);
create index project_requests_category_created_idx
    on public.project_requests(category_id, created_at desc);
create index project_requests_status_created_idx
    on public.project_requests(status, created_at desc);
create unique index project_requests_one_pending_per_user_project_idx
    on public.project_requests(user_id, project_id)
    where status = 'pending_review';

create function public.techsphere_project_request_set_updated_at_v1()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger project_requests_set_updated_at
    before update on public.project_requests
    for each row execute function public.techsphere_project_request_set_updated_at_v1();

-- Link each access grant to its originating request (audit trail), consistent with order_id.
alter table public.service_project_access
    add column if not exists request_id uuid
        references public.project_requests(id) on delete restrict;

create index service_project_access_request_idx
    on public.service_project_access(request_id);

-- Enable RLS on the new table.
alter table public.project_requests enable row level security;

-- Keep frontend keys restricted: no direct table access for anon/authenticated.
revoke all on table public.project_requests from public, anon, authenticated;
grant all on table public.project_requests to service_role;

-- Buyers can insert their own requests.
create policy "Buyers can submit their own project requests"
    on public.project_requests for insert
    to authenticated
    with check ((select auth.uid()) = user_id);

-- Buyers can read only their own requests.
create policy "Buyers can read their own project requests"
    on public.project_requests for select
    to authenticated
    using ((select auth.uid()) = user_id);

-- Admins (via service_role Edge Functions) manage all requests through server-side code,
-- not through direct anon/authenticated table policies.
