import React, { useState, useEffect } from "react";
import { useData, type PricingPlan } from "../../context/DataContext";
import { Save, CheckCircle, AlertCircle } from "lucide-react";

const PricingManager: React.FC = () => {
  const { pricing, updatePricing, refreshData } = useData();
  const [plans, setPlans] = useState<PricingPlan[]>(pricing);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Sync local state when context changes
  useEffect(() => {
    setPlans(pricing);
  }, [pricing]);

  const handleChange = (
    index: number,
    field: keyof PricingPlan,
    value: any
  ) => {
    const newPlans = [...plans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    setPlans(newPlans);
  };

  const handleFeatureChange = (
    planIndex: number,
    featureIndex: number,
    value: string
  ) => {
    const newPlans = [...plans];
    const newFeatures = [...newPlans[planIndex].features];
    newFeatures[featureIndex] = value;
    newPlans[planIndex].features = newFeatures;
    setPlans(newPlans);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");

    try {
      await updatePricing(plans);
      await refreshData();
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("Error saving pricing:", err);
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
        <h1 style={{ fontSize: "2rem" }}>Manage Pricing</h1>
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
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={20} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className="glass-panel"
            style={{ padding: "1.5rem" }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                }}
              >
                Plan Name
              </label>
              <input
                type="text"
                value={plan.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
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
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                }}
              >
                Price
              </label>
              <input
                type="text"
                value={plan.price}
                onChange={(e) => handleChange(index, "price", e.target.value)}
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
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                }}
              >
                Color (Hex)
              </label>
              <input
                type="color"
                value={plan.color}
                onChange={(e) => handleChange(index, "color", e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "0",
                  border: "none",
                  background: "transparent",
                }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={plan.popular}
                  onChange={(e) =>
                    handleChange(index, "popular", e.target.checked)
                  }
                />
                Mark as Popular
              </label>
            </div>

            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                marginBottom: "0.5rem",
              }}
            >
              Features
            </label>
            {plan.features.map((feature, fIndex) => (
              <input
                key={fIndex}
                type="text"
                value={feature}
                onChange={(e) =>
                  handleFeatureChange(index, fIndex, e.target.value)
                }
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
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingManager;
