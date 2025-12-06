-- Create orders table for pricing orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id TEXT NOT NULL,
  plan_title TEXT NOT NULL,
  plan_price TEXT NOT NULL,
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  
  -- Project Details
  project_name TEXT NOT NULL,
  project_description TEXT NOT NULL,
  timeline TEXT NOT NULL,
  budget TEXT,
  target_audience TEXT,
  preferred_start_date DATE,
  
  -- Requirements
  selected_features TEXT[] DEFAULT '{}',
  additional_features TEXT,
  design_preference TEXT DEFAULT 'modern',
  has_existing_design TEXT DEFAULT 'no',
  has_content_ready TEXT DEFAULT 'no',
  additional_notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS orders_email_idx ON orders(email);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can view orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Public can insert orders" ON orders;

-- Policy: Anyone can insert orders (public can order) - NO AUTH REQUIRED
CREATE POLICY "Public can insert orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Only authenticated users can view orders (admin only)
CREATE POLICY "Authenticated users can view orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update orders (admin only)
CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();
