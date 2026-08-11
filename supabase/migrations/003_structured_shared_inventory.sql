create table if not exists public.inventory_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.inventory_categories(id) on delete cascade,
  name text not null,
  details text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inventory_categories enable row level security;
alter table public.inventory_items enable row level security;

create policy "approved users read inventory categories"
on public.inventory_categories
for select
to authenticated
using (public.is_approved());

create policy "admins manage inventory categories"
on public.inventory_categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "approved users read inventory items"
on public.inventory_items
for select
to authenticated
using (public.is_approved());

create policy "admins manage inventory items"
on public.inventory_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.inventory_categories (name, position)
select seed.name, seed.position
from (
  values
    ('Flower', 1),
    ('Pre-Rolls', 2),
    ('Concentrates', 3),
    ('Vapes', 4),
    ('Edibles', 5),
    ('Beverages', 6),
    ('Snacks', 7)
) as seed(name, position)
where not exists (
  select 1
  from public.inventory_categories
);
