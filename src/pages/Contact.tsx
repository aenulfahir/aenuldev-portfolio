import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Github,
  Linkedin,
  Instagram,
  ShieldCheck,
} from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll";
import Captcha from "../components/Captcha";
import { useData } from "../context/DataContext";
import { submitContactMessage } from "../lib/services/contactService";

const Contact: React.FC = () => {
  const { about, hero } = useData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setErrorMsg("Mohon lengkapi semua field");
      return;
    }

    if (!captchaVerified) {
      setStatus("error");
      setErrorMsg("Mohon selesaikan verifikasi keamanan");
      return;
    }

    setStatus("loading");
    try {
      await submitContactMessage(
        formData.name,
        formData.email,
        formData.message
      );
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setCaptchaVerified(false);
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error("Error submitting message:", err);
      setStatus("error");
      setErrorMsg("Gagal mengirim pesan. Silakan coba lagi.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status === "error") setStatus("idle");
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: about.contact.email,
      color: "#00ff9d",
      bg: "rgba(0, 255, 157, 0.1)",
    },
    {
      icon: Phone,
      label: "Telepon",
      value: about.contact.phone,
      color: "#00b8ff",
      bg: "rgba(0, 184, 255, 0.1)",
    },
    {
      icon: MapPin,
      label: "Lokasi",
      value: about.contact.location,
      color: "#ffbd2e",
      bg: "rgba(255, 189, 46, 0.1)",
    },
  ];

  const socialLinks = [
    { icon: Github, href: hero.socialLinks.github, label: "GitHub" },
    { icon: Linkedin, href: hero.socialLinks.linkedin, label: "LinkedIn" },
    { icon: Instagram, href: hero.socialLinks.instagram, label: "Instagram" },
  ];

  return (
    <div className="container section">
      <RevealOnScroll>
        <div className="contact-header">
          <div className="contact-badge">
            <Sparkles size={16} />
            <span>Mari Berkolaborasi</span>
          </div>
          <h1 className="contact-title">Hubungi Saya</h1>
          <p className="contact-subtitle">
            Punya project menarik? Mari diskusikan bagaimana kita bisa bekerja
            sama.
          </p>
        </div>
      </RevealOnScroll>

      <div className="contact-grid">
        <div className="contact-info-column">
          <RevealOnScroll animation="slide-left">
            <div className="contact-info-card glass-panel">
              <h3 className="contact-info-title">
                <span className="title-icon">
                  <Mail size={20} />
                </span>
                Informasi Kontak
              </h3>
              <div className="contact-info-list">
                {contactInfo.map((item, index) => (
                  <div key={index} className="contact-info-item">
                    <div
                      className="info-icon"
                      style={{ background: item.bg, color: item.color }}
                    >
                      <item.icon size={20} />
                    </div>
                    <div className="info-content">
                      <span className="info-label">{item.label}</span>
                      <span className="info-value">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll animation="slide-left" delay={0.2}>
            <div className="social-card">
              <h3 className="social-title">// Temukan saya di</h3>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                    title={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll animation="slide-right">
          <form className="contact-form glass-panel" onSubmit={handleSubmit}>
            <div className="form-header">
              <h3>
                <MessageSquare size={24} className="form-header-icon" /> Kirim
                Pesan
              </h3>
              <p>Saya akan merespons dalam 24 jam</p>
            </div>

            {status === "success" && (
              <div className="status-message success">
                <div className="status-icon">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="status-title">Pesan Terkirim!</p>
                  <p className="status-desc">
                    Terima kasih, saya akan segera menghubungi Anda.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="status-message error">
                <AlertCircle size={24} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-fields">
              <div
                className={`form-group ${
                  focusedField === "name" ? "focused" : ""
                }`}
              >
                <label>
                  <User size={16} /> Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan nama Anda"
                />
              </div>

              <div
                className={`form-group ${
                  focusedField === "email" ? "focused" : ""
                }`}
              >
                <label>
                  <Mail size={16} /> Alamat Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="email@contoh.com"
                />
              </div>

              <div
                className={`form-group ${
                  focusedField === "message" ? "focused" : ""
                }`}
              >
                <label>
                  <MessageSquare size={16} /> Pesan Anda
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ceritakan tentang project atau ide Anda..."
                />
                <span className="char-count">
                  {formData.message.length} / 1000
                </span>
              </div>

              {/* Captcha */}
              <Captcha onVerified={setCaptchaVerified} />

              <button
                type="submit"
                className="submit-btn"
                disabled={status === "loading" || !captchaVerified}
              >
                {status === "loading" ? (
                  <>
                    <span className="spinner"></span> Mengirim...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} /> Kirim Pesan{" "}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        </RevealOnScroll>
      </div>

      <style>{`
        .contact-header { text-align: center; margin-bottom: 4rem; }
        .contact-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1rem; background: rgba(0, 255, 157, 0.1);
          border: 1px solid rgba(0, 255, 157, 0.2); border-radius: 50px;
          margin-bottom: 1.5rem; color: var(--primary-color);
          font-size: 0.85rem; font-family: var(--font-mono);
        }
        .contact-title {
          font-size: 3rem; margin-bottom: 1rem;
          background: linear-gradient(135deg, #fff, var(--primary-color));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .contact-subtitle { color: var(--text-secondary); max-width: 500px; margin: 0 auto; }
        .contact-grid {
          display: grid; grid-template-columns: 1fr 1.2fr; gap: 3rem;
          max-width: 1000px; margin: 0 auto;
        }
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
        .contact-info-column { display: flex; flex-direction: column; gap: 1.5rem; }
        .contact-info-card { padding: 2rem; }
        .contact-info-title { display: flex; align-items: center; gap: 0.75rem; font-size: 1.25rem; margin-bottom: 1.5rem; }
        .title-icon {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(0, 255, 157, 0.2), rgba(0, 184, 255, 0.2));
          color: var(--primary-color);
        }
        .contact-info-list { display: flex; flex-direction: column; gap: 1rem; }
        .contact-info-item {
          display: flex; align-items: center; gap: 1rem; padding: 1rem;
          border-radius: 12px; background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05); transition: all 0.3s ease;
        }
        .contact-info-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(0, 255, 157, 0.2); transform: translateX(5px);
        }
        .info-icon {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
        }
        .info-content { display: flex; flex-direction: column; gap: 0.25rem; }
        .info-label { font-size: 0.8rem; color: var(--text-secondary); font-family: var(--font-mono); }
        .info-value { font-size: 1rem; font-weight: 500; }
        .social-card {
          padding: 1.5rem; border-radius: 16px;
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .social-title { font-size: 0.9rem; color: var(--text-secondary); font-family: var(--font-mono); margin-bottom: 1rem; font-weight: 400; }
        .social-links { display: flex; gap: 0.75rem; }
        .social-btn {
          display: flex; align-items: center; justify-content: center;
          width: 48px; height: 48px; border-radius: 12px;
          background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary); transition: all 0.3s ease;
        }
        .social-btn:hover {
          background: rgba(0, 255, 157, 0.1); border-color: var(--primary-color);
          color: var(--primary-color); transform: translateY(-3px);
          box-shadow: 0 5px 20px rgba(0, 255, 157, 0.2);
        }
        .contact-form { padding: 2.5rem; }
        .form-header { margin-bottom: 2rem; }
        .form-header h3 { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; margin-bottom: 0.5rem; }
        .form-header-icon { color: var(--primary-color); }
        .form-header p { color: var(--text-secondary); font-size: 0.9rem; }
        .status-message {
          display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem;
          border-radius: 12px; margin-bottom: 1.5rem; animation: slideDown 0.4s ease;
        }
        .status-message.success {
          background: linear-gradient(135deg, rgba(0, 255, 157, 0.15), rgba(0, 255, 157, 0.05));
          border: 1px solid rgba(0, 255, 157, 0.3);
        }
        .status-message.error {
          background: linear-gradient(135deg, rgba(255, 100, 100, 0.15), rgba(255, 100, 100, 0.05));
          border: 1px solid rgba(255, 100, 100, 0.3); color: #ff6464;
        }
        .status-icon {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(0, 255, 157, 0.2); display: flex;
          align-items: center; justify-content: center;
          color: var(--primary-color); flex-shrink: 0;
        }
        .status-title { font-weight: 600; color: var(--primary-color); }
        .status-desc { font-size: 0.85rem; color: var(--text-secondary); }
        .form-fields { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-group { position: relative; }
        .form-group label {
          display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
          font-size: 0.9rem; color: var(--text-secondary);
          font-family: var(--font-mono); transition: color 0.3s ease;
        }
        .form-group.focused label { color: var(--primary-color); }
        .form-group input, .form-group textarea {
          width: 100%; padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px; color: var(--text-primary);
          font-family: var(--font-sans); font-size: 1rem;
          transition: all 0.3s ease; outline: none;
        }
        .form-group input:hover, .form-group textarea:hover {
          border-color: rgba(0, 255, 157, 0.3); background: rgba(255, 255, 255, 0.05);
        }
        .form-group.focused input, .form-group.focused textarea {
          border-color: var(--primary-color); box-shadow: 0 0 20px rgba(0, 255, 157, 0.15);
        }
        .form-group input::placeholder, .form-group textarea::placeholder { color: rgba(255, 255, 255, 0.3); }
        .form-group textarea { resize: vertical; min-height: 140px; }
        .char-count { display: block; text-align: right; font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem; }
        
        .submit-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          width: 100%; padding: 1.25rem 2rem;
          background: linear-gradient(135deg, var(--primary-color), #00d485);
          color: var(--bg-color); border: none; border-radius: 12px;
          font-size: 1rem; font-weight: 600; font-family: var(--font-mono);
          cursor: pointer; transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 255, 157, 0.3); margin-top: 0.5rem;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0, 255, 157, 0.4); }
        .submit-btn:active:not(:disabled) { transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; background: rgba(255, 255, 255, 0.1); box-shadow: none; }
        .spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(0, 0, 0, 0.2); border-top-color: var(--bg-color);
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Contact;
