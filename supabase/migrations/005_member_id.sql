-- Add membership ID to THV profiles and capture it from new signups.
-- Run this migration in Supabase SQL Editor after the existing migrations.

alter table public.profiles
  add column if not exists member_id text;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, member_id, discord_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    nullif(new.raw_user_meta_data ->> 'member_id', ''),
    coalesce(new.raw_user_meta_data ->> 'discord_name', 'Not supplied')
  );
  return new;
end;
$$;
