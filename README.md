# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Project marketplace setup

The project marketplace adds `service_project_categories`, `service_projects`,
`service_project_document_versions`, `service_project_orders`,
`service_project_access`, `service_project_activation_codes`, and
`service_project_download_logs`, plus the `techsphere-project-images` and
`techsphere-project-private` Storage buckets. It does not modify existing
course, profile, enrollment, or payment tables. Before deploying to the linked
Supabase project:

1. Create and verify a current Supabase backup.
2. Review and apply `supabase/migrations/20261101195000_service_project_marketplace.sql`
   and then `supabase/migrations/20261101195100_service_project_storage.sql`
   in the Supabase SQL Editor. Apply
   `supabase/migrations/20261102000100_service_project_image_metadata.sql`
   afterward to add image attribution and alt-text fields.
3. Optionally run `supabase/seeds/20261101220000_project_catalog_drafts.sql`
   to add the source-backed catalog. It creates seven active categories and
   310 catalog-visible project drafts. Re-running it does not overwrite
   existing rows. Draft prices are unset (`NULL`), titles retain the source
   wording in both locale columns, and project documentation/images still need
   review before any project is published for sale.
4. Configure the `ADMIN_EMAILS` Edge Function secret with the comma-separated
   email addresses authorized to manage projects.
5. Deploy the `service-projects` Edge Function after all required migrations succeed.
6. In **Admin > Services & Projects**, review project titles, set approved
   prices, activate categories, add project documentation/images, and publish
   only projects that are ready for customers. Public catalog visibility is
   independent from sale status and private documentation access. Customers
   can see public descriptions and images for visible projects, while private
   documentation and downloads remain access-checked. The database rejects
   publication without a price greater than zero and derives new order amounts
   from the current project price.

The public Services landing page loads categories only. Category pages request
15 visible projects at a time with an exact database count and range-based
pagination. Public endpoints return marketing fields only; technical
documentation and private-file downloads continue to require active project
access. Customers see the project name, public summary, category, image, and
sale status before activation. Documentation sections such as the overview,
how the project works, benefits, estimated community impact, code, diagrams,
and downloads remain behind the existing activation-code access check. The
admin documentation JSON supports `overview`, `how_it_works`, `benefits`,
`expected_outcomes`, `practical_applications`, and `community_impact`; write
claims only when they are supported by the project source.

The migrations are additive, but they are not automatically reversible after
marketplace data has been added. Do not remove the new tables or buckets as a
rollback; use the verified backup and an explicitly approved recovery plan.
Project catalog details should be transcribed from their cited source
documents, not inferred.
