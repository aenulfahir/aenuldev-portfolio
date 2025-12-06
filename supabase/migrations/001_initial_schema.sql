-- =============================================
-- SUPABASE DATABASE SCHEMA FOR PORTFOLIO WEBSITE
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE (Hero Section Data)
-- =============================================
CREATE TABLE profiles (
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

-- =============================================
-- 2. ABOUT TABLE
-- =============================================
CREATE TABLE about (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    summary TEXT,
    location VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. SKILLS TABLE
-- =============================================
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    about_id UUID REFERENCES about(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. EXPERIENCES TABLE
-- =============================================
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    about_id UUID REFERENCES about(id) ON DELETE CASCADE,
    role VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. EDUCATION TABLE
-- =============================================
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    about_id UUID REFERENCES about(id) ON DELETE CASCADE,
    degree VARCHAR(150) NOT NULL,
    school VARCHAR(150) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. CERTIFICATIONS TABLE
-- =============================================
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    about_id UUID REFERENCES about(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    issuer VARCHAR(150) NOT NULL,
    date VARCHAR(100) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. PROJECTS TABLE
-- =============================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    date VARCHAR(50) NOT NULL,
    description TEXT,
    tech TEXT[] DEFAULT '{}',
    type VARCHAR(20) CHECK (type IN ('web', 'mobile', 'other')) DEFAULT 'other',
    link VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 8. PRICING PLANS TABLE
-- =============================================
CREATE TABLE pricing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    features TEXT[] DEFAULT '{}',
    popular BOOLEAN DEFAULT FALSE,
    color VARCHAR(20) DEFAULT '#00ff9d',
    icon_type VARCHAR(20) CHECK (icon_type IN ('bot', 'globe', 'zap')) DEFAULT 'globe',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 9. BLOG POSTS TABLE
-- =============================================
CREATE TABLE blog_posts (
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

-- =============================================
-- 10. BLOG COMMENTS TABLE
-- =============================================
CREATE TABLE blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    date VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 11. CONTACT MESSAGES TABLE
-- =============================================
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR BETTER PERFORMANCE
-- =============================================
CREATE INDEX idx_skills_about_id ON skills(about_id);
CREATE INDEX idx_experiences_about_id ON experiences(about_id);
CREATE INDEX idx_education_about_id ON education(about_id);
CREATE INDEX idx_certifications_about_id ON certifications(about_id);
CREATE INDEX idx_blog_comments_post_id ON blog_comments(blog_post_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_updated_at BEFORE UPDATE ON about FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON pricing_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
