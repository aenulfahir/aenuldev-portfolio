import React, { useState, useRef } from "react";
import { useData, type BlogPost } from "../../context/DataContext";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  MessageSquare,
  Calendar,
  User,
  Tag,
  FileText,
  Image as ImageIcon,
  Eye,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Upload,
  Loader,
} from "lucide-react";
import RichTextEditor from "../../components/RichTextEditor";
import { uploadImage } from "../../lib/services/storageService";

const BlogManager: React.FC = () => {
  const { blog, addBlogPost, updateBlogPost, deleteBlogPost, refreshData } =
    useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadingImage, setUploadingImage] = useState(false);
  const featuredImageRef = useRef<HTMLInputElement>(null);

  const initialPost: BlogPost = {
    id: "",
    title: "",
    excerpt: "",
    content: "",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    author: "Aenul Fahir",
    category: "",
    comments: [],
  };

  const [formData, setFormData] = useState<BlogPost>(initialPost);

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setFormData(post);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      try {
        await deleteBlogPost(id);
        await refreshData();
      } catch (err) {
        console.error("Error deleting blog post:", err);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    try {
      if (currentPost) {
        await updateBlogPost(currentPost.id, formData);
      } else {
        const { id, comments, ...postData } = formData;
        await addBlogPost(postData);
      }
      await refreshData();
      setStatus("success");
      setTimeout(() => {
        setIsEditing(false);
        setCurrentPost(null);
        setFormData(initialPost);
        setStatus("idle");
      }, 1500);
    } catch (err) {
      console.error("Error saving blog post:", err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const categories = [
    "Technology",
    "Web Development",
    "Mobile Development",
    "Design",
    "Tutorial",
    "News",
    "Opinion",
    "Case Study",
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h2
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <BookOpen size={24} />
          Blog Manager
        </h2>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setCurrentPost(null);
              setFormData(initialPost);
            }}
            className="btn btn-primary"
          >
            <Plus size={18} /> New Article
          </button>
        )}
      </div>

      {status === "success" && (
        <div
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#22c55e",
          }}
        >
          <CheckCircle size={20} />
          Article saved successfully!
        </div>
      )}

      {status === "error" && (
        <div
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#ef4444",
          }}
        >
          <AlertCircle size={20} />
          Failed to save article. Please try again.
        </div>
      )}

      {isEditing && (
        <div
          className="glass-panel"
          style={{ padding: "2rem", marginBottom: "2rem" }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FileText size={20} />
            {currentPost ? "Edit Article" : "Create New Article"}
          </h3>
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div style={{ marginBottom: "2rem" }}>
              <h4
                style={{
                  color: "var(--accent-color)",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FileText size={16} />
                Basic Information
              </h4>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  Article Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter a compelling title..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <Tag
                      size={14}
                      style={{ display: "inline", marginRight: "0.3rem" }}
                    />
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                    }}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <User
                      size={14}
                      style={{ display: "inline", marginRight: "0.3rem" }}
                    />
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <Calendar
                      size={14}
                      style={{ display: "inline", marginRight: "0.3rem" }}
                    />
                    Date
                  </label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="e.g., Jan 15, 2024"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  <Eye
                    size={14}
                    style={{ display: "inline", marginRight: "0.3rem" }}
                  />
                  Excerpt (Short Description) *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Write a brief summary that will appear in the blog list..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    resize: "vertical",
                  }}
                />
                <small
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.8rem",
                  }}
                >
                  {formData.excerpt.length} characters (recommended: 120-160)
                </small>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  <ImageIcon
                    size={14}
                    style={{ display: "inline", marginRight: "0.3rem" }}
                  />
                  Featured Image (Optional)
                </label>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={featuredImageRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      alert("Image size must be less than 5MB");
                      return;
                    }
                    setUploadingImage(true);
                    try {
                      const url = await uploadImage(file, "featured");
                      setFormData((prev) => ({ ...prev, image: url }));
                    } catch (error) {
                      console.error("Upload error:", error);
                      alert("Failed to upload image");
                    } finally {
                      setUploadingImage(false);
                      e.target.value = "";
                    }
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => featuredImageRef.current?.click()}
                    disabled={uploadingImage}
                    style={{
                      padding: "0.75rem 1rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      cursor: uploadingImage ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {uploadingImage ? (
                      <Loader size={16} className="spin" />
                    ) : (
                      <Upload size={16} />
                    )}
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </button>
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      alignSelf: "center",
                    }}
                  >
                    atau
                  </span>
                </div>

                <input
                  type="url"
                  name="image"
                  value={formData.image || ""}
                  onChange={handleChange}
                  placeholder="Paste image URL"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                  }}
                />

                {/* Preview */}
                {formData.image && (
                  <div style={{ marginTop: "0.75rem", position: "relative" }}>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        background: "rgba(0,0,0,0.7)",
                        border: "none",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "white",
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div style={{ marginBottom: "2rem" }}>
              <h4
                style={{
                  color: "var(--accent-color)",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FileText size={16} />
                Article Content
              </h4>

              <RichTextEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                placeholder="Write your article content here... Use the toolbar to format text, add images, videos, and more!"
              />
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                }}
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save size={18} />{" "}
                    {currentPost ? "Update Article" : "Publish Article"}
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentPost(null);
                  setFormData(initialPost);
                }}
                disabled={saving}
                style={{
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                }}
              >
                <X size={18} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {blog.map((post) => (
          <div
            key={post.id}
            className="glass-panel"
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Post Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent-color)",
                  border: "1px solid var(--accent-color)",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "12px",
                  textTransform: "uppercase",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                {post.category}
              </span>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <MessageSquare size={14} />
                {post.comments?.length || 0}
              </span>
            </div>

            {/* Post Title */}
            <h3
              style={{
                fontSize: "1.25rem",
                margin: "0.5rem 0",
                color: "var(--text-primary)",
                fontWeight: "600",
                lineHeight: "1.3",
              }}
            >
              {post.title}
            </h3>

            {/* Post Excerpt */}
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "1rem",
                flex: 1,
                lineHeight: "1.6",
              }}
            >
              {post.excerpt}
            </p>

            {/* Post Meta */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <User size={14} />
                {post.author}
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <Calendar size={14} />
                {post.date}
              </span>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "auto",
              }}
            >
              <button
                onClick={() => handleEdit(post)}
                className="btn btn-outline"
                style={{ padding: "0.6rem", flex: 1, fontSize: "0.9rem" }}
              >
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="btn btn-outline"
                style={{
                  padding: "0.6rem",
                  borderColor: "#ef4444",
                  color: "#ef4444",
                }}
                aria-label={`Delete ${post.title}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {blog.length === 0 && !isEditing && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "var(--text-secondary)",
          }}
        >
          <BookOpen size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            No articles yet
          </p>
          <p style={{ fontSize: "0.9rem" }}>
            Click "New Article" to create your first blog post
          </p>
        </div>
      )}
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default BlogManager;
