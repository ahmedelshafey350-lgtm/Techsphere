-- Additive course-management schema for the existing Techsphere Supabase project.
-- This migration does not alter or delete existing profiles, requests, reviews,
-- authentication records, or enrollment data.
--
-- Course artwork storage is intentionally handled in a separate migration
-- after reviewing the target project's existing storage.objects policies.

do $$
declare
    object_name text;
begin
    foreach object_name in array array[
        'courses',
        'course_chapters',
        'chapter_topics',
        'course_discounts',
        'course_enrollment_requests',
        'course_catalog'
    ]
    loop
        if to_regclass('public.' || object_name) is not null then
            raise exception
                'public.% already exists; inspect and reconcile it before applying this migration.',
                object_name;
        end if;
    end loop;

    if to_regprocedure('public.techsphere_course_set_updated_at_v1()') is not null
        or to_regprocedure('public.techsphere_course_prevent_overlapping_discount_v1()') is not null then
        raise exception 'A versioned Techsphere course trigger function already exists; inspect it before continuing.';
    end if;
end;
$$;

create table if not exists public.courses (
    id uuid primary key default gen_random_uuid(),
    legacy_id integer unique check (legacy_id between 0 and 7),
    slug text not null unique check (char_length(slug) between 2 and 160),
    title_en text not null check (char_length(title_en) between 2 and 200),
    title_ar text not null check (char_length(title_ar) between 2 and 200),
    description_en text not null default '',
    description_ar text not null default '',
    thumbnail_url text,
    cover_url text,
    category text not null check (char_length(category) between 2 and 100),
    technologies text[] not null default '{}',
    difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
    duration_months numeric(5, 2) check (duration_months is null or duration_months > 0),
    original_price numeric(12, 2) not null check (original_price >= 0),
    currency_code text not null default 'EGP' check (currency_code ~ '^[A-Z]{3}$'),
    is_published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.course_chapters (
    id uuid primary key default gen_random_uuid(),
    course_id uuid not null references public.courses (id) on delete cascade,
    title_en text not null check (char_length(title_en) between 1 and 200),
    title_ar text not null check (char_length(title_ar) between 1 and 200),
    description_en text not null default '',
    description_ar text not null default '',
    learning_objectives jsonb not null default '{"en":[],"ar":[]}'::jsonb
        check (jsonb_typeof(learning_objectives) = 'object'),
    duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
    difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
    practical_applications jsonb not null default '{"en":[],"ar":[]}'::jsonb
        check (jsonb_typeof(practical_applications) = 'object'),
    real_world_examples jsonb not null default '{"en":[],"ar":[]}'::jsonb
        check (jsonb_typeof(real_world_examples) = 'object'),
    tools_and_technologies jsonb not null default '{"en":[],"ar":[]}'::jsonb
        check (jsonb_typeof(tools_and_technologies) = 'object'),
    exercises jsonb not null default '{"en":[],"ar":[]}'::jsonb
        check (jsonb_typeof(exercises) = 'object'),
    expected_outcomes jsonb not null default '{"en":[],"ar":[]}'::jsonb
        check (jsonb_typeof(expected_outcomes) = 'object'),
    sort_order integer not null default 0 check (sort_order >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.chapter_topics (
    id uuid primary key default gen_random_uuid(),
    chapter_id uuid not null references public.course_chapters (id) on delete cascade,
    title_en text not null check (char_length(title_en) between 1 and 200),
    title_ar text not null check (char_length(title_ar) between 1 and 200),
    short_description_en text not null default '',
    short_description_ar text not null default '',
    detailed_content_en text not null default '',
    detailed_content_ar text not null default '',
    step_by_step jsonb not null default '{"en":[],"ar":[]}'::jsonb
        check (jsonb_typeof(step_by_step) = 'object'),
    code_examples jsonb not null default '[]'::jsonb
        check (jsonb_typeof(code_examples) = 'array'),
    practical_examples jsonb not null default '{"en":[],"ar":[]}'::jsonb
        check (jsonb_typeof(practical_examples) = 'object'),
    use_cases jsonb not null default '{"en":[],"ar":[]}'::jsonb
        check (jsonb_typeof(use_cases) = 'object'),
    common_mistakes jsonb not null default '{"en":[],"ar":[]}'::jsonb
        check (jsonb_typeof(common_mistakes) = 'object'),
    exercises jsonb not null default '{"en":[],"ar":[]}'::jsonb
        check (jsonb_typeof(exercises) = 'object'),
    sort_order integer not null default 0 check (sort_order >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.course_discounts (
    id uuid primary key default gen_random_uuid(),
    course_id uuid not null references public.courses (id) on delete cascade,
    discount_type text not null
        check (discount_type in ('percentage', 'fixed_amount', 'fixed_price')),
    discount_value numeric(12, 2) not null check (discount_value >= 0),
    start_date timestamptz not null default now(),
    end_date timestamptz,
    is_active boolean not null default false,
    promotional_label text check (
        promotional_label is null or char_length(promotional_label) <= 120
    ),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (end_date is null or end_date > start_date),
    check (discount_type <> 'percentage' or discount_value <= 100)
);

create table if not exists public.course_enrollment_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    course_id uuid not null references public.courses (id) on delete restrict,
    course_name text not null check (char_length(course_name) between 2 and 200),
    quoted_price numeric(12, 2) not null check (quoted_price >= 0),
    currency_code text not null default 'EGP' check (currency_code ~ '^[A-Z]{3}$'),
    status text not null default 'new'
        check (status in ('new', 'reviewing', 'contacted', 'accepted', 'rejected', 'completed')),
    name text not null check (char_length(name) between 2 and 160),
    email text not null,
    phone text not null check (char_length(phone) between 5 and 40),
    message text not null default '' check (char_length(message) <= 3000),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists course_chapters_course_order_idx
    on public.course_chapters (course_id, sort_order);
create index if not exists chapter_topics_chapter_order_idx
    on public.chapter_topics (chapter_id, sort_order);
create index if not exists course_discounts_course_dates_idx
    on public.course_discounts (course_id, start_date, end_date);
create index if not exists course_enrollment_requests_user_created_idx
    on public.course_enrollment_requests (user_id, created_at desc);
create index if not exists course_enrollment_requests_status_created_idx
    on public.course_enrollment_requests (status, created_at desc);

create or replace function public.techsphere_course_set_updated_at_v1()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create or replace function public.techsphere_course_prevent_overlapping_discount_v1()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if not new.is_active then
        return new;
    end if;

    perform c.id
    from public.courses c
    where c.id = new.course_id
    for update;

    if exists (
        select 1
        from public.course_discounts existing
        where existing.course_id = new.course_id
            and existing.is_active
            and existing.id is distinct from new.id
            and tstzrange(existing.start_date, existing.end_date, '[)')
                && tstzrange(new.start_date, new.end_date, '[)')
    ) then
        raise exception 'An enabled discount already overlaps this course schedule.'
            using errcode = '23505';
    end if;

    return new;
end;
$$;

revoke all on function public.techsphere_course_set_updated_at_v1()
    from public, anon, authenticated;
revoke all on function public.techsphere_course_prevent_overlapping_discount_v1()
    from public, anon, authenticated;

do $$
declare
    target_table text;
begin
    foreach target_table in array array[
        'courses',
        'course_chapters',
        'chapter_topics',
        'course_discounts',
        'course_enrollment_requests'
    ]
    loop
        if not exists (
            select 1
            from pg_trigger t
            where t.tgrelid = format('public.%I', target_table)::regclass
                and t.tgname = target_table || '_set_updated_at'
                and not t.tgisinternal
        ) then
            execute format(
                'create trigger %I before update on public.%I '
                'for each row execute function public.techsphere_course_set_updated_at_v1()',
                target_table || '_set_updated_at',
                target_table
            );
        end if;
    end loop;

    if not exists (
        select 1
        from pg_trigger t
        where t.tgrelid = 'public.course_discounts'::regclass
            and t.tgname = 'course_discounts_prevent_overlapping_windows'
            and not t.tgisinternal
    ) then
        create trigger course_discounts_prevent_overlapping_windows
            before insert or update on public.course_discounts
            for each row
            execute function public.techsphere_course_prevent_overlapping_discount_v1();
    end if;
end;
$$;

alter table public.courses enable row level security;
alter table public.course_chapters enable row level security;
alter table public.chapter_topics enable row level security;
alter table public.course_discounts enable row level security;
alter table public.course_enrollment_requests enable row level security;

grant select on table public.courses, public.course_chapters,
    public.chapter_topics, public.course_discounts to anon, authenticated;
grant all on table public.courses, public.course_chapters,
    public.chapter_topics, public.course_discounts,
    public.course_enrollment_requests to service_role;
grant select on table public.course_enrollment_requests to authenticated;

do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public' and tablename = 'courses'
            and policyname = 'Published courses are readable'
    ) then
        create policy "Published courses are readable"
            on public.courses for select to anon, authenticated
            using (is_published);
    end if;
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public' and tablename = 'course_chapters'
            and policyname = 'Published course chapters are readable'
    ) then
        create policy "Published course chapters are readable"
            on public.course_chapters for select to anon, authenticated
            using (
                exists (
                    select 1 from public.courses c
                    where c.id = course_id and c.is_published
                )
            );
    end if;
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public' and tablename = 'chapter_topics'
            and policyname = 'Published course topics are readable'
    ) then
        create policy "Published course topics are readable"
            on public.chapter_topics for select to anon, authenticated
            using (
                exists (
                    select 1
                    from public.course_chapters ch
                    join public.courses c on c.id = ch.course_id
                    where ch.id = chapter_id and c.is_published
                )
            );
    end if;
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public' and tablename = 'course_discounts'
            and policyname = 'Current published course discounts are readable'
    ) then
        create policy "Current published course discounts are readable"
            on public.course_discounts for select to anon, authenticated
            using (
                is_active
                and start_date <= now()
                and (end_date is null or end_date > now())
                and exists (
                    select 1 from public.courses c
                    where c.id = course_id and c.is_published
                )
            );
    end if;
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public' and tablename = 'course_enrollment_requests'
            and policyname = 'Students can read their course enrollment requests'
    ) then
        create policy "Students can read their course enrollment requests"
            on public.course_enrollment_requests for select to authenticated
            using ((select auth.uid()) = user_id);
    end if;
