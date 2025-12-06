-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PUBLIC READ POLICIES (Anyone can read)
-- =============================================

-- Profiles - Public Read
CREATE POLICY "Public can view profiles" ON profiles
    FOR SELECT USING (true);

-- About - Public Read
CREATE POLICY "Public can view about" ON about
    FOR SELECT USING (true);

-- Skills - Public Read
CREATE POLICY "Public can view skills" ON skills
    FOR SELECT USING (true);

-- Experiences - Public Read
CREATE POLICY "Public can view experiences" ON experiences
    FOR SELECT USING (true);

-- Education - Public Read
CREATE POLICY "Public can view education" ON education
    FOR SELECT USING (true);

-- Certifications - Public Read
CREATE POLICY "Public can view certifications" ON certifications
    FOR SELECT USING (true);

-- Projects - Public Read
CREATE POLICY "Public can view projects" ON projects
    FOR SELECT USING (true);

-- Pricing Plans - Public Read
CREATE POLICY "Public can view pricing plans" ON pricing_plans
    FOR SELECT USING (true);

-- Blog Posts - Public Read
CREATE POLICY "Public can view blog posts" ON blog_posts
    FOR SELECT USING (true);

-- Blog Comments - Public Read
CREATE POLICY "Public can view blog comments" ON blog_comments
    FOR SELECT USING (true);

-- =============================================
-- PUBLIC INSERT POLICIES (Limited)
-- =============================================

-- Anyone can submit contact messages
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Anyone can add blog comments
CREATE POLICY "Anyone can add blog comments" ON blog_comments
    FOR INSERT WITH CHECK (true);

-- =============================================
-- AUTHENTICATED USER POLICIES (Admin)
-- =============================================

-- Profiles - Admin can update
CREATE POLICY "Admin can update profiles" ON profiles
    FOR UPDATE USING (auth.role() = 'authenticated');

-- About - Admin can update
CREATE POLICY "Admin can update about" ON about
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Skills - Admin full access
CREATE POLICY "Admin can manage skills" ON skills
    FOR ALL USING (auth.role() = 'authenticated');

-- Experiences - Admin full access
CREATE POLICY "Admin can manage experiences" ON experiences
    FOR ALL USING (auth.role() = 'authenticated');

-- Education - Admin full access
CREATE POLICY "Admin can manage education" ON education
    FOR ALL USING (auth.role() = 'authenticated');

-- Certifications - Admin full access
CREATE POLICY "Admin can manage certifications" ON certifications
    FOR ALL USING (auth.role() = 'authenticated');

-- Projects - Admin full access
CREATE POLICY "Admin can manage projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

-- Pricing Plans - Admin full access
CREATE POLICY "Admin can manage pricing plans" ON pricing_plans
    FOR ALL USING (auth.role() = 'authenticated');

-- Blog Posts - Admin full access
CREATE POLICY "Admin can manage blog posts" ON blog_posts
    FOR ALL USING (auth.role() = 'authenticated');

-- Blog Comments - Admin can delete
CREATE POLICY "Admin can delete blog comments" ON blog_comments
    FOR DELETE USING (auth.role() = 'authenticated');

-- Contact Messages - Admin full access
CREATE POLICY "Admin can view contact messages" ON contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update contact messages" ON contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete contact messages" ON contact_messages
    FOR DELETE USING (auth.role() = 'authenticated');
