import React, { useState } from "react";
import { useData, type Project } from "../../context/DataContext";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  ExternalLink,
  Calendar,
  Tag,
  FileText,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Github,
  Globe,
  Briefcase,
  Code,
  Layers,
} from "lucide-react";

const ProjectManager: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, refreshData } =
    useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const initialProject: Project = {
    id: "",
    title: "",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    description: "",
    tech: [],
    type: "web",
    link: "",
  };

  const [formData, setFormData] = useState<Project>(initialProject);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setFormData(project);
    setFeatureInput((project as any).features?.join(", ") || "");
    setTechInput(project.tech.join(", "));
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      try {
        await deleteProject(id);
        await refreshData();
      } catch (err) {
        console.error("Error deleting project:", err);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    try {
      if (currentProject) {
        await updateProject(currentProject.id, formData);
      } else {
        const { id, ...projectData } = formData;
        await addProject(projectData);
      }
      await refreshData();
      setStatus("success");
      setTimeout(() => {
        setIsEditing(false);
        setCurrentProject(null);
        setFormData(initialProject);
        setTechInput("");
        setStatus("idle");
      }, 1500);
    } catch (err) {
      console.error("Error saving project:", err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTechInput(value);
    const tech = value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    setFormData((prev) => ({ ...prev, tech }));
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFeatureInput(value);
    const features = value
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);
    setFormData((prev) => ({ ...prev, features } as any));
  };

  const addTechTag = (tag: string) => {
    if (!formData.tech.includes(tag)) {
      const newTech = [...formData.tech, tag];
      setFormData((prev) => ({ ...prev, tech: newTech }));
      setTechInput(newTech.join(", "));
    }
  };

  const removeTechTag = (index: number) => {
    const newTech = formData.tech.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, tech: newTech }));
    setTechInput(newTech.join(", "));
  };

  const addFeatureTag = (feature: string) => {
    const currentFeatures = (formData as any).features || [];
    if (!currentFeatures.includes(feature)) {
      const newFeatures = [...currentFeatures, feature];
      setFormData((prev) => ({ ...prev, features: newFeatures } as any));
      setFeatureInput(newFeatures.join(", "));
    }
  };

  const removeFeatureTag = (index: number) => {
    const currentFeatures = (formData as any).features || [];
    const newFeatures = currentFeatures.filter(
      (_: any, i: number) => i !== index
    );
    setFormData((prev) => ({ ...prev, features: newFeatures } as any));
    setFeatureInput(newFeatures.join(", "));
  };

  const commonTechs = [
    "React",
    "TypeScript",
    "Node.js",
    "Express",
    "Next.js",
    "Vue.js",
    "Angular",
    "React Native",
    "Flutter",
    "Tailwind CSS",
    "Bootstrap",
    "Material-UI",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Firebase",
    "Supabase",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "REST API",
    "Redux",
    "Zustand",
    "Jest",
    "Cypress",
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
          <Briefcase size={24} />
          Project Manager
        </h2>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setCurrentProject(null);
              setFormData(initialProject);
              setTechInput("");
            }}
            className="btn btn-primary"
          >
            <Plus size={18} /> Add New Project
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
          Project saved successfully!
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
          Failed to save project. Please try again.
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
            {currentProject ? "Edit Project" : "Add New Project"}
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
                <Layers size={16} />
                Basic Information
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
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
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., E-Commerce Platform"
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
                    Project Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    aria-label="Project Type"
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
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="desktop">Desktop Application</option>
                    <option value="api">API / Backend</option>
                    <option value="design">UI/UX Design</option>
                    <option value="other">Other</option>
                  </select>
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
                  <FileText
                    size={14}
                    style={{ display: "inline", marginRight: "0.3rem" }}
                  />
                  Project Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your project, its purpose, and key features..."
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
                  style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}
                >
                  {formData.description.length} characters
                </small>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
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
                    <Calendar
                      size={14}
                      style={{ display: "inline", marginRight: "0.3rem" }}
                    />
                    Date / Period
                  </label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="e.g., Jan 2024 or Q1 2024"
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

                <div style={{ gridColumn: "1 / -1" }}>
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
                    Project Images (up to 3)
                  </label>

                  {/* Image Upload Grid */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                    marginTop: "0.5rem"
                  }}>
                    {[1, 2, 3].map((slot) => {
                      const imageKey = slot === 1 ? 'image' : `image${slot}`;
                      const imageUrl = (formData as any)[imageKey];

                      return (
                        <div
                          key={slot}
                          style={{
                            position: "relative",
                            aspectRatio: "16/9",
                            background: "rgba(255,255,255,0.03)",
                            border: "2px dashed rgba(255,255,255,0.15)",
                            borderRadius: "8px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--primary-color)";
                            e.currentTarget.style.background = "rgba(0,255,157,0.03)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                          }}
                        >
                          {imageUrl ? (
                            <>
                              <img
                                src={imageUrl}
                                alt={`Project image ${slot}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, [imageKey]: "" } as any));
                                }}
                                style={{
                                  position: "absolute",
                                  top: "0.5rem",
                                  right: "0.5rem",
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "50%",
                                  background: "rgba(0,0,0,0.7)",
                                  border: "1px solid rgba(255,255,255,0.3)",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <label
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                                padding: "1rem",
                              }}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  const { uploadProjectImage } = await import("../../lib/imageUtils");

                                  try {
                                    setSaving(true);
                                    const projectId = currentProject?.id || `temp_${Date.now()}`;
                                    const url = await uploadProjectImage(file, projectId, slot as 1 | 2 | 3);
                                    setFormData(prev => ({ ...prev, [imageKey]: url } as any));
                                  } catch (err) {
                                    console.error("Upload failed:", err);
                                    alert("Failed to upload image. Please try again.");
                                  } finally {
                                    setSaving(false);
                                  }
                                }}
                              />
                              <ImageIcon size={24} style={{ color: "#666", marginBottom: "0.5rem" }} />
                              <span style={{ fontSize: "0.8rem", color: "#666", textAlign: "center" }}>
                                Click to upload
                              </span>
                              <span style={{ fontSize: "0.7rem", color: "#555" }}>
                                Image {slot}
                              </span>
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <small style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.5rem", display: "block" }}>
                    Images are automatically compressed for optimal performance.
                  </small>
                </div>
              </div>
            </div>

            {/* Technology Stack Section */}
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
                <Code size={16} />
                Technology Stack
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
                  <Tag
                    size={14}
                    style={{ display: "inline", marginRight: "0.3rem" }}
                  />
                  Technologies Used
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={handleTechChange}
                  placeholder="Type technologies separated by commas, or use quick-add buttons below"
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

              {/* Selected Technologies */}
              {formData.tech.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <small
                    style={{
                      color: "var(--text-secondary)",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Selected Technologies:
                  </small>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {formData.tech.map((tech, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          padding: "0.4rem 0.7rem",
                          background: "var(--accent-color)",
                          color: "white",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                        }}
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechTag(index)}
                          aria-label={`Remove ${tech}`}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            opacity: 0.8,
                            display: "flex",
                            alignItems: "center",
                            color: "inherit",
                          }}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Add Buttons */}
              <div>
                <small
                  style={{
                    color: "var(--text-secondary)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Quick Add:
                </small>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {commonTechs.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => addTechTag(tech)}
                      disabled={formData.tech.includes(tech)}
                      style={{
                        padding: "0.4rem 0.7rem",
                        background: formData.tech.includes(tech)
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(255,255,255,0.05)",
                        border: `1px solid ${formData.tech.includes(tech)
                            ? "var(--accent-color)"
                            : "var(--border-color)"
                          }`,
                        borderRadius: "6px",
                        color: formData.tech.includes(tech)
                          ? "var(--accent-color)"
                          : "var(--text-secondary)",
                        fontSize: "0.8rem",
                        cursor: formData.tech.includes(tech)
                          ? "default"
                          : "pointer",
                        opacity: formData.tech.includes(tech) ? 0.6 : 1,
                        transition: "all 0.2s",
                      }}
                    >
                      {formData.tech.includes(tech) ? "✓ " : "+ "}
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Section */}
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
                <LinkIcon size={16} />
                Project Links
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
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
                    <Globe
                      size={14}
                      style={{ display: "inline", marginRight: "0.3rem" }}
                    />
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link || ""}
                    onChange={handleChange}
                    placeholder="https://example.com"
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
                    <Github
                      size={14}
                      style={{ display: "inline", marginRight: "0.3rem" }}
                    />
                    Repository URL
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={(formData as any).github || ""}
                    onChange={handleChange}
                    placeholder="https://github.com/username/repo"
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
            </div>

            {/* Key Features Section */}
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
                <CheckCircle size={16} />
                Key Features
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
                  Project Features (comma separated)
                </label>
                <input
                  type="text"
                  value={featureInput}
                  onChange={handleFeatureChange}
                  placeholder="e.g., Responsive Design, Real-time Updates, User Authentication"
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

              {/* Selected Features */}
              {(formData as any).features &&
                (formData as any).features.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    <small
                      style={{
                        color: "var(--text-secondary)",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Selected Features:
                    </small>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {(formData as any).features.map(
                        (feature: string, index: number) => (
                          <span
                            key={index}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              padding: "0.4rem 0.7rem",
                              background: "rgba(34, 197, 94, 0.2)",
                              border: "1px solid rgba(34, 197, 94, 0.4)",
                              color: "#22c55e",
                              borderRadius: "6px",
                              fontSize: "0.85rem",
                              fontWeight: "500",
                            }}
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => removeFeatureTag(index)}
                              aria-label={`Remove ${feature}`}
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                opacity: 0.8,
                                display: "flex",
                                alignItems: "center",
                                color: "inherit",
                              }}
                            >
                              <X size={14} />
                            </button>
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Quick Add Features */}
              <div>
                <small
                  style={{
                    color: "var(--text-secondary)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Quick Add:
                </small>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {[
                    "Responsive Design",
                    "Real-time Updates",
                    "User Authentication",
                    "Data Visualization",
                    "API Integration",
                    "Cloud Storage",
                    "Push Notifications",
                    "Offline Support",
                  ].map((feature) => {
                    const currentFeatures = (formData as any).features || [];
                    const isSelected = currentFeatures.includes(feature);
                    return (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => addFeatureTag(feature)}
                        disabled={isSelected}
                        style={{
                          padding: "0.4rem 0.7rem",
                          background: isSelected
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(255,255,255,0.05)",
                          border: `1px solid ${isSelected
                              ? "rgba(34, 197, 94, 0.4)"
                              : "var(--border-color)"
                            }`,
                          borderRadius: "6px",
                          color: isSelected
                            ? "#22c55e"
                            : "var(--text-secondary)",
                          fontSize: "0.8rem",
                          cursor: isSelected ? "default" : "pointer",
                          opacity: isSelected ? 0.6 : 1,
                          transition: "all 0.2s",
                        }}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {feature}
                      </button>
                    );
                  })}
                </div>
              </div>
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
                    {currentProject ? "Update Project" : "Create Project"}
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentProject(null);
                  setFormData(initialProject);
                  setTechInput("");
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

      {/* Projects Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
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
            {/* Project Header */}
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
                {project.type}
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
                <Calendar size={12} />
                {project.date}
              </span>
            </div>

            {/* Project Title */}
            <h3
              style={{
                fontSize: "1.25rem",
                margin: "0.5rem 0",
                color: "var(--text-primary)",
                fontWeight: "600",
              }}
            >
              {project.title}
            </h3>

            {/* Project Description */}
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "1rem",
                flex: 1,
                lineHeight: "1.6",
              }}
            >
              {project.description}
            </p>

            {/* Tech Stack */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {project.tech.slice(0, 5).map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.75rem",
                    background: "rgba(255,255,255,0.1)",
                    padding: "0.3rem 0.6rem",
                    borderRadius: "4px",
                    color: "var(--text-secondary)",
                    fontWeight: "500",
                  }}
                >
                  {t}
                </span>
              ))}
              {project.tech.length > 5 && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    background: "rgba(255,255,255,0.05)",
                    padding: "0.3rem 0.6rem",
                    borderRadius: "4px",
                    color: "var(--text-secondary)",
                  }}
                >
                  +{project.tech.length - 5} more
                </span>
              )}
            </div>

            {/* Project Links */}
            {project.link && (
              <div style={{ marginBottom: "1rem" }}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    color: "var(--accent-color)",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={14} />
                  View Live Demo
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "auto",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <button
                onClick={() => handleEdit(project)}
                className="btn btn-outline"
                style={{ padding: "0.6rem", flex: 1, fontSize: "0.9rem" }}
              >
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="btn btn-outline"
                aria-label={`Delete ${project.title}`}
                style={{
                  padding: "0.6rem",
                  borderColor: "#ef4444",
                  color: "#ef4444",
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !isEditing && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "var(--text-secondary)",
          }}
        >
          <Briefcase size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            No projects yet
          </p>
          <p style={{ fontSize: "0.9rem" }}>
            Click "Add New Project" to create your first project
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