end;
$$;

create view public.course_catalog
with (security_invoker = true)
as
select
    c.id,
    c.legacy_id,
    c.slug,
    c.title_en,
    c.title_ar,
    c.description_en,
    c.description_ar,
    c.thumbnail_url,
    c.cover_url,
    c.category,
    c.technologies,
    c.difficulty,
    c.duration_months,
    c.original_price,
    c.currency_code,
    case
        when d.id is null then c.original_price
        when d.discount_type = 'percentage'
            then round(c.original_price * (1 - d.discount_value / 100), 2)
        when d.discount_type = 'fixed_amount'
            then greatest(0, c.original_price - d.discount_value)
        when d.discount_type = 'fixed_price'
            then least(c.original_price, d.discount_value)
        else c.original_price
    end as current_price,
    case
        when d.id is null then null
        when d.discount_type = 'percentage' then d.discount_value
        when c.original_price = 0 then 0
        else round(
            100 * (
                c.original_price -
                case
                    when d.discount_type = 'fixed_amount'
                        then greatest(0, c.original_price - d.discount_value)
                    when d.discount_type = 'fixed_price'
                        then least(c.original_price, d.discount_value)
                    else c.original_price
                end
            ) / c.original_price,
            2
        )
    end as discount_percentage,
    d.discount_type,
    d.promotional_label,
    d.start_date as discount_start_date,
    d.end_date as discount_end_date
