-- ============================================================
-- Jeev Rakshak Web - Complete Supabase Database Setup
-- Run this entire script in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  location TEXT NOT NULL,
  analysis TEXT NOT NULL,
  image_url TEXT,
  assigned_ngo TEXT,
  status TEXT DEFAULT 'PENDING',
  accepted_at TIMESTAMP WITH TIME ZONE,
  post_treatment_report TEXT,
  post_treatment_image_url TEXT,
  accepted_by_phone TEXT
);

-- Enable Row Level Security (allow public reads/writes for now)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations on reports" ON public.reports;
CREATE POLICY "Allow all operations on reports" ON public.reports FOR ALL USING (true) WITH CHECK (true);

-- 2. Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow all on contact_messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- 3. Create clinics table
CREATE TABLE IF NOT EXISTS public.clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  distance TEXT DEFAULT '0 km',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  address TEXT DEFAULT ''
);

ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on clinics" ON public.clinics;
CREATE POLICY "Allow all on clinics" ON public.clinics FOR ALL USING (true) WITH CHECK (true);

-- 4. Seed clinics table with initial Kanpur clinics
INSERT INTO public.clinics (name, phone, distance, lat, lng, address)
VALUES
  ('Kanpur PFA (People For Animals)', '+919839012345', '1.2 km', 26.4499, 80.3319, 'Kanpur, Uttar Pradesh'),
  ('Jeev Aashraya Kanpur', '+919123456780', '3.5 km', 26.4600, 80.3400, 'Kanpur, Uttar Pradesh'),
  ('Kidwai Nagar Animal Clinic', '+919369617224', '0.8 km', 26.4350, 80.3300, 'Kidwai Nagar, Kanpur')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. Create Storage Bucket for Reports
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reports', 'reports', true) 
ON CONFLICT DO NOTHING;

-- Enable public read/write access for the reports bucket
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING ( bucket_id = 'reports' );
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;
CREATE POLICY "Public Insert Access" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'reports' );

-- 5. Create ngos table (for dashboard access)
CREATE TABLE IF NOT EXISTS public.ngos (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL
);

ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on ngos" ON public.ngos;
CREATE POLICY "Allow all on ngos" ON public.ngos FOR ALL USING (true) WITH CHECK (true);
