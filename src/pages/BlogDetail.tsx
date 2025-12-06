import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { supabase } from "../lib/supabase";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Clock,
  Share2,
  Copy,
  Check,
  Reply,
  User,
} from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";

interface CommentWithReplies {
  id: string;
  user: string;
  text: string;
  date: string;
  parent_id?: string | null;
  replies?: CommentWithReplies[];
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { blog, refreshData } = useData();
  const post = blog.find((p) => p.id === id);

  // Render markdown-like content to HTML
  const renderContent = (content: string) => {
    let html = content;

    // Headers
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 style="font-size: 1.5rem; margin: 2rem 0 1rem; color: var(--text-primary);">$1</h3>'
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 style="font-size: 1.8rem; margin: 2.5rem 0 1rem; color: var(--text-primary);">$1</h2>'
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 style="font-size: 2.2rem; margin: 3rem 0 1rem; color: var(--text-primary);">$1</h1>'
    );

    // Bold
    html = html.replace(
      /\*\*(.*?)\*\*/g,
      '<strong style="color: var(--text-primary); font-weight: 600;">$1</strong>'
    );

    // Italic
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Underline
    html = html.replace(/__(.*?)__/g, "<u>$1</u>");

    // Images - MUST be before Links to prevent conflict
    html = html.replace(
      /!\[([^\]]*)\]\(([^)\s]+)\)/g,
      '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 12px; margin: 2rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" loading="lazy" onerror="this.style.display=\'none\'" />'
    );

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: underline; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">$1</a>'
    );

    // YouTube videos - Lazy load with thumbnail (click to play)
    html = html.replace(
      /\[youtube:([^\]]+)\]/g,
      `<div class="youtube-lazy" data-id="$1" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 2rem 0; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); background: #000; cursor: pointer;" onclick="this.innerHTML='<iframe src=\\'https://www.youtube.com/embed/$1?autoplay=1\\' style=\\'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;\\' allowfullscreen></iframe>'">
        <img src="https://img.youtube.com/vi/$1/maxresdefault.jpg" alt="YouTube Video" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" loading="lazy" onerror="this.src='https://img.youtube.com/vi/$1/hqdefault.jpg'" />
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 48px; background: red; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>`
    );

    // Code blocks
    html = html.replace(
      /```([^`]+)```/g,
      '<pre style="background: rgba(0,0,0,0.4); padding: 1.5rem; border-radius: 12px; overflow-x: auto; margin: 2rem 0; border: 1px solid rgba(255,255,255,0.1);"><code style="font-family: \'Courier New\', monospace; font-size: 0.9rem; color: #a8e6cf;">$1</code></pre>'
    );

    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      "<code style=\"background: rgba(0,0,0,0.3); padding: 0.2rem 0.5rem; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 0.9em; color: var(--accent-color);\">$1</code>"
    );

    // Blockquotes
    html = html.replace(
      /^> (.*$)/gim,
      '<blockquote style="border-left: 4px solid var(--accent-color); padding-left: 1.5rem; margin: 2rem 0; color: var(--text-secondary); font-style: italic; background: rgba(255,255,255,0.02); padding: 1rem 1rem 1rem 1.5rem; border-radius: 0 8px 8px 0;">$1</blockquote>'
    );

    // Unordered lists
    html = html.replace(
      /^\* (.*$)/gim,
      '<li style="margin: 0.5rem 0;">$1</li>'
    );
    html = html.replace(
      /(<li.*<\/li>)/s,
      '<ul style="margin: 1.5rem 0; padding-left: 2rem; list-style-type: disc;">$1</ul>'
    );

    // Ordered lists
    html = html.replace(
      /^\d+\. (.*$)/gim,
      '<li style="margin: 0.5rem 0;">$1</li>'
    );

    // Paragraphs (line breaks)
    html = html.replace(/\n\n/g, '</p><p style="margin: 1.5rem 0;">');
    html = '<p style="margin: 1.5rem 0;">' + html + "</p>";

    // Single line breaks
    html = html.replace(/\n/g, "<br />");

    return html;
  };

  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyText, setReplyText] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments from Supabase
  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("blog_post_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    // Organize comments with replies
    const commentsMap = new Map<string, CommentWithReplies>();
    const rootComments: CommentWithReplies[] = [];

    data?.forEach((c) => {
      const comment: CommentWithReplies = {
        id: c.id,
        user: c.user_name,
        text: c.text,
        date: c.date,
        parent_id: c.parent_id,
        replies: [],
      };
      commentsMap.set(c.id, comment);
    });

    data?.forEach((c) => {
      const comment = commentsMap.get(c.id)!;
      if (c.parent_id && commentsMap.has(c.parent_id)) {
        commentsMap.get(c.parent_id)!.replies!.push(comment);
      } else if (!c.parent_id) {
        rootComments.push(comment);
      }
    });

    setComments(rootComments);
  };

  if (!post) {
    return (
      <div
        className="container section"
        style={{ textAlign: "center", paddingTop: "10rem" }}
      >
        <h2 className="glow-text">Post not found</h2>
        <Link
          to="/"
          className="btn btn-primary"
          style={{ marginTop: "1rem", display: "inline-block" }}
        >
          Return Home
        </Link>
      </div>
    );
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commenterName.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("blog_comments").insert({
        blog_post_id: id,
        user_name: commenterName.trim(),
        text: newComment.trim(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        parent_id: null,
      });

      if (error) throw error;

      setNewComment("");
      setCommenterName("");
      await fetchComments();
      await refreshData();
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim() || !replyName.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("blog_comments").insert({
        blog_post_id: id,
        user_name: replyName.trim(),
        text: replyText.trim(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        parent_id: parentId,
      });

      if (error) throw error;

      setReplyText("");
      setReplyName("");
      setReplyingTo(null);
      await fetchComments();
    } catch (err) {
      console.error("Error adding reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalComments = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  const CommentItem: React.FC<{
    comment: CommentWithReplies;
    isReply?: boolean;
  }> = ({ comment, isReply = false }) => (
    <div
      style={{
        background: isReply
          ? "rgba(255,255,255,0.02)"
          : "rgba(255,255,255,0.03)",
        padding: "1.5rem",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.05)",
        marginLeft: isReply ? "2rem" : 0,
        marginTop: isReply ? "1rem" : 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: isReply
                ? "var(--accent-color)"
                : "var(--secondary-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontSize: "0.8rem",
              fontWeight: "bold",
            }}
          >
            {comment.user.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: "bold", color: "var(--text-primary)" }}>
            {comment.user}
          </span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          {comment.date}
        </span>
      </div>
      <p
        style={{
          color: "var(--text-secondary)",
          paddingLeft: "2.75rem",
          marginBottom: "0.75rem",
        }}
      >
        {comment.text}
      </p>

      {!isReply && (
        <button
          onClick={() =>
            setReplyingTo(replyingTo === comment.id ? null : comment.id)
          }
          style={{
            background: "transparent",
            border: "none",
            color: "var(--primary-color)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginLeft: "2.75rem",
            fontSize: "0.85rem",
          }}
        >
          <Reply size={14} /> Reply
        </button>
      )}

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div
          style={{
            marginTop: "1rem",
            marginLeft: "2.75rem",
            padding: "1rem",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
          >
            <input
              type="text"
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
              placeholder="Your name"
              style={{
                flex: 1,
                padding: "0.5rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              style={{
                flex: 1,
                padding: "0.5rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
            <button
              onClick={() => handleAddReply(comment.id)}
              disabled={submitting}
              style={{
                padding: "0.5rem 1rem",
                background: "var(--primary-color)",
                border: "none",
                borderRadius: "6px",
                color: "#000",
                cursor: "pointer",
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container section" style={{ paddingTop: "6rem" }}>
      <RevealOnScroll>
        {/* Navigation & Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <Link
            to="/#blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-secondary)",
              transition: "color 0.3s",
              fontSize: "0.9rem",
            }}
          >
            <ArrowLeft size={20} /> Back to Articles
          </Link>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleShare}
              className="btn btn-outline"
              style={{
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              title="Share"
            >
              <Share2 size={18} /> Share
            </button>
            <button
              onClick={copyLink}
              className="btn btn-outline"
              style={{
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              title="Copy Link"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div
            style={{
              marginBottom: "2rem",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}

        {/* Article Header */}
        <div
          className="glass-panel"
          style={{
            padding: "3rem",
            marginBottom: "3rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-20%",
              width: "600px",
              height: "600px",
              background:
                "radial-gradient(circle, rgba(0, 184, 255, 0.1) 0%, transparent 70%)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--primary-color)",
                  background: "rgba(0, 255, 157, 0.1)",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                {post.category}
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                }}
              >
                <Clock size={14} /> 5 min read
              </span>
            </div>

            <h1
              style={{
                fontSize: "3rem",
                marginBottom: "2rem",
                lineHeight: 1.1,
                background: "linear-gradient(to right, #fff, #ccc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {post.title}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                borderTop: "1px solid var(--border-color)",
                paddingTop: "2rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--primary-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div
                    style={{ fontWeight: "bold", color: "var(--text-primary)" }}
                  >
                    {post.author}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {post.date}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article
          className="glass-panel blog-content"
          style={{
            padding: "3rem",
            fontSize: "1.15rem",
            lineHeight: "1.8",
            color: "var(--text-secondary)",
          }}
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />
      </RevealOnScroll>

      {/* Comments Section */}
      <RevealOnScroll delay={0.2}>
        <div
          className="glass-panel"
          style={{ padding: "2rem", marginTop: "3rem" }}
        >
          <h3
            style={{
              fontSize: "1.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <MessageSquare size={24} color="var(--secondary-color)" />
            Discussion ({totalComments})
          </h3>

          {/* Add Comment Form */}
          <form
            onSubmit={handleAddComment}
            style={{
              marginBottom: "2rem",
              padding: "1.5rem",
              background: "rgba(0,0,0,0.2)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <User size={18} color="var(--text-secondary)" />
              <input
                type="text"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
                placeholder="Your name"
                required
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                required
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--primary-color)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#000",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Send size={18} /> {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {comments.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontStyle: "italic",
                  }}
                >
                  No comments yet. Start the conversation!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            )}
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
};

export default BlogDetail;
