import React, { useState, useEffect } from "react";
import { useData, type HeroData } from "../../context/DataContext";
import {
  Save,
  Globe,
  Shield,
  Layout,
  Github,
  Linkedin,
  Instagram,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const GeneralSettings: React.FC = () => {
  const { hero, updateHero, refreshData } = useData();
  const [heroData, setHeroData] = useState<HeroData>(hero);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Sync local state when context changes
  useEffect(() => {
    setHeroData(hero);
  }, [hero]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setHeroData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHeroData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    try {
      await updateHero(heroData);
      await refreshData(); // Refresh all data to sync
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
        <h1 style={{ fontSize: "2rem" }}>General Settings</h1>
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
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
      >
        {/* Site Configuration */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Shield size={20} color="var(--primary-color)" /> Site Configuration
          </h2>

          <div
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
            }}
          >
            <div>
              <div style={{ fontWeight: "bold" }}>Maintenance Mode</div>
              <div
                style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
              >
                Disable public access to the site
              </div>
            </div>
            <label
              className="switch"
              style={{
                position: "relative",
                display: "inline-block",
                width: "50px",
                height: "26px",
              }}
            >
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: maintenanceMode
                    ? "var(--primary-color)"
                    : "#ccc",
                  transition: ".4s",
                  borderRadius: "34px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    content: '""',
                    height: "20px",
                    width: "20px",
                    left: "3px",
                    bottom: "3px",
                    backgroundColor: "white",
                    transition: ".4s",
                    borderRadius: "50%",
                    transform: maintenanceMode
                      ? "translateX(24px)"
                      : "translateX(0)",
                  }}
                />
              </span>
            </label>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--text-secondary)",
              }}
            >
              Site Title (SEO)
            </label>
            <input
              type="text"
              value="Aenul Portfolio"
              disabled
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                color: "var(--text-secondary)",
                cursor: "not-allowed",
              }}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Globe size={20} color="var(--secondary-color)" /> Social
            Connections
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ position: "relative" }}>
              <Github
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "12px",
                  color: "var(--text-secondary)",
                }}
              />
              <input
                type="text"
                name="github"
                value={heroData.socialLinks.github}
                onChange={handleSocialChange}
                placeholder="GitHub URL"
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div style={{ position: "relative" }}>
              <Linkedin
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "12px",
                  color: "var(--text-secondary)",
                }}
              />
              <input
                type="text"
                name="linkedin"
                value={heroData.socialLinks.linkedin}
                onChange={handleSocialChange}
                placeholder="LinkedIn URL"
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div style={{ position: "relative" }}>
              <Instagram
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "12px",
                  color: "var(--text-secondary)",
                }}
              />
              <input
                type="text"
                name="instagram"
                value={heroData.socialLinks.instagram}
                onChange={handleSocialChange}
                placeholder="Instagram URL"
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Hero Section Content */}
        <div
          className="glass-panel"
          style={{ padding: "2rem", gridColumn: "1 / -1" }}
        >
          <h2
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Layout size={20} color="var(--accent-color)" /> Hero Section
            Content
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Greeting
              </label>
              <input
                type="text"
                name="greeting"
                value={heroData.greeting}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
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
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Display Name
              </label>
              <input
                type="text"
                name="name"
                value={heroData.name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={heroData.description}
                onChange={handleChange}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.75rem",
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
    </div>
  );
};

export default GeneralSettings;
