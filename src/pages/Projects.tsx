import React, { useState } from "react";
import {
  ExternalLink,
  Smartphone,
  Globe,
  Database,
  Github,
  Calendar,
  Code,
  Layers,
  Monitor,
  Tablet,
} from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";
import ProjectModal from "../components/ProjectModal";
import { useData, type Project } from "../context/DataContext";

const Projects: React.FC = () => {
  const { projects } = useData();
  const [filter, setFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "web":
        return <Globe size={20} />;
      case "mobile":
        return <Smartphone size={20} />;
      case "desktop":
        return <Monitor size={20} />;
      case "api":
        return <Database size={20} />;
      case "design":
        return <Tablet size={20} />;
      default:
        return <Layers size={20} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "web":
        return "Web Development";
      case "mobile":
        return "Mobile App";
      case "desktop":
        return "Desktop App";
      case "api":
        return "API / Backend";
      case "design":
        return "UI/UX Design";
      default:
        return "Other";
    }
  };

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.type === filter);

  const projectTypes = ["all", ...new Set(projects.map((p) => p.type))];

  return (
    <div className="container section">
      <RevealOnScroll>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            className="glow-text"
            style={{ fontSize: "3rem", marginBottom: "1rem" }}
          >
            Featured Projects
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            A showcase of my recent work and technical experiments.
          </p>
        </div>
      </RevealOnScroll>

      {/* Filter Buttons */}
      <RevealOnScroll>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "3rem",
            flexWrap: "wrap",
          }}
        >
          {projectTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={
                filter === type ? "btn btn-primary" : "btn btn-outline"
              }
              style={{
                padding: "0.6rem 1.2rem",
                fontSize: "0.9rem",
                textTransform: "capitalize",
                transition: "all 0.3s ease",
              }}
            >
              {type === "all" ? "All Projects" : getTypeLabel(type)}
            </button>
          ))}
        </div>
      </RevealOnScroll>

      {/* Projects Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        {filteredProjects.map((project, index) => (
          <RevealOnScroll key={project.id} delay={index * 0.1}>
            <div
              className="glass-panel project-card"
              onClick={() => handleProjectClick(project)}
              style={{
                padding: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
            >
              {/* Project Thumbnail */}
              {(project as any).image && (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    overflow: "hidden",
                    position: "relative",
                    background:
                      "linear-gradient(135deg, rgba(0, 184, 255, 0.1), rgba(138, 43, 226, 0.1))",
                  }}
                >
                  <img
                    src={(project as any).image}
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
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      background: "rgba(0, 0, 0, 0.7)",
                      backdropFilter: "blur(10px)",
                      padding: "0.5rem 0.8rem",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "var(--accent-color)",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {getIcon(project.type)}
                    {getTypeLabel(project.type)}
                  </div>
                </div>
              )}

              {/* Project Content */}
              <div
                style={{
                  padding: "1.5rem",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header - Only show if no image */}
                {!(project as any).image && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                      paddingBottom: "1rem",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        padding: "0.6rem",
                        borderRadius: "8px",
                        color: "var(--accent-color)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {getIcon(project.type)}
                      {getTypeLabel(project.type)}
                    </div>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Calendar size={14} />
                      {project.date}
                    </span>
                  </div>
                )}

                {/* Title and Date (for cards with image) */}
                {(project as any).image && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Calendar size={14} />
                      {project.date}
                    </span>
                  </div>
                )}

                {/* Project Title */}
                <h3
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "1rem",
                    color: "var(--text-primary)",
                    fontWeight: "600",
                    lineHeight: "1.3",
                  }}
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "1.5rem",
                    flex: 1,
                    lineHeight: "1.6",
                    fontSize: "0.95rem",
                  }}
                >
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.75rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    <Code size={16} />
                    Tech Stack
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    {project.tech.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          background: "rgba(0, 184, 255, 0.1)",
                          color: "var(--secondary-color)",
                          border: "1px solid rgba(0, 184, 255, 0.2)",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "0.7rem 1rem",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                      }}
                    >
                      <Globe size={16} />
                      Live Demo
                    </a>
                  )}
                  {(project as any).github && (
                    <a
                      href={(project as any).github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{
                        flex: project.link ? 0 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "0.7rem 1rem",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                      }}
                    >
                      <Github size={16} />
                      {project.link ? "" : "View Code"}
                    </a>
                  )}
                  {!project.link && !(project as any).github && (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0.7rem 1rem",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        fontStyle: "italic",
                      }}
                    >
                      <ExternalLink
                        size={14}
                        style={{ marginRight: "0.3rem" }}
                      />
                      Coming Soon
                    </div>
                  )}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <RevealOnScroll>
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              color: "var(--text-secondary)",
            }}
          >
            <Layers size={64} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              No projects found
            </h3>
            <p style={{ fontSize: "1rem" }}>
              {filter === "all"
                ? "No projects available yet."
                : `No ${getTypeLabel(filter)} projects available.`}
            </p>
          </div>
        </RevealOnScroll>
      )}

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Projects;
