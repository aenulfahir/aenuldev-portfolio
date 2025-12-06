import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Eye,
  EyeOff,
  Youtube,
  Heading1,
  Heading2,
  Quote,
  Upload,
  Loader,
} from "lucide-react";
import { uploadImage } from "../lib/services/storageService";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file, "blog");
      insertText(`\n![Image](${url})\n`);
      setShowImageModal(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const insertImage = () => {
    if (!imageUrl.trim()) return;
    insertText(`\n![Image](${imageUrl})\n`);
    setImageUrl("");
    setShowImageModal(false);
  };

  const insertVideo = () => {
    if (!videoUrl.trim()) return;
    let videoId = "";
    if (videoUrl.includes("youtube.com/watch?v=")) {
      videoId = videoUrl.split("v=")[1]?.split("&")[0];
    } else if (videoUrl.includes("youtu.be/")) {
      videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
    } else {
      videoId = videoUrl;
    }
    // Use lite-youtube format for lazy loading
    insertText(`\n[youtube:${videoId}]\n`);
    setVideoUrl("");
    setShowVideoModal(false);
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    const text = linkText.trim() || linkUrl;
    insertText(`[${text}](${linkUrl})`);
    setLinkUrl("");
    setLinkText("");
    setShowLinkModal(false);
  };

  const renderPreview = (content: string) => {
    let html = content;

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold, Italic, Underline
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/__(.*?)__/g, "<u>$1</u>");

    // Images - MUST be before Links to prevent conflict
    html = html.replace(
      /!\[([^\]]*)\]\(([^)\s]+)\)/g,
      '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;" loading="lazy" onerror="this.style.display=\'none\'" />'
    );

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: underline;">$1</a>'
    );

    // YouTube - Lazy load thumbnail (click to play)
    html = html.replace(
      /\[youtube:([^\]]+)\]/g,
      `<div class="youtube-embed" data-id="$1" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 1.5rem 0; background: #000; border-radius: 8px; cursor: pointer;">
        <img src="https://img.youtube.com/vi/$1/maxresdefault.jpg" alt="YouTube Video" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" loading="lazy" onerror="this.src='https://img.youtube.com/vi/$1/hqdefault.jpg'" />
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 48px; background: red; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>`
    );

    // Code blocks
    html = html.replace(
      /```([^`]+)```/g,
      '<pre style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0;"><code>$1</code></pre>'
    );

    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      '<code style="background: rgba(0,0,0,0.3); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace;">$1</code>'
    );

    // Blockquotes
    html = html.replace(
      /^> (.*$)/gim,
      '<blockquote style="border-left: 4px solid var(--accent-color); padding-left: 1rem; margin: 1rem 0; color: var(--text-secondary); font-style: italic;">$1</blockquote>'
    );

    // Lists
    html = html.replace(/^\* (.*$)/gim, "<li>$1</li>");
    html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");

    // Line breaks
    html = html.replace(/\n/g, "<br />");

    return html;
  };

  const btnStyle = {
    padding: "0.5rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    color: "var(--text-primary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = "";
        }}
      />

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          padding: "1rem",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Text Formatting */}
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            borderRight: "1px solid var(--border-color)",
            paddingRight: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => insertText("**", "**")}
            className="editor-btn"
            title="Bold"
            style={btnStyle}
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertText("*", "*")}
            className="editor-btn"
            title="Italic"
            style={btnStyle}
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertText("__", "__")}
            className="editor-btn"
            title="Underline"
            style={btnStyle}
          >
            <Underline size={16} />
          </button>
        </div>

        {/* Headings */}
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            borderRight: "1px solid var(--border-color)",
            paddingRight: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => insertText("# ", "")}
            className="editor-btn"
            title="Heading 1"
            style={btnStyle}
          >
            <Heading1 size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertText("## ", "")}
            className="editor-btn"
            title="Heading 2"
            style={btnStyle}
          >
            <Heading2 size={16} />
          </button>
        </div>

        {/* Lists & Quote */}
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            borderRight: "1px solid var(--border-color)",
            paddingRight: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => insertText("* ", "")}
            className="editor-btn"
            title="Bullet List"
            style={btnStyle}
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertText("1. ", "")}
            className="editor-btn"
            title="Numbered List"
            style={btnStyle}
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertText("> ", "")}
            className="editor-btn"
            title="Quote"
            style={btnStyle}
          >
            <Quote size={16} />
          </button>
        </div>

        {/* Media & Links */}
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            borderRight: "1px solid var(--border-color)",
            paddingRight: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="editor-btn"
            title="Insert Link"
            style={btnStyle}
          >
            <LinkIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="editor-btn"
            title="Insert Image"
            style={btnStyle}
          >
            <ImageIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="editor-btn"
            title="Insert YouTube"
            style={btnStyle}
          >
            <Youtube size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertText("`", "`")}
            className="editor-btn"
            title="Code"
            style={btnStyle}
          >
            <Code size={16} />
          </button>
        </div>

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="editor-btn"
          title={showPreview ? "Hide Preview" : "Show Preview"}
          style={{
            ...btnStyle,
            padding: "0.5rem 1rem",
            background: showPreview
              ? "var(--accent-color)"
              : "rgba(255,255,255,0.05)",
            color: showPreview ? "#000" : "var(--text-primary)",
            marginLeft: "auto",
            gap: "0.5rem",
          }}
        >
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div
          className="blog-content"
          style={{
            padding: "1.5rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            minHeight: "400px",
            color: "var(--text-secondary)",
            lineHeight: "1.8",
          }}
          dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            minHeight: "400px",
            padding: "1.5rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            color: "var(--text-primary)",
            fontSize: "1rem",
            lineHeight: "1.8",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
          onClick={() => !uploading && setShowImageModal(false)}
        >
          <div
            style={{
              background: "rgba(20,20,30,0.98)",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "90%",
              border: "1px solid var(--border-color)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "1.5rem" }}>Insert Image</h3>

            {/* Upload from computer */}
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{
                padding: "2rem",
                border: "2px dashed var(--border-color)",
                borderRadius: "8px",
                textAlign: "center",
                cursor: uploading ? "not-allowed" : "pointer",
                marginBottom: "1rem",
                transition: "all 0.3s ease",
                background: "rgba(255,255,255,0.02)",
              }}
              onMouseEnter={(e) => {
                if (!uploading)
                  e.currentTarget.style.borderColor = "var(--primary-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
              }}
            >
              {uploading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    color: "var(--primary-color)",
                  }}
                >
                  <Loader size={24} className="spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                <>
                  <Upload
                    size={32}
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "0.5rem",
                    }}
                  />
                  <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                    Click to upload from computer
                  </p>
                  <small
                    style={{ color: "var(--text-secondary)", opacity: 0.7 }}
                  >
                    Max 5MB • JPG, PNG, GIF, WebP
                  </small>
                </>
              )}
            </div>

            <div
              style={{
                textAlign: "center",
                color: "var(--text-secondary)",
                margin: "1rem 0",
              }}
            >
              — atau —
            </div>

            {/* URL input */}
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL"
              disabled={uploading}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                marginBottom: "1rem",
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={insertImage}
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={uploading || !imageUrl.trim()}
              >
                Insert URL
              </button>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
          onClick={() => setShowVideoModal(false)}
        >
          <div
            style={{
              background: "rgba(20,20,30,0.98)",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "90%",
              border: "1px solid var(--border-color)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "1rem" }}>Insert YouTube Video</h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              Video akan ditampilkan sebagai thumbnail yang ringan. Klik untuk
              memutar.
            </p>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube URL atau Video ID"
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                marginBottom: "1rem",
              }}
              autoFocus
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={insertVideo}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Insert
              </button>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
          onClick={() => setShowLinkModal(false)}
        >
          <div
            style={{
              background: "rgba(20,20,30,0.98)",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "90%",
              border: "1px solid var(--border-color)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "1rem" }}>Insert Link</h3>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text (optional)"
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                marginBottom: "0.5rem",
              }}
            />
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                marginBottom: "1rem",
              }}
              autoFocus
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={insertLink}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Insert
              </button>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Helper Text */}
      <div
        style={{
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
          fontStyle: "italic",
        }}
      >
        Tip: Upload gambar dari komputer atau paste URL. YouTube akan
        ditampilkan sebagai thumbnail ringan.
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
