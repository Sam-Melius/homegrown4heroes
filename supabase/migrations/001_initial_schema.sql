-- Run this entire file in Supabase SQL Editor for a new project.
create extension if not exists pgcrypto;

create type public.member_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type public.member_role as enum ('member', 'admin');
create type public.order_status as enum ('new', 'reviewed', 'completed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  discord_name text not null,
  status public.member_status not null default 'pending',
  role public.member_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.channels (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table public.daily_menus (
  id uuid primary key default gen_random_uuid(),
  menu_date date not null unique,
  title text not null,
  content text not null,
  order_deadline text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  items text not null,
  notes text,
  status public.order_status not null default 'new',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, discord_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name', coalesce(new.raw_user_meta_data ->> 'discord_name', 'Not supplied'));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_approved()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = auth.uid() and status = 'approved');
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = auth.uid() and status = 'approved' and role = 'admin');
$$;

grant execute on function public.is_approved() to authenticated;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.channels enable row level security;
alter table public.messages enable row level security;
alter table public.daily_menus enable row level security;
alter table public.orders enable row level security;

create policy "members read own profile or admins read all" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "admins update profiles" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "approved users read channels" on public.channels for select to authenticated using (public.is_approved());
create policy "admins manage channels" on public.channels for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "approved users read messages" on public.messages for select to authenticated using (public.is_approved());
create policy "approved users create messages" on public.messages for insert to authenticated with check (public.is_approved() and user_id = auth.uid());
create policy "members delete own messages" on public.messages for delete to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "approved users read menus" on public.daily_menus for select to authenticated using (public.is_approved());
create policy "admins manage menus" on public.daily_menus for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "members create orders" on public.orders for insert to authenticated with check (public.is_approved() and user_id = auth.uid());
create policy "members read own orders admins read all" on public.orders for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "admins update orders" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.channels (name, description, position) values
  ('announcements', 'Updates from Homegrown4Heroes', 1),
  ('general', 'Everyday community conversation', 2),
  ('questions', 'Ask the group and share knowledge', 3)
on conflict (name) do nothing;

alter publication supabase_realtime add table public.messages;

-- After your own account signs up, make it the first administrator:
-- update public.profiles set status = 'approved', role = 'admin' where id = (select id from auth.users where email = 'YOUR_EMAIL');
