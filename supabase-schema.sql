-- ============================================================
-- PASAL Student Engagement Portal — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ========================
-- 1. CONCERNS
-- ========================
CREATE TABLE IF NOT EXISTS public.concerns (
  id          TEXT PRIMARY KEY DEFAULT 'UG-' || floor(1000 + random() * 9000)::TEXT,
  campus      TEXT NOT NULL CHECK (campus IN ('Main', 'City', 'Satellite')),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  anonymous   BOOLEAN NOT NULL DEFAULT TRUE,
  username    TEXT,
  status      TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewed', 'Resolved')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.concerns ENABLE ROW LEVEL SECURITY;

-- Anyone can read concerns
CREATE POLICY "Allow public read" ON public.concerns
  FOR SELECT USING (true);

-- Anyone can insert concerns (students submit anonymously or with name)
CREATE POLICY "Allow public insert" ON public.concerns
  FOR INSERT WITH CHECK (true);

-- Only authenticated admins can update concern status
CREATE POLICY "Allow admin update" ON public.concerns
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated admins can delete
CREATE POLICY "Allow admin delete" ON public.concerns
  FOR DELETE USING (auth.role() = 'authenticated');


-- ========================
-- 2. SUGGESTIONS
-- ========================
CREATE TABLE IF NOT EXISTS public.suggestions (
  id          TEXT PRIMARY KEY DEFAULT 'SUG-' || floor(100 + random() * 900)::TEXT,
  campus      TEXT NOT NULL CHECK (campus IN ('Main', 'City', 'Satellite')),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  anonymous   BOOLEAN NOT NULL DEFAULT TRUE,
  username    TEXT,
  likes       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.suggestions
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON public.suggestions
  FOR INSERT WITH CHECK (true);

-- Allow update for likes increment (public) and admin full update
CREATE POLICY "Allow public update likes" ON public.suggestions
  FOR UPDATE USING (true);

CREATE POLICY "Allow admin delete" ON public.suggestions
  FOR DELETE USING (auth.role() = 'authenticated');


-- ========================
-- 3. OPPORTUNITIES
-- ========================
CREATE TABLE IF NOT EXISTS public.opportunities (
  id               TEXT PRIMARY KEY DEFAULT 'OPP-' || floor(100 + random() * 900)::TEXT,
  title            TEXT NOT NULL,
  category         TEXT NOT NULL CHECK (category IN ('Internship', 'National Service')),
  description      TEXT NOT NULL,
  application_link TEXT NOT NULL,
  deadline         TIMESTAMPTZ NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.opportunities
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert" ON public.opportunities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update" ON public.opportunities
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete" ON public.opportunities
  FOR DELETE USING (auth.role() = 'authenticated');


-- ========================
-- 4. EVENTS
-- ========================
CREATE TABLE IF NOT EXISTS public.events (
  id          TEXT PRIMARY KEY DEFAULT 'EVT-' || floor(100 + random() * 900)::TEXT,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  venue       TEXT NOT NULL,
  event_date  TIMESTAMPTZ NOT NULL,
  banner_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert" ON public.events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update" ON public.events
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete" ON public.events
  FOR DELETE USING (auth.role() = 'authenticated');


-- ========================
-- 5. ANNOUNCEMENTS
-- ========================
CREATE TABLE IF NOT EXISTS public.announcements (
  id         TEXT PRIMARY KEY DEFAULT 'ANN-' || floor(100 + random() * 900)::TEXT,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.announcements
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert" ON public.announcements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update" ON public.announcements
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete" ON public.announcements
  FOR DELETE USING (auth.role() = 'authenticated');


-- ========================
-- 6. ADMINS TABLE
-- ========================
CREATE TABLE IF NOT EXISTS public.admins (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Only admins can see the admins table
CREATE POLICY "Admins only" ON public.admins
  FOR SELECT USING (auth.uid() = id);


-- ========================
-- 7. INCREMENT_LIKES RPC
-- (Used by likeSuggestion in supabase.ts)
-- ========================
CREATE OR REPLACE FUNCTION public.increment_likes(row_id TEXT)
RETURNS VOID AS $$
  UPDATE public.suggestions
  SET likes = likes + 1
  WHERE id = row_id;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;


-- ========================
-- DONE!
-- ========================
-- After running this script:
-- 1. Go to Authentication → Settings and set Site URL to your Vercel domain
-- 2. Create your admin user in Authentication → Users → Invite User
-- 3. Run this to register them as admin (replace values):
--
-- INSERT INTO public.admins (id, email)
-- VALUES ('<paste-user-uuid>', 'your-email@example.com');
