create table if not exists public.lounge_edible_times (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  minutes integer not null check (minutes >= 0),
  position integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.lounge_flower_times (
  id uuid primary key default gen_random_uuid(),
  rating text not null unique,
  minutes_1 integer not null check (minutes_1 >= 0),
  minutes_2 integer not null check (minutes_2 >= 0),
  minutes_3 integer not null check (minutes_3 >= 0),
  minutes_4 integer not null check (minutes_4 >= 0),
  position integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.lounge_edible_times enable row level security;
alter table public.lounge_flower_times enable row level security;

create policy "approved users read edible times"
on public.lounge_edible_times
for select
to authenticated
using (public.is_approved());

create policy "admins manage edible times"
on public.lounge_edible_times
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "approved users read flower times"
on public.lounge_flower_times
for select
to authenticated
using (public.is_approved());

create policy "admins manage flower times"
on public.lounge_flower_times
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.lounge_edible_times (label, minutes, position) values
  ('100 MG', 15, 1),
  ('200 MG', 20, 2),
  ('500 MG', 30, 3)
on conflict (label) do nothing;

insert into public.lounge_flower_times
  (rating, minutes_1, minutes_2, minutes_3, minutes_4, position)
values
  ('AAAAA', 45, 85, 125, 225, 1),
  ('AAAA', 40, 75, 115, 210, 2),
  ('AAA', 35, 65, 110, 190, 3),
  ('AA', 30, 50, 90, 160, 4),
  ('A', 25, 40, 75, 140, 5),
  ('O', 20, 35, 65, 120, 6)
on conflict (rating) do nothing;
