-- =============================================
-- CREATE MISSING TABLES ONLY
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CREATE TABLES IF NOT EXISTS
-- =============================================

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    greeting VARCHAR(100) NOT NULL DEFAULT 'Hello, World!',
    name VARCHAR(100) NOT NULL,
    titles TEXT[] NOT NULL DEFAULT '{}',
    description TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    instagram_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About
CREATE TABLE IF NOT EXISTS about (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    summary TEXT,
    location VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    about_id UUID REFERENCES about(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    about_id UUID REFERENCES about(id) ON DELETE CASCADE,
    role VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    about_id UUID REFERENCES about(id) ON DELETE CASCADE,
    degree VARCHAR(150) NOT NULL,
    school VARCHAR(150) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    about_id UUID REFERENCES about(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    issuer VARCHAR(150) NOT NULL,
    date VARCHAR(100) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing Plans
CREATE TABLE IF NOT EXISTS pricing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    features TEXT[] DEFAULT '{}',
    popular BOOLEAN DEFAULT FALSE,
    color VARCHAR(20) DEFAULT '#00ff9d',
    icon_type VARCHAR(20) DEFAULT 'globe',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    date VARCHAR(50) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Comments
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    date VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS POLICIES FOR CONTACT MESSAGES
-- =============================================

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin can delete contact messages" ON contact_messages;

-- Create policies
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view contact messages" ON contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update contact messages" ON contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete contact messages" ON contact_messages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT INSERT ON contact_messages TO anon;
GRANT SELECT, UPDATE, DELETE ON contact_messages TO authenticated;
