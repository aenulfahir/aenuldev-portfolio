-- =============================================
-- FIX: Allow public to insert contact messages
-- Run this in Supabase SQL Editor
-- =============================================

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;

-- Create policy to allow anyone to insert contact messages
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Verify RLS is enabled
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Grant insert permission to anon role
GRANT INSERT ON contact_messages TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- If you still get errors, also run:
GRANT SELECT ON contact_messages TO anon;
