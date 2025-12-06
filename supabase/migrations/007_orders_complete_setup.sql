-- Complete Orders Table Setup
-- Run this if you're getting RLS errors or starting fresh

-- Step 1: Drop existing policies (if any)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;
DROP POLICY IF EXISTS "Public can insert orders" ON orders;

-- Step 2: Ensure RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies with correct permissions

-- Allow anonymous (public) users to INSERT orders
CREATE POLICY "Public can insert orders"
  ON orders 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can SELECT (view) orders
CREATE POLICY "Authenticated users can view orders"
  ON orders 
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can UPDATE orders
CREATE POLICY "Authenticated users can update orders"
  ON orders 
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can DELETE orders
CREATE POLICY "Authenticated users can delete orders"
  ON orders 
  FOR DELETE
  TO authenticated
  USING (true);

-- Step 4: Grant necessary permissions
GRANT INSERT ON orders TO anon;
GRANT SELECT, UPDATE, DELETE ON orders TO authenticated;

-- Step 5: Verify setup
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;
