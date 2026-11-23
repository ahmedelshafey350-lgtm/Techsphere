-- Optional, additive course-artwork bucket and access policies.
-- Inspect existing storage.objects policies and the bucket ID before applying.
-- Uploads and mutations are performed by the ADMIN_EMAILS-checked admin-requests
-- Edge Function using its server-only service role key.

do $$
begin
    if exists (
        select 1 from storage.buckets where id = 'techsphere-course-assets'
    ) then
        if not exists (
            select 1 from storage.buckets
            where id = 'techsphere-course-assets' and public
        ) then
            raise exception
                'Bucket techsphere-course-assets already exists but is not public; review it manually before continuing.';
        end if;
    else
        insert into storage.buckets (
            id, name, public, file_size_limit, allowed_mime_types
        )
        values (
            'techsphere-course-assets',
            'techsphere-course-assets',
            true,
            5242880,
            array['image/jpeg', 'image/png', 'image/webp']
        );
    end if;
end;
$$;

do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'storage' and tablename = 'objects'
            and policyname = 'Techsphere course assets are publicly readable'
    ) then
        create policy "Techsphere course assets are publicly readable"
            on storage.objects for select to anon, authenticated
            using (bucket_id = 'techsphere-course-assets');
    end if;
end;
$$;
