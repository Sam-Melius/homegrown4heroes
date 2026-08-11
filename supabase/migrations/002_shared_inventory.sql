create table if not exists public.shared_inventory (
  id integer primary key default 1 check (id = 1),
  title text not null default 'Shared Inventory',
  content text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.shared_inventory (id, title, content)
values (1, 'Shared Inventory', '')
on conflict (id) do nothing;

alter table public.shared_inventory enable row level security;

create policy "approved users read shared inventory"
on public.shared_inventory
for select
to authenticated
using (public.is_approved());

create policy "admins manage shared inventory"
on public.shared_inventory
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
