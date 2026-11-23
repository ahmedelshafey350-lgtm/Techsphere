-- Migration: 20261102020000_profiles_and_user_sync.sql
-- Ensure public.profiles exists, contains required columns, RLS policies, and sync trigger from auth.users.
-- Preserves all existing records and schema objects.

create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    full_name text not null default '',
    email text not null default '',
    student_id text unique,
    individual_training_activated_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Ensure all required columns exist in case the table was partially created
alter table public.profiles
    add column if not exists full_name text not null default '',
    add column if not exists email text not null default '',
    add column if not exists student_id text,
    add column if not exists individual_training_activated_at timestamptz,
    add column if not exists created_at timestamptz not null default now(),
    add column if not exists updated_at timestamptz not null default now();

-- Ensure unique constraint on student_id if not present
do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'profiles_student_id_key' and conrelid = 'public.profiles'::regclass
    ) then
        alter table public.profiles add constraint profiles_student_id_key unique (student_id);
    end if;
exception
    when others then null;
end $$;

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Table permissions
grant select on table public.profiles to authenticated;
grant update (full_name) on table public.profiles to authenticated;
grant all on table public.profiles to service_role;

-- RLS Policies
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
    on public.profiles for select
    to authenticated
    using ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile name" on public.profiles;
create policy "Users can update their own profile name"
    on public.profiles for update
    to authenticated
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);

-- Trigger function to automatically keep public.profiles synchronized with auth.users
create or replace function public.sync_profile_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, full_name, email, created_at, updated_at)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', ''),
        coalesce(new.email, ''),
        coalesce(new.created_at, now()),
        now()
    )
    on conflict (id) do update
    set full_name = case
            when excluded.full_name <> '' then excluded.full_name
            else public.profiles.full_name
        end,
        email = coalesce(excluded.email, public.profiles.email),
        updated_at = now();

    return new;
end;
$$;

-- Trigger to execute sync on user creation or update
drop trigger if exists on_auth_user_profile_sync on auth.users;
create trigger on_auth_user_profile_sync
    after insert or update of email, raw_user_meta_data on auth.users
    for each row execute function public.sync_profile_from_auth_user();

-- Backfill any existing auth users into public.profiles
insert into public.profiles (id, full_name, email, created_at, updated_at)
select
    u.id,
    coalesce(u.raw_user_meta_data ->> 'full_name', ''),
    coalesce(u.email, ''),
    coalesce(u.created_at, now()),
    coalesce(u.updated_at, now())
from auth.users u
on conflict (id) do update
set full_name = case
        when excluded.full_name <> '' and public.profiles.full_name = '' then excluded.full_name
        else public.profiles.full_name
    end,
    email = case
        when excluded.email <> '' then excluded.email
        else public.profiles.email
    end;

