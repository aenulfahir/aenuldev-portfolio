import React, { useState } from "react";
import {
  X,
  Check,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Package,
  Zap,
  ChevronDown,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import Captcha from "./Captcha";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    title: string;
    price: string;
    color: string;
    features: string[];
  } | null;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, plan }) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+62",
    phone: "",
    company: "",
    projectName: "",
    projectDescription: "",
    timeline: "1-2 weeks",
    budget: "",
    selectedFeatures: [] as string[],
    additionalFeatures: "",
    designPreference: "modern",
    targetAudience: "",
    hasExistingDesign: "no",
    hasContentReady: "no",
    preferredStartDate: "",
    additionalNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter((f) => f !== feature)
        : [...prev.selectedFeatures, feature],
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }

    if (currentStep === 2) {
      if (!formData.projectName.trim())
        newErrors.projectName = "Project name is required";
      if (!formData.projectDescription.trim())
        newErrors.projectDescription = "Project description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("handleSubmit called, current step:", step);

    // Only allow submit on step 3
    if (step !== 3) {
      console.log("Form submit prevented - not on step 3");
      return;
    }

    if (!validateStep(3)) {
      console.log("Validation failed for step 3");
      return;
    }

    if (!captchaVerified) {
      setStatus("error");
      return;
    }

    console.log("Proceeding with order submission...");

    setSubmitting(true);
    setStatus("idle");

    try {
      // Prepare order data
      const orderData = {
        plan_id: plan?.id,
        plan_title: plan?.title,
        plan_price: plan?.price,
        full_name: formData.fullName,
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
        company: formData.company,
        project_name: formData.projectName,
        project_description: formData.projectDescription,
        timeline: formData.timeline,
        budget: formData.budget,
        selected_features: formData.selectedFeatures,
        additional_features: formData.additionalFeatures,
        design_preference: formData.designPreference,
        target_audience: formData.targetAudience,
        has_existing_design: formData.hasExistingDesign,
        has_content_ready: formData.hasContentReady,
        preferred_start_date: formData.preferredStartDate || null,
        additional_notes: formData.additionalNotes,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      // Generate UUID for order (since we can't select after insert without auth)
      const orderId = crypto.randomUUID();
      const orderDataWithId = {
        id: orderId,
        ...orderData,
      };

      // Save to Supabase (no .select() needed)
      const { error } = await supabase.from("orders").insert(orderDataWithId);

      if (error) throw error;

      // Send to webhook
      const webhookUrl = import.meta.env.VITE_ORDER_WEBHOOK_URL;
      console.log("Webhook URL:", webhookUrl);

      if (webhookUrl) {
        try {
          const webhookPayload = {
            ...orderDataWithId,
            submitted_at: new Date().toISOString(),
          };

          console.log("Sending to webhook:", webhookPayload);

          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(webhookPayload),
          });

          console.log("Webhook response status:", response.status);

          if (!response.ok) {
            console.error("Webhook failed with status:", response.status);
          } else {
            console.log("Webhook sent successfully!");
          }
        } catch (webhookError) {
          console.error("Webhook notification failed:", webhookError);
          // Don't fail the order if webhook fails
        }
      } else {
        console.warn("Webhook URL not configured in environment variables");
      }

      setStatus("success");

      // Show success popup longer for user to read
      setTimeout(() => {
        onClose();
        setStep(1);
        setFormData({
          fullName: "",
          email: "",
          countryCode: "+62",
          phone: "",
          company: "",
          projectName: "",
          projectDescription: "",
          timeline: "1-2 weeks",
          budget: "",
          selectedFeatures: [],
          additionalFeatures: "",
          designPreference: "modern",
          targetAudience: "",
          hasExistingDesign: "no",
          hasContentReady: "no",
          preferredStartDate: "",
          additionalNotes: "",
        });
        setStatus("idle");
        setErrors({});
        setCaptchaVerified(false);
      }, 5000); // 5 seconds to read the message
    } catch (err) {
      console.error("Error submitting order:", err);
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 3) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!isOpen || !plan) return null;

  // Country codes for phone number
  const countryCodes = [
    { code: "+62", country: "🇮🇩 Indonesia", flag: "🇮🇩" },
    { code: "+1", country: "🇺🇸 United States", flag: "🇺🇸" },
    { code: "+44", country: "🇬🇧 United Kingdom", flag: "🇬🇧" },
    { code: "+91", country: "🇮🇳 India", flag: "🇮🇳" },
    { code: "+86", country: "🇨🇳 China", flag: "🇨🇳" },
    { code: "+81", country: "🇯🇵 Japan", flag: "🇯🇵" },
    { code: "+82", country: "🇰🇷 South Korea", flag: "🇰🇷" },
    { code: "+65", country: "🇸🇬 Singapore", flag: "🇸🇬" },
    { code: "+60", country: "🇲🇾 Malaysia", flag: "🇲🇾" },
    { code: "+66", country: "🇹🇭 Thailand", flag: "🇹🇭" },
    { code: "+84", country: "🇻🇳 Vietnam", flag: "🇻🇳" },
    { code: "+63", country: "🇵🇭 Philippines", flag: "🇵🇭" },
    { code: "+61", country: "🇦🇺 Australia", flag: "🇦🇺" },
    { code: "+49", country: "🇩🇪 Germany", flag: "🇩🇪" },
    { code: "+33", country: "🇫🇷 France", flag: "🇫🇷" },
    { code: "+39", country: "🇮🇹 Italy", flag: "🇮🇹" },
    { code: "+34", country: "🇪🇸 Spain", flag: "🇪🇸" },
    { code: "+7", country: "🇷🇺 Russia", flag: "🇷🇺" },
    { code: "+55", country: "🇧🇷 Brazil", flag: "🇧🇷" },
    { code: "+52", country: "🇲🇽 Mexico", flag: "🇲🇽" },
    { code: "+27", country: "🇿🇦 South Africa", flag: "🇿🇦" },
    { code: "+971", country: "🇦🇪 UAE", flag: "🇦🇪" },
    { code: "+966", country: "🇸🇦 Saudi Arabia", flag: "🇸🇦" },
    { code: "+90", country: "🇹🇷 Turkey", flag: "🇹🇷" },
  ];

  const additionalFeatures = [
    "SEO Optimization",
    "Analytics Integration",
    "Social Media Integration",
    "Payment Gateway",
    "Admin Dashboard",
    "Multi-language Support",
    "Email Notifications",
    "Push Notifications",
    "Real-time Chat",
    "Advanced Security",
    "API Integration",
    "Cloud Hosting Setup",
  ];

  // Custom Select Component
  const CustomSelect: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
  }> = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "var(--text-primary)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = plan.color;
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
        >
          <span>{selectedOption?.label || placeholder}</span>
          <ChevronDown
            size={16}
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>
        {isOpen && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
              onClick={() => setIsOpen(false)}
            />
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                left: 0,
                right: 0,
                background: "rgba(20, 20, 30, 0.98)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                zIndex: 1000,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background:
                      value === option.value
                        ? `${plan.color}20`
                        : "transparent",
                    border: "none",
                    color:
                      value === option.value
                        ? plan.color
                        : "var(--text-primary)",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (value !== option.value) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== option.value) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(10px)",
          zIndex: 9997,
          animation: "fadeIn 0.3s ease",
        }}
      />

      {/* Modal */}
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
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(20, 20, 30, 0.98) 0%, rgba(30, 20, 40, 0.98) 100%)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            maxWidth: "900px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: `0 25px 50px rgba(0, 0, 0, 0.5), 0 0 100px ${plan.color}20`,
            animation: "slideUp 0.4s ease",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            type="button"
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "rgba(255, 255, 255, 0.1)",
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

          {/* Content */}
          <div
            style={{ overflowY: "auto", maxHeight: "90vh", padding: "3rem" }}
          >
            {/* Header */}
            <div style={{ marginBottom: "2rem", paddingRight: "3rem" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1rem",
                  background: `${plan.color}20`,
                  border: `1px solid ${plan.color}`,
                  borderRadius: "8px",
                  color: plan.color,
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                <Package
                  size={16}
                  style={{ display: "inline", marginRight: "0.5rem" }}
                />
                {plan.title}
              </div>
              <h2
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "0.5rem",
                  background: `linear-gradient(135deg, ${plan.color}, #fff)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Order Your Project
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                Starting from{" "}
                <span style={{ color: plan.color, fontWeight: "600" }}>
                  Rp {plan.price}
                </span>
              </p>
            </div>

            {/* Progress Steps */}
            <div style={{ marginBottom: "3rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background:
                          step >= s ? plan.color : "rgba(255,255,255,0.1)",
                        border: `2px solid ${
                          step >= s ? plan.color : "rgba(255,255,255,0.2)"
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        color: step >= s ? "#000" : "var(--text-secondary)",
                        transition: "all 0.3s ease",
                        zIndex: 2,
                      }}
                    >
                      {step > s ? <Check size={20} /> : s}
                    </div>
                    <span
                      style={{
                        marginTop: "0.5rem",
                        fontSize: "0.85rem",
                        color: step >= s ? plan.color : "var(--text-secondary)",
                        fontWeight: step === s ? "600" : "400",
                      }}
                    >
                      {s === 1
                        ? "Personal Info"
                        : s === 2
                        ? "Project Details"
                        : "Requirements"}
                    </span>
                    {s < 3 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          left: "50%",
                          width: "100%",
                          height: "2px",
                          background:
                            step > s ? plan.color : "rgba(255,255,255,0.1)",
                          zIndex: 1,
                          transition: "all 0.3s ease",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                // Prevent form submission on Enter key (except in textarea)
                const target = e.target as HTMLElement;
                if (e.key === "Enter" && target.tagName !== "TEXTAREA") {
                  console.log(
                    "Enter key prevented on:",
                    target.tagName,
                    target
                  );
                  e.preventDefault();
                }
              }}
            >
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <User size={24} color={plan.color} />
                    Personal Information
                  </h3>

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
                        }}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "rgba(255,255,255,0.05)",
                          border: `1px solid ${
                            errors.fullName
                              ? "#ef4444"
                              : "rgba(255,255,255,0.1)"
                          }`,
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                        }}
                      />
                      {errors.fullName && (
                        <small style={{ color: "#ef4444", fontSize: "0.8rem" }}>
                          {errors.fullName}
                        </small>
                      )}
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>

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
                        }}
                      >
                        <Mail
                          size={14}
                          style={{ display: "inline", marginRight: "0.3rem" }}
                        />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "rgba(255,255,255,0.05)",
                          border: `1px solid ${
                            errors.email ? "#ef4444" : "rgba(255,255,255,0.1)"
                          }`,
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                        }}
                      />
                      {errors.email && (
                        <small style={{ color: "#ef4444", fontSize: "0.8rem" }}>
                          {errors.email}
                        </small>
                      )}
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <Phone
                          size={14}
                          style={{ display: "inline", marginRight: "0.3rem" }}
                        />
                        Phone Number *
                      </label>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {/* Country Code Selector */}
                        <div style={{ width: "140px" }}>
                          <CustomSelect
                            value={formData.countryCode}
                            onChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                countryCode: value,
                              }))
                            }
                            options={countryCodes.map((c) => ({
                              value: c.code,
                              label: `${c.flag} ${c.code}`,
                            }))}
                          />
                        </div>
                        {/* Phone Number Input */}
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="812 3456 7890"
                          style={{
                            flex: 1,
                            padding: "0.75rem",
                            background: "rgba(255,255,255,0.05)",
                            border: `1px solid ${
                              errors.phone ? "#ef4444" : "rgba(255,255,255,0.1)"
                            }`,
                            borderRadius: "8px",
                            color: "var(--text-primary)",
                          }}
                        />
                      </div>
                      {errors.phone && (
                        <small style={{ color: "#ef4444", fontSize: "0.8rem" }}>
                          {errors.phone}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Project Details */}
              {step === 2 && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Briefcase size={24} color={plan.color} />
                    Project Details
                  </h3>

                  <div style={{ marginBottom: "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      placeholder="My Awesome Project"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "rgba(255,255,255,0.05)",
                        border: `1px solid ${
                          errors.projectName
                            ? "#ef4444"
                            : "rgba(255,255,255,0.1)"
                        }`,
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                      }}
                    />
                    {errors.projectName && (
                      <small style={{ color: "#ef4444", fontSize: "0.8rem" }}>
                        {errors.projectName}
                      </small>
                    )}
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <FileText
                        size={14}
                        style={{ display: "inline", marginRight: "0.3rem" }}
                      />
                      Project Description *
                    </label>
                    <textarea
                      name="projectDescription"
                      value={formData.projectDescription}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe your project, goals, and what you want to achieve..."
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "rgba(255,255,255,0.05)",
                        border: `1px solid ${
                          errors.projectDescription
                            ? "#ef4444"
                            : "rgba(255,255,255,0.1)"
                        }`,
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        resize: "vertical",
                      }}
                    />
                    {errors.projectDescription && (
                      <small style={{ color: "#ef4444", fontSize: "0.8rem" }}>
                        {errors.projectDescription}
                      </small>
                    )}
                  </div>

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
                        }}
                      >
                        <Clock
                          size={14}
                          style={{ display: "inline", marginRight: "0.3rem" }}
                        />
                        Timeline *
                      </label>
                      <CustomSelect
                        value={formData.timeline}
                        onChange={(value) =>
                          setFormData((prev) => ({ ...prev, timeline: value }))
                        }
                        options={[
                          { value: "1-2 weeks", label: "1-2 weeks" },
                          { value: "2-4 weeks", label: "2-4 weeks" },
                          { value: "1-2 months", label: "1-2 months" },
                          { value: "2-3 months", label: "2-3 months" },
                          { value: "3+ months", label: "3+ months" },
                          { value: "flexible", label: "Flexible" },
                        ]}
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
                        <DollarSign
                          size={14}
                          style={{ display: "inline", marginRight: "0.3rem" }}
                        />
                        Budget Range
                      </label>
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="e.g., 5-10 million"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>

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
                        }}
                      >
                        Target Audience
                      </label>
                      <input
                        type="text"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        placeholder="e.g., Young professionals, B2B"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
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
                        <Calendar
                          size={14}
                          style={{ display: "inline", marginRight: "0.3rem" }}
                        />
                        Preferred Start Date
                      </label>
                      <input
                        type="date"
                        name="preferredStartDate"
                        value={formData.preferredStartDate}
                        onChange={handleChange}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Requirements */}
              {step === 3 && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Zap size={24} color={plan.color} />
                    Project Requirements
                  </h3>

                  {/* Included Features */}
                  <div style={{ marginBottom: "2rem" }}>
                    <h4 style={{ marginBottom: "1rem", color: plan.color }}>
                      ✓ Included in {plan.title}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {plan.features.map((feature, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "0.5rem 1rem",
                            background: `${plan.color}20`,
                            border: `1px solid ${plan.color}`,
                            borderRadius: "8px",
                            color: plan.color,
                            fontSize: "0.85rem",
                          }}
                        >
                          <Check
                            size={14}
                            style={{ display: "inline", marginRight: "0.3rem" }}
                          />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Additional Features */}
                  <div style={{ marginBottom: "1rem" }}>
                    <h4
                      style={{
                        marginBottom: "1rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      Additional Features (Optional)
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {additionalFeatures.map((feature) => {
                        const isSelected =
                          formData.selectedFeatures.includes(feature);
                        return (
                          <button
                            key={feature}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFeature(feature);
                            }}
                            style={{
                              padding: "0.5rem 1rem",
                              background: isSelected
                                ? "rgba(34, 197, 94, 0.2)"
                                : "rgba(255,255,255,0.05)",
                              border: `1px solid ${
                                isSelected ? "#22c55e" : "rgba(255,255,255,0.1)"
                              }`,
                              borderRadius: "8px",
                              color: isSelected
                                ? "#22c55e"
                                : "var(--text-secondary)",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {isSelected && (
                              <Check
                                size={14}
                                style={{
                                  display: "inline",
                                  marginRight: "0.3rem",
                                }}
                              />
                            )}
                            {feature}
                          </button>
                        );
                      })}
                    </div>
                    <textarea
                      name="additionalFeatures"
                      value={formData.additionalFeatures}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Describe any other features you need..."
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  {/* Design & Content */}
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
                        }}
                      >
                        Design Preference
                      </label>
                      <CustomSelect
                        value={formData.designPreference}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            designPreference: value,
                          }))
                        }
                        options={[
                          { value: "modern", label: "Modern" },
                          { value: "minimalist", label: "Minimalist" },
                          { value: "corporate", label: "Corporate" },
                          { value: "creative", label: "Creative" },
                          { value: "elegant", label: "Elegant" },
                        ]}
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
                        Existing Design?
                      </label>
                      <CustomSelect
                        value={formData.hasExistingDesign}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            hasExistingDesign: value,
                          }))
                        }
                        options={[
                          { value: "no", label: "No" },
                          { value: "yes", label: "Yes" },
                          { value: "partial", label: "Partial" },
                        ]}
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
                        Content Ready?
                      </label>
                      <CustomSelect
                        value={formData.hasContentReady}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            hasContentReady: value,
                          }))
                        }
                        options={[
                          { value: "no", label: "No" },
                          { value: "yes", label: "Yes" },
                          { value: "partial", label: "Partial" },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Additional Notes
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any other information we should know..."
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  {/* Captcha Verification */}
                  <div style={{ marginBottom: "1rem" }}>
                    <Captcha onVerified={setCaptchaVerified} />
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {status === "success" && (
                <div
                  style={{
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    background:
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)",
                    border: "2px solid rgba(34, 197, 94, 0.4)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)",
                    animation: "slideDown 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <CheckCircle
                      size={32}
                      style={{ color: "#22c55e", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          color: "#22c55e",
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                        }}
                      >
                        🎉 Pesanan Berhasil Dikirim!
                      </h4>
                      <p
                        style={{
                          color: "#86efac",
                          fontSize: "0.95rem",
                          lineHeight: "1.6",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Terima kasih atas pesanan Anda! Kami telah menerima
                        detail project Anda.
                      </p>
                      <div
                        style={{
                          background: "rgba(34, 197, 94, 0.1)",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          borderLeft: "3px solid #22c55e",
                        }}
                      >
                        <p
                          style={{
                            color: "#d1fae5",
                            fontSize: "0.9rem",
                            margin: 0,
                          }}
                        >
                          📧 <strong>Silakan cek email Anda</strong> untuk
                          konfirmasi pesanan.
                          <br />
                          <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                            💡 Jika tidak ada di inbox, cek folder{" "}
                            <strong>Spam/Junk</strong>
                          </span>
                        </p>
                      </div>
                      <p
                        style={{
                          color: "#86efac",
                          fontSize: "0.85rem",
                          marginTop: "0.75rem",
                          marginBottom: 0,
                        }}
                      >
                        Tim kami akan menghubungi Anda dalam 1x24 jam.
                      </p>
                    </div>
                  </div>
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
                  Failed to submit order. Please try again.
                </div>
              )}

              {/* Navigation Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "2rem",
                  paddingTop: "2rem",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: "0.75rem 1.5rem" }}
                  >
                    Previous
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: "0.75rem 1.5rem",
                      background: plan.color,
                      border: `1px solid ${plan.color}`,
                      color: "#000",
                    }}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting || !captchaVerified}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubmit(e as any);
                    }}
                    className="btn"
                    style={{
                      flex: 1,
                      padding: "0.75rem 1.5rem",
                      background: captchaVerified
                        ? plan.color
                        : "rgba(255,255,255,0.1)",
                      border: `1px solid ${
                        captchaVerified ? plan.color : "rgba(255,255,255,0.2)"
                      }`,
                      color: captchaVerified ? "#000" : "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      opacity: captchaVerified ? 1 : 0.6,
                      cursor: captchaVerified ? "pointer" : "not-allowed",
                    }}
                  >
                    {submitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Order
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderModal;
