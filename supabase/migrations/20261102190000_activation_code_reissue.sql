-- Allow more than one activation code per project order so that re-issuing a code
-- keeps the history of the code it replaced (who created it, whether it was used).
-- Existing installs keep a unique constraint on order_id; the edge function falls back
-- to replacing the single row in place until this migration is applied.

do $$
declare
    unique_constraint text;
begin
    select con.conname
    into unique_constraint
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'service_project_activation_codes'
      and con.contype = 'u'
      and pg_get_constraintdef(con.oid) = 'UNIQUE (order_id)';

    if unique_constraint is not null then
        execute format(
            'alter table public.service_project_activation_codes drop constraint %I',
            unique_constraint
        );
        raise notice 'Dropped % so a re-issued code can be recorded next to the previous one.', unique_constraint;
    end if;
end
$$;

create index if not exists service_project_activation_codes_order_created_idx
    on public.service_project_activation_codes(order_id, created_at desc);
