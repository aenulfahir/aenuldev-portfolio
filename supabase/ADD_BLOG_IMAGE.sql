-- Add image column to blog_posts table
-- Run this in Supabase SQL Editor

ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS image TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blog_posts';
