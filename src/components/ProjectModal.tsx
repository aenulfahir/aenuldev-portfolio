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
  GitBranch,
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

  // Get project images
  const projectImages = [
    (project as any)?.image,
    (project as any)?.image2,
    (project as any)?.image3,
    // Add more images here if available
  ].filter((img) => img && img.trim() !== "");

  const projectFeatures = (project as any)?.features || [
    "Responsive Design",
    "Real-time Updates",
    "User Authentication",
    "Data Visualization",
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0);
      setIsImageFullscreen(false);
    } else {
      document.body.style.overflow = "unset";
    }

    // Handle ESC key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isImageFullscreen) {
          setIsImageFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + projectImages.length) % projectImages.length
    );
  };

  if (!isOpen || !project) return null;

  return (
    <>
      {/* Backdrop with Animated Background */}
      <div
        className="project-modal-backdrop"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.12) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(74, 222, 128, 0.1) 0%, transparent 40%), rgba(0, 0, 0, 0.92)",
          backdropFilter: "blur(10px)",
          zIndex: 9997,
          animation: "fadeIn 0.3s ease",
          cursor: "default",
        }}
      >
        {/* Animated Small Particles - Green Theme */}
        <div className="modal-particles">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                position: "absolute",
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                background:
                  i % 4 === 0
                    ? "rgba(34, 197, 94, 0.8)"
                    : i % 4 === 1
                    ? "rgba(16, 185, 129, 0.7)"
                    : i % 4 === 2
                    ? "rgba(74, 222, 128, 0.6)"
                    : "rgba(134, 239, 172, 0.5)",
                borderRadius: "50%",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  Math.random() * 15 + 15
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                boxShadow: `0 0 ${Math.random() * 8 + 3}px currentColor`,
              }}
            />
          ))}
        </div>

        {/* Animated Gradient Orbs - Green Theme */}
        <div
          className="gradient-orb orb-1"
          style={{
            position: "absolute",
            width: "450px",
            height: "450px",
            background:
              "radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(70px)",
            animation: "float 22s ease-in-out infinite",
            top: "15%",
            left: "5%",
          }}
        />
        <div
          className="gradient-orb orb-2"
          style={{
            position: "absolute",
            width: "550px",
            height: "550px",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(90px)",
            animation: "float 28s ease-in-out infinite reverse",
            bottom: "5%",
            right: "5%",
          }}
        />
        <div
          className="gradient-orb orb-3"
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(74, 222, 128, 0.18) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(75px)",
            animation: "float 32s ease-in-out infinite",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Modal Container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          overflowY: "auto",
          cursor: "default",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Modal Content */}
        <div
          className="project-modal-content"
          style={{
            background:
              "linear-gradient(135deg, rgba(20, 20, 30, 0.98) 0%, rgba(30, 20, 40, 0.98) 100%)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            maxWidth: "1200px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow:
              "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(0, 184, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            animation: "slideUp 0.4s ease",
            position: "relative",
            cursor: "auto",
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              zIndex: 10,
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "rotate(0deg)";
            }}
          >
            <X size={24} />
          </button>

          {/* Scrollable Content */}
          <div style={{ overflowY: "auto", maxHeight: "90vh" }}>
            {/* Hero Section with Image */}
            {projectImages.length > 0 && (
              <div
                style={{
                  position: "relative",
                  height: "400px",
                  background:
                    "linear-gradient(135deg, rgba(0, 184, 255, 0.1), rgba(138, 43, 226, 0.1))",
                  overflow: "hidden",
                }}
              >
                <img
                  src={projectImages[currentImageIndex]}
                  alt={project.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />

                {/* Image Overlay Gradient */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "50%",
                    background:
                      "linear-gradient(to top, rgba(20, 20, 30, 1), transparent)",
                  }}
                />

                {/* Image Navigation */}
                {projectImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      style={{
                        position: "absolute",
                        left: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "50%",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "white",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      style={{
                        position: "absolute",
                        right: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "50%",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "white",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <ChevronRight size={24} />
                    </button>

                    {/* Image Indicators */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      {projectImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          style={{
                            width: index === currentImageIndex ? "32px" : "8px",
                            height: "8px",
                            borderRadius: "4px",
                            background:
                              index === currentImageIndex
                                ? "var(--accent-color)"
                                : "rgba(255, 255, 255, 0.3)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Fullscreen Button */}
                <button
                  onClick={() => setIsImageFullscreen(true)}
                  style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    background: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    color: "white",
                    fontSize: "0.85rem",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Maximize2 size={16} />
                  Fullscreen
                </button>
              </div>
            )}

            {/* Content Section */}
            <div style={{ padding: "2.5rem" }}>
              {/* Header */}
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      padding: "0.5rem 1rem",
                      background: "rgba(0, 184, 255, 0.1)",
                      border: "1px solid rgba(0, 184, 255, 0.3)",
                      borderRadius: "8px",
                      color: "var(--accent-color)",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Layers size={16} />
                    {project.type}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <Calendar size={16} />
                    {project.date}
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    background: "linear-gradient(135deg, #00b8ff, #8a2be2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {project.title}
                </h2>

                <p
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "var(--text-secondary)",
                    marginBottom: "2rem",
                  }}
                >
                  {project.description}
                </p>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.75rem 1.5rem",
                        fontSize: "1rem",
                        textDecoration: "none",
                      }}
                    >
                      <Globe size={20} />
                      Visit Live Site
                    </a>
                  )}
                  {(project as any).github && (
                    <a
                      href={(project as any).github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.75rem 1.5rem",
                        fontSize: "1rem",
                        textDecoration: "none",
                      }}
                    >
                      <Github size={20} />
                      View Source
                    </a>
                  )}
                  <button
                    onClick={handleCopyLink}
                    className="btn btn-outline"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem 1.5rem",
                      fontSize: "1rem",
                    }}
                  >
                    {copied ? <Check size={20} /> : <LinkIcon size={20} />}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                  {typeof navigator !== "undefined" &&
                    typeof navigator.share === "function" && (
                      <button
                        onClick={handleShare}
                        className="btn btn-outline"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.75rem 1.5rem",
                          fontSize: "1rem",
                        }}
                      >
                        <Share2 size={20} />
                        Share
                      </button>
                    )}
                </div>
              </div>

              {/* Stats Section (Optional) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "1rem",
                  marginBottom: "2rem",
                  padding: "1.5rem",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "var(--accent-color)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <Star size={24} style={{ display: "inline" }} />
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Featured
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "var(--accent-color)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {project.tech.length}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Technologies
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "var(--accent-color)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <GitBranch size={24} style={{ display: "inline" }} />
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Production
                  </div>
                </div>
              </div>

              {/* Tech Stack Section */}
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  <Code size={24} />
                  Technology Stack
                </h3>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}
                >
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      style={{
                        padding: "0.6rem 1.2rem",
                        background: "rgba(0, 184, 255, 0.1)",
                        border: "1px solid rgba(0, 184, 255, 0.3)",
                        borderRadius: "12px",
                        color: "var(--secondary-color)",
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(0, 184, 255, 0.2)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(0, 184, 255, 0.1)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features Section */}
              {projectFeatures.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    <Star size={24} />
                    Key Features
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    {projectFeatures.map((feature: string, index: number) => (
                      <div
                        key={index}
                        style={{
                          padding: "1rem",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.05)";
                          e.currentTarget.style.borderColor =
                            "var(--accent-color)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.03)";
                          e.currentTarget.style.borderColor =
                            "rgba(255, 255, 255, 0.1)";
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "var(--accent-color)",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.95rem",
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {(project as any).client && (
                <div
                  style={{
                    padding: "1.5rem",
                    background: "rgba(138, 43, 226, 0.1)",
                    border: "1px solid rgba(138, 43, 226, 0.3)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <Users size={24} style={{ color: "var(--accent-color)" }} />
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Client
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                      {(project as any).client}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {isImageFullscreen && projectImages.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.95)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.3s ease",
          }}
          onClick={() => setIsImageFullscreen(false)}
        >
          <button
            onClick={() => setIsImageFullscreen(false)}
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "56px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              zIndex: 10001,
            }}
          >
            <X size={28} />
          </button>
          <img
            src={projectImages[currentImageIndex]}
            alt={project.title}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ProjectModal;
