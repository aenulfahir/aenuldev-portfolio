import { supabase } from "../supabase";

export interface BlogComment {
  id: string;
  user_name: string;
  text: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  comments?: BlogComment[];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
  return (data || []).map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt || "",
    content: p.content,
    date: p.date,
    author: p.author,
    category: p.category,
  }));
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const { data: post, error: postError } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (postError || !post) {
    console.error("Error fetching blog post:", postError);
    return null;
  }

  const { data: comments } = await supabase
    .from("blog_comments")
    .select("*")
    .eq("blog_post_id", id)
    .order("created_at");

  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content,
    date: post.date,
    author: post.author,
    category: post.category,
    comments: (comments || []).map((c) => ({
      id: c.id,
      user_name: c.user_name,
      text: c.text,
      date: c.date,
    })),
  };
}

export async function addBlogPost(post: Omit<BlogPost, "id" | "comments">) {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      author: post.author,
      category: post.category,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      author: post.author,
      category: post.category,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw error;
}

export async function addComment(
  blogPostId: string,
  userName: string,
  text: string
) {
  const { data, error } = await supabase
    .from("blog_comments")
    .insert({
      blog_post_id: blogPostId,
      user_name: userName,
      text,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteComment(id: string) {
  const { error } = await supabase.from("blog_comments").delete().eq("id", id);

  if (error) throw error;
}
