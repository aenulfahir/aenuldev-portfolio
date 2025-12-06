import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Terminal,
  Lock,
  AlertTriangle,
  Mail,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      setIsLoading(false);
      setError("ACCESS DENIED: " + error.message);
    } else {
      setIsLoading(false);
      navigate("/admin");
    }
  };

  return (
    <div
      className="container section"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        position: "relative",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at center, rgba(0, 255, 157, 0.05) 0%, transparent 70%)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "0",
          border: "1px solid var(--primary-color)",
          boxShadow: "0 0 30px rgba(0, 255, 157, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            background: "rgba(0, 255, 157, 0.1)",
            padding: "0.75rem 1rem",
            borderBottom: "1px solid var(--primary-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--primary-color)",
            }}
          >
            <Terminal size={18} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              ADMIN_ACCESS_V2.0
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#ff5f56",
              }}
            ></div>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#ffbd2e",
              }}
            ></div>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#27c93f",
              }}
            ></div>
          </div>
        </div>

        {/* Terminal Body */}
        <div style={{ padding: "2rem" }}>
          <div
            style={{
              marginBottom: "2rem",
              fontFamily: "var(--font-mono)",
              color: "var(--primary-color)",
            }}
          >
            <p>&gt; INITIATING SECURE CONNECTION...</p>
            <p>&gt; SUPABASE_AUTH: ENABLED</p>
            <p>&gt; PLEASE AUTHENTICATE{cursorVisible ? "_" : " "}</p>
          </div>

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div style={{ position: "relative" }}>
              <label
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "10px",
                  background: "var(--surface-color)",
                  padding: "0 0.5rem",
                  color: "var(--primary-color)",
                  fontSize: "0.8rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                EMAIL
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <span
                  style={{ padding: "0.75rem", color: "var(--text-secondary)" }}
                >
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 0",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-mono)",
                    outline: "none",
                  }}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <label
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "10px",
                  background: "var(--surface-color)",
                  padding: "0 0.5rem",
                  color: "var(--primary-color)",
                  fontSize: "0.8rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                PASSKEY
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <span
                  style={{ padding: "0.75rem", color: "var(--text-secondary)" }}
                >
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 0",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-mono)",
                    outline: "none",
                  }}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  color: "var(--error-color)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(255, 77, 77, 0.1)",
                  padding: "0.5rem",
                  borderRadius: "4px",
                }}
              >
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn"
              style={{
                marginTop: "1rem",
                width: "100%",
                justifyContent: "center",
                background: isLoading
                  ? "var(--surface-hover)"
                  : "var(--primary-color)",
                color: isLoading ? "var(--text-secondary)" : "var(--bg-color)",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {isLoading ? "AUTHENTICATING..." : "EXECUTE_LOGIN()"}
            </button>
          </form>
        </div>

        {/* Terminal Footer */}
        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            padding: "0.5rem 1rem",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.7rem",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>SYS_STATUS: ONLINE</span>
          <span>AUTH: SUPABASE</span>
        </div>
      </div>

      {/* Back to Home Button */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: "2rem",
          left: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.25rem",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.9rem",
          textDecoration: "none",
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0, 255, 157, 0.1)";
          e.currentTarget.style.borderColor = "var(--primary-color)";
          e.currentTarget.style.color = "var(--primary-color)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.color = "var(--text-secondary)";
        }}
      >
        <ArrowLeft size={18} />
        <Home size={16} />
        <span>Kembali ke Home</span>
      </Link>
    </div>
  );
};

export default Login;
