-- COPY AND RUN THIS ENTIRE SQL IN SUPABASE SQL EDITOR
-- This will fix the 401 RLS error

-- Step 1: Drop ALL existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'orders') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON orders';
    END LOOP;
END $$;

-- Step 2: Make sure RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 3: Create simple, permissive INSERT policy for anonymous users
CREATE POLICY "allow_anon_insert"
ON orders
FOR INSERT
TO anon
WITH CHECK (true);

-- Step 4: Create INSERT policy for authenticated users too
CREATE POLICY "allow_auth_insert"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 5: Allow authenticated users to SELECT
CREATE POLICY "allow_auth_select"
ON orders
FOR SELECT
TO authenticated
USING (true);

-- Step 6: Allow authenticated users to UPDATE
CREATE POLICY "allow_auth_update"
ON orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 7: Allow authenticated users to DELETE
CREATE POLICY "allow_auth_delete"
ON orders
FOR DELETE
TO authenticated
USING (true);

-- Step 8: Grant table permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.orders TO anon;
GRANT ALL ON public.orders TO authenticated;

-- Step 9: Verify policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;