from public.courses c
left join lateral (
    select cd.*
    from public.course_discounts cd
    where cd.course_id = c.id
        and cd.is_active
        and cd.start_date <= now()
        and (cd.end_date is null or cd.end_date > now())
    order by cd.start_date desc
    limit 1
) d on true
where c.is_published;

grant select on public.course_catalog to anon, authenticated;

-- Import current static course metadata without replacing any pre-existing row.
-- Existing integer IDs used by site_requests and course_reviews remain unchanged.
insert into public.courses (
    legacy_id, slug, title_en, title_ar, description_en, description_ar,
    category, duration_months, original_price, currency_code, is_published
)
values
    (0, 'front-end-development', 'Front-End Development', 'تطوير الواجهات الأمامية',
     'Learn HTML, CSS, JavaScript, React, and responsive web design.',
     'تعلم HTML وCSS وJavaScript وReact وتصميم مواقع متوافقة مع مختلف الشاشات.',
     'software', 3, 5500, 'EGP', true),
    (1, 'back-end-development', 'Back-End Development', 'تطوير الواجهات الخلفية',
     'Learn Node.js, Express.js, REST APIs, databases, and authentication.',
     'تعلم Node.js وExpress.js وواجهات REST API وقواعد البيانات والمصادقة.',
     'software', 3, 5200, 'EGP', true),
    (2, 'full-stack-development', 'Full-Stack Development', 'تطوير الواجهات المتكاملة',
     'Build complete web applications using front-end and back-end technologies.',
     'أنشئ تطبيقات ويب متكاملة باستخدام تقنيات الواجهات الأمامية والخلفية.',
     'software', 5, 11000, 'EGP', true),
    (3, 'n8n-automation', 'n8n Automation', 'أتمتة n8n',
     'Learn workflow automation, API integrations, and automated business processes.',
     'تعلم أتمتة سير العمل، وربط واجهات API، وأتمتة العمليات التجارية.',
     'software', 1, 3200, 'EGP', true),
    (4, 'analog-electronics', 'Analog Electronics', 'الإلكترونيات التناظرية',
     'Understand analog circuits, diodes, transistors, and operational amplifiers.',
     'تعرف على الدوائر التناظرية والثنائيات والترانزستورات ومضخمات العمليات.',
     'electronics', 2, 4300, 'EGP', true),
    (5, 'digital-electronics', 'Digital Electronics', 'الإلكترونيات الرقمية',
     'Learn logic gates, Boolean algebra, digital circuits, and sequential systems.',
     'تعلم البوابات المنطقية والجبر البولياني والدوائر الرقمية والأنظمة التتابعية.',
     'electronics', 2, 4300, 'EGP', true),
    (6, 'pcb-design', 'PCB Design', 'تصميم لوحات الدوائر المطبوعة',
     'Learn schematic design, PCB layout, routing, and circuit board design.',
     'تعلم تصميم المخططات وتخطيط لوحات الدوائر المطبوعة والتوصيلات وتصميم اللوحات.',
     'electronics', 1, 1700, 'EGP', true),
    (7, 'robotics', 'Robotics', 'الروبوتات',
     'Explore robotics fundamentals, sensors, actuators, and control systems.',
     'استكشف أساسيات الروبوتات والمستشعرات والمشغلات وأنظمة التحكم.',
     'robotics', 3, 3800, 'EGP', true)
on conflict do nothing;

do $$
declare
    seeded_course_count integer;
begin
    select count(*) into seeded_course_count
    from public.courses
    where legacy_id between 0 and 7;

    if seeded_course_count <> 8 then
        raise exception
            'Expected all eight legacy course mappings, found %. Resolve slug or legacy ID conflicts before retrying.',
            seeded_course_count;
    end if;
end;
$$;
