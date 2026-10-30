# إعداد تسجيل الدخول وحفظ الحسابات في Supabase

تستخدم صفحة الدخول Supabase Auth لإنشاء الحسابات وتسجيل الدخول واستعادة كلمة المرور. تُحفظ الجلسة على الجهاز، ويُخزن الاسم والبريد مع حساب المستخدم. لا ترسل الصفحة كلمات المرور إلى Formspree أو إلى جدول ملفات المستخدمين.

## إعداد المشروع

1. أنشئ مشروعًا في [Supabase](https://supabase.com/dashboard) أو افتح مشروعك الحالي.
2. من **Project Settings → API** انسخ **Project URL** و**anon/public key**.
3. ضع القيم في ملف `.env.local` في جذر المشروع:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
```

4. أعد تشغيل خادم التطوير بعد حفظ الملف.
5. من **Authentication → Providers → Email** تأكد من تفعيل البريد الإلكتروني. يمكن تفعيل تأكيد البريد؛ عندها يتبع المستخدم رسالة التأكيد قبل تسجيل الدخول.
6. من **SQL Editor** شغّل SQL الموجود أدناه لإنشاء جدول الملف الشخصي وسياسات حماية بياناته ومساحة صور الحساب.
7. لإرسال رسائل التأكيد واستعادة كلمة المرور من الموقع المنشور، اضبط رابط الموقع ضمن **Authentication → URL Configuration** وأضف رابط إعادة التوجيه `/login` إلى قائمة Redirect URLs.

استخدم مفتاح anon/publishable فقط في تطبيق الويب. لا تضع `service_role` أو كلمات مرور المستخدمين في `.env.local` أو في كود الواجهة. الملف مستثنى من Git.

## إنشاء جدول الملفات الشخصية

شغّل هذا مرة واحدة في SQL Editor. كل مستخدم يستطيع قراءة اسمه وبريده وتحديث اسمه فقط؛ سياسات RLS تمنع المستخدمين من رؤية ملفات بعضهم.

```sql
create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    full_name text not null default '',
    email text not null default '',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select on table public.profiles to authenticated;
grant update (full_name) on table public.profiles to authenticated;

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

create or replace function public.sync_profile_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, full_name, email)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', ''),
        coalesce(new.email, '')
    )
    on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        updated_at = now();

    return new;
end;
$$;

drop trigger if exists on_auth_user_profile_sync on auth.users;
create trigger on_auth_user_profile_sync
    after insert or update of email, raw_user_meta_data on auth.users
    for each row execute function public.sync_profile_from_auth_user();
```

## إعداد تخزين صور الحساب

شغّل هذا الجزء مرة واحدة من **SQL Editor** أيضًا. الصور في bucket عام حتى تظهر في صورة الحساب والهيدر؛ لذلك يمكن لأي شخص لديه رابط الصورة مشاهدتها. الرفع والتعديل والحذف مقيدة بمجلد المستخدم نفسه. الواجهة تقبل JPG وPNG وWebP بحد أقصى 5 ميجابايت.

```sql
insert into storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
values (
    'avatars',
    'avatars',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
    on storage.objects for insert
    to authenticated
    with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
    on storage.objects for update
    to authenticated
    using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    )
    with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
    on storage.objects for delete
    to authenticated
    using (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );
```

بعدها، من صفحة **حسابي** اضغط **تغيير الصورة** واختر صورة مناسبة. بعد نجاح الرفع ستظهر في الحساب والهيدر، وسيتم حذف الصورة السابقة تلقائيًا إذا كانت مرفوعة من الحساب نفسه.

## تفعيل تدريب الأفراد وأرقام الطلاب

شغّل SQL التالي مرة واحدة في **SQL Editor** بعد إعداد جدول `profiles`. ينشئ رقمًا متسلسلًا وفريدًا لكل طالب عند أول تفعيل، ويحفظ حالة التفعيل حتى بعد تسجيل الخروج والدخول. محاولات كود المالك محدودة بخمس محاولات قبل إيقاف المحاولة 15 دقيقة.

```sql
alter table public.profiles
    add column if not exists student_id text,
    add column if not exists individual_training_activated_at timestamptz;

