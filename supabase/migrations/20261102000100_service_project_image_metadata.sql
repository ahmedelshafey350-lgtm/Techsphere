-- Add public image attribution and accessible text without changing existing
-- project records or the separate public image/private-document storage buckets.
alter table public.service_projects
    add column if not exists image_source_url text,
    add column if not exists image_license text,
    add column if not exists image_alt_text text not null default '';

alter table public.service_project_categories
    add column if not exists image_alt_text text not null default '';
