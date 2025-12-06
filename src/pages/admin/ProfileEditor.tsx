import React, { useState, useEffect } from "react";
import {
  useData,
  type AboutData,
  type HeroData,
} from "../../context/DataContext";
import {
  Save,
  Plus,
  Trash2,
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Code,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ProfileEditor: React.FC = () => {
  const { about, updateAbout, hero, updateHero, refreshData } = useData();
  const [aboutData, setAboutData] = useState<AboutData>(about);
  const [heroData, setHeroData] = useState<HeroData>(hero);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Sync local state when context changes
  useEffect(() => {
    setAboutData(about);
  }, [about]);

  useEffect(() => {
    setHeroData(hero);
  }, [hero]);

  const handleAboutChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAboutData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHeroData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAboutData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  const handleArrayChange = (
    index: number,
    field: "experience" | "education" | "certifications",
    subField: string,
    value: string
  ) => {
    const newArray = [...aboutData[field]] as any[];
    newArray[index] = { ...newArray[index], [subField]: value };
    setAboutData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addItem = (field: "experience" | "education" | "certifications") => {
    const newItem =
      field === "experience"
        ? { role: "", company: "", period: "", description: "" }
        : field === "education"
        ? { degree: "", school: "", period: "", description: "" }
        : { name: "", issuer: "", date: "" };

    setAboutData((prev) => ({ ...prev, [field]: [...prev[field], newItem] }));
  };

  const removeItem = (
    index: number,
    field: "experience" | "education" | "certifications"
  ) => {
    setAboutData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skills = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setAboutData((prev) => ({ ...prev, skills }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    try {
      await updateAbout(aboutData);
      await updateHero(heroData);
      await refreshData(); // Refresh all data to sync with frontend
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("Error saving:", err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem" }}>Profile & Introduction</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {status === "success" && (
            <span
              style={{
                color: "var(--primary-color)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <CheckCircle size={18} /> Saved!
            </span>
          )}
          {status === "error" && (
            <span
              style={{
                color: "var(--error-color)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <AlertCircle size={18} /> Error saving
            </span>
          )}
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={saving}
          >
            <Save size={20} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}
      >
        {/* Left Column: Identity Card Style */}
        <div>
          <div
            className="glass-panel"
            style={{
              padding: "2rem",
              textAlign: "center",
              position: "sticky",
              top: "2rem",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background:
                  "linear-gradient(45deg, var(--primary-color), var(--secondary-color))",
                margin: "0 auto 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                fontWeight: "bold",
                color: "#000",
              }}
            >
              {heroData.name.charAt(0)}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={heroData.name}
                onChange={handleHeroChange}
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "0.5rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  color: "var(--text-primary)",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              />
            </div>

            <div
              style={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  <MapPin size={14} /> Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={aboutData.contact.location}
                  onChange={handleContactChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  <Phone size={14} /> Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={aboutData.contact.phone}
                  onChange={handleContactChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  <Mail size={14} /> Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={aboutData.contact.email}
                  onChange={handleContactChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Professional Summary */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h2
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <User size={20} color="var(--primary-color)" /> Professional
              Summary
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              This is your introduction to potential clients. Make it impactful!
            </p>
            <textarea
              name="summary"
              value={aboutData.summary}
              onChange={handleAboutChange}
              rows={6}
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                lineHeight: 1.6,
              }}
            />
          </div>

          {/* Skills */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h2
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Code size={20} color="var(--secondary-color)" /> Skills &
              Expertise
            </h2>
            <textarea
              value={aboutData.skills.join(", ")}
              onChange={handleSkillsChange}
              rows={3}
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                color: "var(--text-primary)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              {aboutData.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.1)",
                    color: "var(--text-primary)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Briefcase size={20} color="var(--accent-color)" /> Experience
              </h2>
              <button
                type="button"
                onClick={() => addItem("experience")}
                className="btn btn-outline"
                style={{ padding: "0.5rem" }}
              >
                <Plus size={16} />
              </button>
            </div>
            {aboutData.experience.map((exp, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "1.5rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "experience",
                        "role",
                        e.target.value
                      )
                    }
                    style={{
                      padding: "0.5rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px",
                      color: "var(--text-primary)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "experience",
                        "company",
                        e.target.value
                      )
                    }
                    style={{
                      padding: "0.5rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder="Period"
                    value={exp.period}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "experience",
                        "period",
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) =>
                    handleArrayChange(
                      index,
                      "experience",
                      "description",
                      e.target.value
                    )
                  }
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeItem(index, "experience")}
                  style={{
                    color: "var(--error-color)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <GraduationCap size={20} color="var(--primary-color)" />{" "}
                Education
              </h2>
              <button
                type="button"
                onClick={() => addItem("education")}
                className="btn btn-outline"
                style={{ padding: "0.5rem" }}
              >
                <Plus size={16} />
              </button>
            </div>
            {aboutData.education.map((edu, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "1.5rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "education",
                        "degree",
                        e.target.value
                      )
                    }
                    style={{
                      padding: "0.5rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px",
                      color: "var(--text-primary)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="School"
                    value={edu.school}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "education",
                        "school",
                        e.target.value
                      )
                    }
                    style={{
                      padding: "0.5rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder="Period"
                    value={edu.period}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "education",
                        "period",
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={edu.description}
                  onChange={(e) =>
                    handleArrayChange(
                      index,
                      "education",
                      "description",
                      e.target.value
                    )
                  }
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeItem(index, "education")}
                  style={{
                    color: "var(--error-color)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
