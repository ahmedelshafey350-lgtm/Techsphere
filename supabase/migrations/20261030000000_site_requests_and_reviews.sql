create table if not exists public.site_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    request_type text not null check (request_type in ('course_enrollment', 'job_application')),
    status text not null default 'new'
        check (status in ('new', 'reviewing', 'contacted', 'accepted', 'rejected', 'completed')),
    name text not null,
    email text not null,
    phone text not null,
    course_id integer,
    course_name text,
    job_title text,
    portfolio text,
    message text not null default '',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (
        (request_type = 'course_enrollment' and course_id is not null
            and course_id between 0 and 7 and course_name is not null)
        or (request_type = 'job_application' and job_title is not null)
    )
);

create index if not exists site_requests_user_created_idx
    on public.site_requests (user_id, created_at desc);
create index if not exists site_requests_type_status_created_idx
    on public.site_requests (request_type, status, created_at desc);

alter table public.site_requests enable row level security;
revoke all on table public.site_requests from public, anon, authenticated;
grant select on table public.site_requests to authenticated;
grant all on table public.site_requests to service_role;

drop policy if exists "Users can read their own site requests" on public.site_requests;
create policy "Users can read their own site requests"
    on public.site_requests for select
    to authenticated
    using ((select auth.uid()) = user_id);

create table if not exists public.course_reviews (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    course_id integer not null check (course_id between 0 and 7),
    reviewer_name text not null,
    rating integer not null check (rating between 1 and 5),
    comment text not null check (char_length(comment) between 10 and 1200),
    moderation_status text not null default 'pending'
        check (moderation_status in ('pending', 'approved', 'rejected')),
    is_verified boolean not null default true,
    created_at timestamptz not null default now(),
    moderated_at timestamptz,
    moderated_by text
);

create index if not exists course_reviews_public_idx
    on public.course_reviews (course_id, created_at desc)
    where moderation_status = 'approved';
create index if not exists course_reviews_user_idx
    on public.course_reviews (user_id, created_at desc);
drop index if exists public.course_reviews_user_course_unique;
create unique index course_reviews_user_course_unique
    on public.course_reviews (user_id, course_id)
    where moderation_status <> 'rejected';

alter table public.course_reviews enable row level security;
revoke all on table public.course_reviews from public, anon, authenticated;
grant select on table public.course_reviews to anon, authenticated;
grant all on table public.course_reviews to service_role;

drop policy if exists "Anyone can read approved course reviews" on public.course_reviews;
create policy "Anyone can read approved course reviews"
    on public.course_reviews for select
    to anon, authenticated
    using (moderation_status = 'approved');

drop policy if exists "Users can read their own course reviews" on public.course_reviews;
create policy "Users can read their own course reviews"
    on public.course_reviews for select
    to authenticated
    using ((select auth.uid()) = user_id);
