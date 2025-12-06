import React, { useState } from "react";
import { Check, Zap, Globe, Bot } from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";
import OrderModal from "../components/OrderModal";
import { useData } from "../context/DataContext";

const Pricing: React.FC = () => {
  const { pricing } = useData();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChoosePlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPlan(null), 300);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "bot":
        return <Bot size={32} />;
      case "globe":
        return <Globe size={32} />;
      case "zap":
        return <Zap size={32} />;
      default:
        return <Globe size={32} />;
    }
  };

  return (
    <div className="container section">
      <RevealOnScroll>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <h1
            className="glow-text"
            style={{ fontSize: "3.5rem", marginBottom: "1rem" }}
          >
            Service Pricing
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            Transparent pricing for high-quality digital solutions.
          </p>
        </div>
      </RevealOnScroll>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2.5rem",
          alignItems: "center",
        }}
      >
        {pricing.map((plan, index) => (
          <RevealOnScroll key={plan.id} delay={index * 0.2}>
            <div
              className="glass-panel"
              style={{
                padding: "2.5rem",
                position: "relative",
                textAlign: "center",
                border: plan.popular
                  ? `1px solid ${plan.color}`
                  : "1px solid var(--border-color)",
                transition: "all 0.3s ease",
                transform: plan.popular ? "scale(1.05)" : "scale(1)",
                boxShadow: plan.popular ? `0 0 30px ${plan.color}20` : "none",
                zIndex: plan.popular ? 2 : 1,
                background: plan.popular
                  ? "rgba(10, 10, 10, 0.8)"
                  : "var(--glass-bg)",
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-15px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: plan.color,
                    color: "var(--bg-color)",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    boxShadow: `0 0 15px ${plan.color}60`,
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              <div
                style={{
                  background: `rgba(${parseInt(
                    plan.color.slice(1, 3),
                    16
                  )}, ${parseInt(plan.color.slice(3, 5), 16)}, ${parseInt(
                    plan.color.slice(5, 7),
                    16
                  )}, 0.1)`,
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 2rem",
                  color: plan.color,
                  boxShadow: `0 0 20px ${plan.color}20`,
                }}
              >
                {getIcon(plan.iconType)}
              </div>

              <h3
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "0.5rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {plan.title}
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                  marginBottom: "2.5rem",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{ fontSize: "1rem", color: "var(--text-secondary)" }}
                >
                  Starts from
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      color: plan.color,
                      lineHeight: 1,
                    }}
                  >
                    Rp {plan.price}
                  </span>
                </div>
              </div>

              <ul
                style={{
                  listStyle: "none",
                  textAlign: "left",
                  marginBottom: "2.5rem",
                  padding: "0 1rem",
                }}
              >
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "1rem",
                      color: "var(--text-secondary)",
                      fontSize: "1rem",
                    }}
                  >
                    <div
                      style={{
                        background: `rgba(${parseInt(
                          plan.color.slice(1, 3),
                          16
                        )}, ${parseInt(plan.color.slice(3, 5), 16)}, ${parseInt(
                          plan.color.slice(5, 7),
                          16
                        )}, 0.2)`,
                        borderRadius: "50%",
                        padding: "2px",
                        display: "flex",
                      }}
                    >
                      <Check size={14} color={plan.color} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleChoosePlan(plan)}
                className="btn"
                style={{
                  width: "100%",
                  background: plan.popular ? plan.color : "transparent",
                  border: `1px solid ${plan.color}`,
                  color: plan.popular ? "var(--bg-color)" : plan.color,
                  justifyContent: "center",
                  padding: "1rem",
                  fontSize: "1rem",
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.background = plan.color;
                    e.currentTarget.style.color = "var(--bg-color)";
                    e.currentTarget.style.boxShadow = `0 0 20px ${plan.color}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = plan.color;
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                Choose Plan
              </button>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        plan={selectedPlan}
      />
    </div>
  );
};

export default Pricing;
