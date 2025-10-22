-- Create a storage bucket for logos
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true);

-- Allow authenticated users to upload their own logos
create policy "Users can upload their own logos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'logos' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to view their own logos
create policy "Users can view their own logos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'logos' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own logos
create policy "Users can update their own logos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'logos' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own logos
create policy "Users can delete their own logos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'logos' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a profiles table to store user information including logo URL
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  logo_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Users can view their own profile
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id);

-- Trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();