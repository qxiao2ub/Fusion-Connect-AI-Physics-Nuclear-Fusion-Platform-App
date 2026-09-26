-- Fusion Connect AI: persistent cumulative anonymous app-user counter
-- Run once in Supabase SQL Editor before deploying the Streamlit app.
-- The Streamlit server uses SUPABASE_SERVICE_ROLE_KEY, so RLS can remain enabled.

create table if not exists public.app_visits (
    session_id text primary key,
    created_at timestamptz not null default now(),
    referral_source text not null default 'organic'
);

create index if not exists app_visits_created_at_idx on public.app_visits (created_at);
create index if not exists app_visits_referral_source_idx on public.app_visits (referral_source);

alter table public.app_visits enable row level security;

comment on table public.app_visits is
'Anonymous Streamlit session access records used for the cumulative public app-user count. No names, email addresses, or exact demographics are stored here.';
