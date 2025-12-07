-- =============================================
-- Supabase SQL Migration: Project Images
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================

-- 1. Add image columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS image2 TEXT,
ADD COLUMN IF NOT EXISTS image3 TEXT;

-- 2. Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Allow public read access to project images
CREATE POLICY "Public read access for project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- 4. Allow authenticated users to upload project images
CREATE POLICY "Authenticated users can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images');

-- 5. Allow authenticated users to update project images
CREATE POLICY "Authenticated users can update project images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-images');

-- 6. Allow authenticated users to delete project images
CREATE POLICY "Authenticated users can delete project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images');
