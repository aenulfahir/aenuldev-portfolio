-- =============================================
-- ADD REPLY FEATURE TO BLOG COMMENTS
-- =============================================

-- Add parent_id column for nested replies
ALTER TABLE blog_comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE;

-- Create index for faster reply lookups
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
