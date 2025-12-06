-- Fix RLS policies for orders table
-- This allows public (unauthenticated) users to create orders

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Public can insert orders" ON orders;

-- Recreate policies with correct permissions

-- Policy 1: Allow public (anonymous) users to INSERT orders
-- This is crucial for the order form to work without login
CREATE POLICY "Public can insert orders"
  ON orders 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Only authenticated users can SELECT (view) orders
CREATE POLICY "Authenticated users can view orders"
  ON orders 
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 3: Only authenticated users can UPDATE orders
CREATE POLICY "Authenticated users can update orders"
  ON orders 
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 4: Only authenticated users can DELETE orders
CREATE POLICY "Authenticated users can delete orders"
  ON orders 
  FOR DELETE
  TO authenticated
  USING (true);

-- Verify RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to anon role
GRANT INSERT ON orders TO anon;