create sequence if not exists public.student_id_sequence;

create unique index if not exists profiles_student_id_unique
    on public.profiles (student_id)
    where student_id is not null;

create table if not exists public.individual_activation_attempts (
    user_id uuid primary key references auth.users (id) on delete cascade,
    failed_attempts integer not null default 0,
    blocked_until timestamptz,
    updated_at timestamptz not null default now()
);

alter table public.individual_activation_attempts enable row level security;
revoke all on table public.individual_activation_attempts from public, anon, authenticated;
grant all on table public.individual_activation_attempts to service_role;
revoke all on sequence public.student_id_sequence from public, anon, authenticated;

create or replace function public.can_attempt_individual_activation(p_user_id uuid)
returns boolean
language sql
security definer
set search_path = ''
as $$
    select not exists (
        select 1
        from public.individual_activation_attempts
        where user_id = p_user_id
          and blocked_until > now()
    );
$$;

create or replace function public.record_individual_activation_attempt(
    p_user_id uuid,
    p_succeeded boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    current_attempt public.individual_activation_attempts%rowtype;
    next_attempt_count integer;
begin
    if p_succeeded then
        delete from public.individual_activation_attempts where user_id = p_user_id;
        return;
    end if;

    insert into public.individual_activation_attempts (user_id)
    values (p_user_id)
    on conflict (user_id) do nothing;

    select *
    into current_attempt
    from public.individual_activation_attempts
    where user_id = p_user_id
    for update;

    if current_attempt.blocked_until is not null
       and current_attempt.blocked_until <= now() then
        next_attempt_count := 1;
    else
        next_attempt_count := current_attempt.failed_attempts + 1;
    end if;

    update public.individual_activation_attempts
    set failed_attempts = next_attempt_count,
        blocked_until = case
            when next_attempt_count >= 5 then now() + interval '15 minutes'
            else null
        end,
        updated_at = now()
    where user_id = p_user_id;
end;
$$;

drop function if exists public.mark_student_id_email_sent(uuid);
drop function if exists public.activate_individual_training(uuid, text, text);

create function public.activate_individual_training(
    p_user_id uuid,
    p_full_name text,
    p_email text
)
returns table (
    student_id text,
    individual_training_activated_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
    existing_profile public.profiles%rowtype;
    generated_student_id text;
    activation_time timestamptz;
begin
    insert into public.profiles (id, full_name, email)
    values (p_user_id, coalesce(p_full_name, ''), p_email)
    on conflict (id) do nothing;

    select *
    into existing_profile
    from public.profiles
    where id = p_user_id
    for update;

    if existing_profile.individual_training_activated_at is not null
       and existing_profile.student_id is not null then
        return query
            select existing_profile.student_id,
                   existing_profile.individual_training_activated_at;
        return;
    end if;

    generated_student_id :=
        'TS-' || to_char(timezone('utc', now()), 'YYYY') || '-'
        || lpad(nextval('public.student_id_sequence'::regclass)::text, 6, '0');
    activation_time := now();

    update public.profiles
    set student_id = generated_student_id,
        individual_training_activated_at = activation_time,
        updated_at = activation_time
    where id = p_user_id;

    return query select generated_student_id, activation_time;
end;
$$;

revoke all on function public.can_attempt_individual_activation(uuid) from public, anon, authenticated;
revoke all on function public.record_individual_activation_attempt(uuid, boolean) from public, anon, authenticated;
revoke all on function public.activate_individual_training(uuid, text, text) from public, anon, authenticated;

grant execute on function public.can_attempt_individual_activation(uuid) to service_role;
grant execute on function public.record_individual_activation_attempt(uuid, boolean) to service_role;
grant execute on function public.activate_individual_training(uuid, text, text) to service_role;
```

## التحقق من دخول صفحة الوظائف

تستخدم صفحة `/jobs` كود المالك نفسه، لكن التحقق منفصل عن تفعيل تدريب الأفراد؛ إدخال الكود هنا لا ينشئ رقم طالب ولا يغير ملف الحساب. يلزم تسجيل الدخول وتأكيد البريد الإلكتروني. لتحديد محاولات إدخال الكود، شغّل SQL التالي مرة واحدة في **SQL Editor**:

```sql
create table if not exists public.jobs_access_attempts (
    user_id uuid primary key references auth.users (id) on delete cascade,
    failed_attempts integer not null default 0,
    blocked_until timestamptz,
    updated_at timestamptz not null default now()
);

alter table public.jobs_access_attempts enable row level security;
revoke all on table public.jobs_access_attempts from public, anon, authenticated;
grant all on table public.jobs_access_attempts to service_role;

create or replace function public.record_jobs_access_attempt(
    p_user_id uuid,
    p_succeeded boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
    current_attempt public.jobs_access_attempts%rowtype;
    next_attempt_count integer;
begin
    insert into public.jobs_access_attempts (user_id)
    values (p_user_id)
    on conflict (user_id) do nothing;

    select *
    into current_attempt
    from public.jobs_access_attempts
    where user_id = p_user_id
    for update;

    if current_attempt.blocked_until is not null
       and current_attempt.blocked_until > now() then
        return false;
    end if;

    if p_succeeded then
        delete from public.jobs_access_attempts where user_id = p_user_id;
        return true;
    end if;

    if current_attempt.blocked_until is not null
       and current_attempt.blocked_until <= now() then
        next_attempt_count := 1;
    else
        next_attempt_count := current_attempt.failed_attempts + 1;
    end if;

    update public.jobs_access_attempts
    set failed_attempts = next_attempt_count,
        blocked_until = case
            when next_attempt_count >= 5 then now() + interval '15 minutes'
            else null
        end,
        updated_at = now()
    where user_id = p_user_id;

    return true;
end;
$$;

revoke all on function public.record_jobs_access_attempt(uuid, boolean) from public, anon, authenticated;
grant execute on function public.record_jobs_access_attempt(uuid, boolean) to service_role;
```

بعدها انشر دالة التحقق الجديدة. ستستخدم سر `OWNER_ACTIVATION_CODE` الموجود بالفعل في Supabase، ولا تضف الرمز إلى متغيرات `VITE_` أو كود الواجهة:

```text
npx supabase functions deploy verify-jobs-access
```

الصفحة تعرض مسمى ومهام ومهارات مهنية مرتبطة بكل كورس، وليست تأكيدًا على وجود شواغر فعلية. نموذج التقديم يرسل بيانات المتقدم واسم المسار إلى نموذج الوظائف في Formspree (`mbggkeyd`).

### إعداد كود المالك ونشر دالة التفعيل

لا يحتاج كود المالك إلى Resend أو دومين بريد. احتفظ بالكود عندك وشاركه يدويًا مع الطلاب في جروب واتساب. لا تضعه في React أو في متغيرات `VITE_`.

1. ثبّت Supabase CLI وسجّل الدخول واربط مجلد المشروع بمشروع Supabase. بعد تثبيته كاعتماد للمشروع، استخدم:

```text
npx supabase login
npx supabase link --project-ref gzzmrwdolrhjhzpovytg
```

2. أضف كود المالك كسر في Supabase، ولا تشاركه إلا مع طلابك:

```text
npx supabase secrets set OWNER_ACTIVATION_CODE="اكتب-كود-المالك-هنا"
```

3. انشر الدالة من جذر المشروع:

```text
npx supabase functions deploy activate-individual
```

4. اترك تأكيد البريد الإلكتروني مفعّلًا في Supabase Auth. الطالب يحتاج حسابًا مسجلًا وبريدًا مؤكدًا قبل إدخال كود المالك.

في صفحة `/traning/induvial` يدخل الطالب كود المالك مرة واحدة. يتحقق الخادم منه، وينشئ رقمًا مثل `TS-2026-000001`، ويحفظ حالة التفعيل؛ ثم يظهر الرقم للطالب في صفحة التفعيل وصفحة حسابه دون طلب الكود مرة أخرى أو إرسال بريد إضافي.

بعد نسخ الرقم التعريفي، ينتقل الطالب إلى فورم تسجيل الأفراد. الفورم يتأكد من تسجيل الدخول وتأكيد البريد والتفعيل، ثم يرسل الاسم والبريد ورقم الطالب ورقم الهاتف وأي تفاصيل إضافية إلى Formspree الحالي. لا يمكن فتح الفورم وإرساله قبل اكتمال التفعيل.

لمراجعة أرقام الطلاب من لوحة Supabase، افتح **SQL Editor** وشغّل:

```sql
select full_name, email, student_id, individual_training_activated_at
from public.profiles
where individual_training_activated_at is not null
order by individual_training_activated_at desc;
```

الحسابات الموجودة حاليًا في Firebase لا تنتقل تلقائيًا إلى Supabase؛ يلزم للمستخدمين إنشاء حسابات جديدة، أو تنفيذ ترحيل منفصل وآمن إذا كانت هناك بيانات قديمة يجب نقلها.

## لوحة الإدارة ومتابعة الطلبات والتقييمات

تتطلب الطلبات والتقييمات الجداول والدوال الجديدة. أكمل أولًا إعداد جدول `profiles` وSQL تفعيل تدريب الأفراد الموثقين في هذا الدليل حتى يتوفر عمود `individual_training_activated_at`. بعد ذلك افتح الملف `supabase/migrations/20261030000000_site_requests_and_reviews.sql` وشغّل محتواه كاملًا في **Supabase → SQL Editor**. لا تشغّل ملف README في SQL Editor.

أضف بريد حساب الإدارة الذي يستخدم Supabase Auth إلى سر خادمي؛ لا تضعه في متغير يبدأ بـ`VITE_`:

```text
npx supabase secrets set ADMIN_EMAILS="your-admin-email@example.com"
```

استبدل البريد بعنوان حساب الإدارة المؤكد. إذا أضفت أكثر من مدير، افصل عناوين البريد بفواصل. بعد ذلك انشر الدوال من مجلد المشروع:

```text
npx supabase functions deploy submit-request
npx supabase functions deploy submit-review
npx supabase functions deploy admin-requests
```

صفحة الإدارة `/admin` تقبل البريد المحدد فقط، وتعرض طلبات الاشتراك والتقديم وتسمح بتغيير الحالة، كما تسمح باعتماد التقييمات أو رفضها. يتضمن تبويب «أسماء المسجلين» أسماء الحسابات فقط، ولا يظهر إلا للإدارة المصرح لها. المستخدم العادي يرى طلباته هو فقط في صفحة `/account`؛ أما حساب الإدارة فلا يعرض سجل الطلبات الشخصي، وتبقى الطلبات في لوحة `/admin`. طلبات الكورسات تتطلب تسجيل الدخول وبريدًا مؤكدًا حتى يمكن ربطها بالحساب. يستمر إرسال نسخة من نماذج الكورسات إلى Formspree (`xyeepobk`) ومن نماذج المسارات المهنية إلى Formspree (`mbggkeyd`) بالإضافة إلى حفظها داخل Supabase.

يستطيع الطالب ذو حساب تدريب أفراد مفعّل إرسال تقييم واحد لكل كورس في المرة الواحدة. لا يظهر التقييم للعامة حتى يعتمد في لوحة الإدارة. تعريف «موثّق» هنا هو أن الحساب مفعّل؛ هذا لا يثبت دفع ثمن الكورس.

## البحث والأسئلة الشائعة والسياسات

صفحة الكورسات تدعم البحث والتصفية بالمجال والسعر المتاح في بيانات الكتالوج. لا تتضمن بيانات الكورسات الحالية مستوى أو مدة معتمدة، لذلك لا تعرض فلاتر مخترعة لهما. صفحات `/faq` و`/policies` متاحة من تذييل الموقع. سياسة الإلغاء والاسترداد معروضة كمسودة تحتاج اعتماد مالك المنصة قبل اعتبارها شروطًا رسمية.
