-- Separate public project images from private project documentation.
-- Server-side Edge Functions using the service-role key handle all uploads.
-- Back up the project before applying this migration.

do $$
begin
    if exists (
        select 1 from storage.buckets
        where id = 'techsphere-project-images' and not public
    ) then
        raise exception 'Bucket techsphere-project-images already exists as private; inspect it before continuing.';
    end if;

    if exists (
        select 1 from storage.buckets
        where id = 'techsphere-project-private' and public
    ) then
        raise exception 'Bucket techsphere-project-private already exists as public; inspect it before continuing.';
    end if;

    insert into storage.buckets (
        id, name, public, file_size_limit, allowed_mime_types
    )
    select
        'techsphere-project-images',
        'techsphere-project-images',
        true,
        5242880,
        array['image/jpeg', 'image/png', 'image/webp']
    where not exists (
        select 1 from storage.buckets where id = 'techsphere-project-images'
    );

    insert into storage.buckets (
        id, name, public, file_size_limit, allowed_mime_types
    )
    select
        'techsphere-project-private',
        'techsphere-project-private',
        false,
        104857600,
        array[
            'application/pdf',
            'application/zip',
            'application/x-zip-compressed',
            'text/plain',
            'text/markdown',
            'application/json',
            'application/octet-stream'
        ]
    where not exists (
        select 1 from storage.buckets where id = 'techsphere-project-private'
    );
end;
$$;

do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'storage'
          and tablename = 'objects'
          and policyname = 'Techsphere project images are publicly readable'
    ) then
        create policy "Techsphere project images are publicly readable"
            on storage.objects for select to anon, authenticated
            using (bucket_id = 'techsphere-project-images');
    end if;
end;
$$;
