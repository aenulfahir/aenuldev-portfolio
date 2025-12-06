import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  User,
  Briefcase,
  DollarSign,
  FileText,
  Mail,
  LogOut,
  Terminal,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/admin/settings", icon: <Settings size={20} />, label: "General" },
    { path: "/admin/profile", icon: <User size={20} />, label: "Data Diri" },
    {
      path: "/admin/projects",
      icon: <Briefcase size={20} />,
      label: "Projects",
    },
    {
      path: "/admin/pricing",
      icon: <DollarSign size={20} />,
      label: "Pricing",
    },
    { path: "/admin/blog", icon: <FileText size={20} />, label: "Blog" },
    { path: "/admin/contact", icon: <Mail size={20} />, label: "Contact" },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-color)",
      }}
    >
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="admin-mobile-toggle"
        style={{
          display: "none",
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1000,
          background: "var(--primary-color)",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          padding: "0.75rem",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={closeSidebar}
          style={{
            display: "none",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={sidebarOpen ? "admin-sidebar-open" : ""}
        style={{
          width: "250px",
          background: "rgba(10, 10, 10, 0.9)",
          borderRight: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          transition: "transform 0.3s ease",
        }}
      >
        <div
          style={{
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <Terminal size={24} color="var(--primary-color)" />
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              fontFamily: "var(--font-mono)",
            }}
          >
            Admin<span style={{ color: "var(--primary-color)" }}>Panel</span>
          </span>
        </div>

        <nav style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeSidebar}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    color:
                      location.pathname === item.path
                        ? "var(--bg-color)"
                        : "var(--text-secondary)",
                    background:
                      location.pathname === item.path
                        ? "var(--primary-color)"
                        : "transparent",
                    transition: "all 0.2s",
                    textDecoration: "none",
                    fontWeight:
                      location.pathname === item.path ? "bold" : "normal",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid var(--border-color)",
          }}
        >
          {user && (
            <div
              style={{
                marginBottom: "0.75rem",
                padding: "0.5rem",
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={user.email || ""}
            >
              👤 {user.email}
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              width: "100%",
              padding: "0.75rem 1rem",
              background: "rgba(255, 59, 48, 0.1)",
              color: "var(--error-color)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: "250px",
          padding: "2rem",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </main>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .admin-mobile-toggle {
            display: block !important;
          }

          aside {
            transform: translateX(-100%);
          }

          aside.admin-sidebar-open {
            transform: translateX(0);
          }

          .admin-overlay {
            display: block !important;
          }

          main {
            margin-left: 0 !important;
            padding: 1rem !important;
            padding-top: 4rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
