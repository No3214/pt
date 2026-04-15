-- ============================================================================
-- Bookings table for the Ela Ebeoğlu PT booking flow
-- Creates the table, RLS policies (admin full access, public insert-only),
-- enables realtime, and sets up updated_at trigger.
-- ============================================================================

-- Enum for booking status
do $$ begin
  create type booking_status as enum (
    'pending', 'approved', 'paid', 'scheduled', 'completed', 'rejected'
  );
exception when duplicate_object then null; end $$;

-- Enum for session type
do $$ begin
  create type session_type as enum ('consultation', 'assessment', 'training');
exception when duplicate_object then null; end $$;

-- Enum for meeting platform
do $$ begin
  create type meeting_type as enum ('zoom', 'teams', 'meet', 'other');
exception when duplicate_object then null; end $$;

-- Main table
create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  name             text        not null,
  email            text        not null,
  phone            text        not null,
  goal             text        not null default '',
  message          text,
  session_type     session_type not null default 'consultation',
  preferred_day    text,
  preferred_time   text,
  preferred_date   date,
  status           booking_status not null default 'pending',
  price            numeric(10, 2),
  meeting_link     text,
  meeting_type     meeting_type,
  scheduled_date   date,
  scheduled_time   text,
  admin_note       text,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Index for fast status filtering in admin panel
create index if not exists bookings_status_idx   on public.bookings (status);
create index if not exists bookings_created_idx  on public.bookings (created_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.bookings enable row level security;

-- Public (anon) can only INSERT new booking requests — no read / update / delete
drop policy if exists "anon_insert_bookings" on public.bookings;
create policy "anon_insert_bookings"
  on public.bookings
  for insert
  to anon
  with check (true);

-- Authenticated users (admin) get full access
drop policy if exists "admin_full_access_bookings" on public.bookings;
create policy "admin_full_access_bookings"
  on public.bookings
  for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================================
-- Realtime
-- ============================================================================
-- Add table to supabase_realtime publication so clients can subscribe
do $$ begin
  alter publication supabase_realtime add table public.bookings;
exception when duplicate_object then null; end $$;
