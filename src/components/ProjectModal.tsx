import React, { useEffect, useState } from "react";
import {
  X,
  Github,
  Calendar,
  Code,
  Layers,
  Globe,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Link as LinkIcon,
  Star,
  Users,
} from "lucide-react";
import type { Project } from "../context/DataContext";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const projectImages = [
    (project as any)?.image,
    (project as any)?.image2,
    (project as any)?.image3,
  ].filter((img) => img && img.trim() !== "");

  const projectFeatures = (project as any)?.features || [];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0);
      setIsImageFullscreen(false);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isImageFullscreen) {
          setIsImageFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, isImageFullscreen, onClose]);

  const handleCopyLink = () => {
    if (project?.link) {
      navigator.clipboard.writeText(project.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share && project) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: project.link || window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + projectImages.length) % projectImages.length
    );
  };

  if (!isOpen || !project) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(8px)",
          animation: "fadeIn 0.3s ease",
        }}
      />

      {/* Modal - Positioned Higher */}
      <div
        style={{
          position: "fixed",
          top: "5%", // HIGHER UP
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "90%",
          maxWidth: "900px",
          maxHeight: "88vh",
          background: "#0a0a0a",
          borderRadius: "16px",
          border: "1px solid rgba(0, 255, 157, 0.2)",
          boxShadow: "0 0 60px rgba(0, 255, 157, 0.08), 0 25px 50px rgba(0, 0, 0, 0.8)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(0, 255, 157, 0.3)",
            color: "var(--primary-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 255, 157, 0.15)";
            e.currentTarget.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.8)";
            e.currentTarget.style.transform = "rotate(0deg)";
          }}
        >
          <X size={18} />
        </button>

        {/* Hero Image */}
        <div
          style={{
            height: "280px",
            position: "relative",
            background: "#050505",
            flexShrink: 0,
          }}
        >
          {projectImages.length > 0 ? (
            <>
              <img
                src={projectImages[currentImageIndex]}
                alt={project.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.85)",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {/* Gradient */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "120px",
                  background: "linear-gradient(to top, #0a0a0a, transparent)",
                }}
              />

              {/* Image Nav */}
              {projectImages.length > 1 && (
                <>
                  <button onClick={prevImage} style={navBtnStyle("left")}>
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} style={navBtnStyle("right")}>
                    <ChevronRight size={20} />
                  </button>
                  {/* Dots */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "6px",
                    }}
                  >
                    {projectImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        style={{
                          width: i === currentImageIndex ? "20px" : "8px",
                          height: "8px",
                          borderRadius: "4px",
                          background:
                            i === currentImageIndex
                              ? "var(--primary-color)"
                              : "rgba(255,255,255,0.3)",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Fullscreen */}
              <button
                onClick={() => setIsImageFullscreen(true)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1rem",
                  padding: "0.4rem 0.8rem",
                  background: "rgba(0, 0, 0, 0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "4px",
                  color: "#fff",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                }}
              >
                <Maximize2 size={12} /> View
              </button>
            </>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#080808",
              }}
            >
              <Layers size={48} style={{ color: "rgba(0, 255, 157, 0.15)" }} />
            </div>
          )}
        </div>

        {/* Content - Scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "2rem",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  color: "var(--primary-color)",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Layers size={14} /> {project.type}
              </span>
              <span style={{ color: "#333" }}>•</span>
              <span
                style={{
                  color: "#666",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Calendar size={14} /> {project.date}
              </span>
            </div>

            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#fff",
                marginBottom: "1rem",
                lineHeight: "1.2",
              }}
            >
              {project.title}
            </h2>

            <p
              style={{
                fontSize: "1rem",
                lineHeight: "1.7",
                color: "#999",
              }}
            >
              {project.description}
            </p>
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <div style={statBoxStyle}>
              <Code size={16} style={{ color: "var(--primary-color)" }} />
              <span>{project.tech.length} Technologies</span>
            </div>
            <div style={statBoxStyle}>
              <Star size={16} style={{ color: "var(--primary-color)" }} />
              <span>Completed</span>
            </div>
            {(project as any)?.client && (
              <div style={statBoxStyle}>
                <Users size={16} style={{ color: "var(--primary-color)" }} />
                <span>{(project as any).client}</span>
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={sectionTitle}>Tech Stack</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  style={{
                    padding: "0.4rem 0.8rem",
                    background: "rgba(0, 255, 157, 0.05)",
                    border: "1px solid rgba(0, 255, 157, 0.15)",
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                    color: "var(--primary-color)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          {projectFeatures.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={sectionTitle}>Features</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {projectFeatures.map((feature: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      padding: "0.75rem 1rem",
                      background: "#0d0d0d",
                      border: "1px solid #1a1a1a",
                      borderRadius: "6px",
                      color: "#ccc",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <Check size={14} style={{ color: "var(--primary-color)" }} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              paddingTop: "1.5rem",
              borderTop: "1px solid #1a1a1a",
            }}
          >
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={primaryBtnStyle}
              >
                <Globe size={16} /> Live Demo
              </a>
            )}
            {(project as any).github && (
              <a
                href={(project as any).github}
                target="_blank"
                rel="noopener noreferrer"
                style={outlineBtnStyle}
              >
                <Github size={16} /> Source
              </a>
            )}
            <button onClick={handleCopyLink} style={iconBtnStyle}>
              {copied ? <Check size={16} /> : <LinkIcon size={16} />}
            </button>
            <button onClick={handleShare} style={iconBtnStyle}>
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen */}
      {isImageFullscreen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "black",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setIsImageFullscreen(false)}
        >
          <img
            src={projectImages[currentImageIndex]}
            alt="Fullscreen"
            style={{
              maxWidth: "95%",
              maxHeight: "95%",
              objectFit: "contain",
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsImageFullscreen(false);
            }}
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              background: "rgba(0,0,0,0.5)",
              padding: "0.75rem",
              borderRadius: "50%",
              color: "#fff",
              border: "1px solid #333",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateX(-50%) translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0); 
          }
        }
      `}</style>
    </>
  );
};

// Helper Styles
const navBtnStyle = (side: "left" | "right"): React.CSSProperties => ({
  position: "absolute",
  [side]: "1rem",
  top: "50%",
  transform: "translateY(-50%)",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "rgba(0, 0, 0, 0.6)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
});

const statBoxStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.6rem 1rem",
  background: "#0d0d0d",
  border: "1px solid #1a1a1a",
  borderRadius: "6px",
  color: "#ccc",
  fontSize: "0.85rem",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#666",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "0.75rem",
};

const primaryBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.7rem 1.4rem",
  background: "var(--primary-color)",
  color: "#000",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "0.9rem",
  textDecoration: "none",
  transition: "all 0.2s ease",
};

const outlineBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.7rem 1.4rem",
  background: "transparent",
  color: "var(--primary-color)",
  border: "1px solid var(--primary-color)",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "0.9rem",
  textDecoration: "none",
  transition: "all 0.2s ease",
};

const iconBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  background: "transparent",
  color: "#666",
  border: "1px solid #333",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export default ProjectModal;
