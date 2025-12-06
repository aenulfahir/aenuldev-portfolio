import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Terminal, ChevronRight } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Data Diri", id: "about" },
    { name: "Projects", id: "projects" },
    { name: "Pricing", id: "pricing" },
    { name: "Blog", id: "blog" },
    { name: "Contact", id: "contact" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Update scrolled state for navbar background
      setScrolled(window.scrollY > 50);

      // Update active section
      const sections = navLinks.map((link) => document.getElementById(link.id));
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        if (
          section &&
          section.offsetTop <= scrollPosition &&
          section.offsetTop + section.offsetHeight > scrollPosition
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest(".navbar-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <nav
        className="navbar-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? "0.75rem 1.5rem" : "1rem 1.5rem",
          background: scrolled ? "rgba(5, 5, 5, 0.95)" : "rgba(5, 5, 5, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(0, 255, 157, 0.1)"
            : "1px solid transparent",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.3)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
            className="navbar-logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem 0",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, rgba(0, 255, 157, 0.15), rgba(0, 184, 255, 0.15))",
                border: "1px solid rgba(0, 255, 157, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              <Terminal size={22} color="var(--primary-color)" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  fontFamily: "var(--font-mono)",
                  background:
                    "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AenulDev
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                  marginTop: "-2px",
                }}
              >
                PORTFOLIO
              </span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div
            className="desktop-menu"
            style={{
              display: "none",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {navLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="nav-link"
                style={{
                  position: "relative",
                  color:
                    activeSection === link.id
                      ? "var(--primary-color)"
                      : "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  fontWeight: activeSection === link.id ? "600" : "500",
                  background:
                    activeSection === link.id
                      ? "rgba(0, 255, 157, 0.08)"
                      : "transparent",
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>
                  {activeSection === link.id && (
                    <span
                      style={{
                        color: "var(--primary-color)",
                        marginRight: "4px",
                        opacity: 0.7,
                      }}
                    >
                      //
                    </span>
                  )}
                  {link.name}
                </span>
              </button>
            ))}

            {/* Login Button */}
            <Link
              to="/login"
              className="login-btn"
              style={{
                marginLeft: "1rem",
                padding: "0.6rem 1.25rem",
                fontSize: "0.85rem",
                fontFamily: "var(--font-mono)",
                fontWeight: "600",
                color: "var(--bg-color)",
                background:
                  "linear-gradient(135deg, var(--primary-color), #00d485)",
                borderRadius: "8px",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(0, 255, 157, 0.25)",
              }}
            >
              Login
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: isOpen
                ? "rgba(0, 255, 157, 0.1)"
                : "rgba(255, 255, 255, 0.05)",
              border: isOpen
                ? "1px solid rgba(0, 255, 157, 0.3)"
                : "1px solid rgba(255, 255, 255, 0.1)",
              color: isOpen ? "var(--primary-color)" : "var(--text-primary)",
              transition: "all 0.3s ease",
            }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className="mobile-menu"
          style={{
            position: "absolute",
            top: "100%",
            left: "1rem",
            right: "1rem",
            marginTop: "0.5rem",
            padding: isOpen ? "1rem" : "0",
            maxHeight: isOpen ? "500px" : "0",
            opacity: isOpen ? 1 : 0,
            overflow: "hidden",
            background: "rgba(10, 10, 10, 0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "16px",
            border: isOpen ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
            boxShadow: isOpen ? "0 20px 40px rgba(0, 0, 0, 0.5)" : "none",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {navLinks.map((link, index) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color:
                  activeSection === link.id
                    ? "var(--primary-color)"
                    : "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
                fontSize: "1rem",
                fontWeight: activeSection === link.id ? "600" : "500",
                padding: "1rem 1.25rem",
                background:
                  activeSection === link.id
                    ? "rgba(0, 255, 157, 0.08)"
                    : "transparent",
                borderRadius: "12px",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: isOpen ? "translateX(0)" : "translateX(-20px)",
                opacity: isOpen ? 1 : 0,
                transitionDelay: `${index * 0.05}s`,
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                {activeSection === link.id && (
                  <span
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "var(--primary-color)",
                      boxShadow: "0 0 10px var(--primary-color)",
                    }}
                  />
                )}
                {link.name}
              </span>
              <ChevronRight
                size={16}
                style={{
                  opacity: activeSection === link.id ? 1 : 0.3,
                  transition: "all 0.3s ease",
                }}
              />
            </button>
          ))}

          {/* Mobile Login Button */}
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
              padding: "1rem",
              background:
                "linear-gradient(135deg, var(--primary-color), #00d485)",
              color: "var(--bg-color)",
              fontFamily: "var(--font-mono)",
              fontWeight: "600",
              fontSize: "1rem",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              transform: isOpen ? "translateX(0)" : "translateX(-20px)",
              opacity: isOpen ? 1 : 0,
              transitionDelay: `${navLinks.length * 0.05}s`,
            }}
          >
            Login
            <ChevronRight size={18} />
          </Link>
        </div>
      </nav>

      <style>{`
                @media (min-width: 768px) {
                    .desktop-menu {
                        display: flex !important;
                    }
                    .mobile-toggle {
                        display: none !important;
                    }
                    .mobile-menu {
                        display: none !important;
                    }
                }

                .nav-link:hover {
                    color: var(--primary-color) !important;
                    background: rgba(0, 255, 157, 0.08) !important;
                }

                .navbar-logo:hover > div:first-child {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 20px rgba(0, 255, 157, 0.3);
                    transform: scale(1.05);
                }

                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(0, 255, 157, 0.4) !important;
                }

                .mobile-toggle:hover {
                    background: rgba(0, 255, 157, 0.1) !important;
                    border-color: rgba(0, 255, 157, 0.3) !important;
                }

                .mobile-menu button:hover {
                    background: rgba(0, 255, 157, 0.08) !important;
                    color: var(--primary-color) !important;
                }

                /* Smooth entrance animation */
                @keyframes navFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .navbar-container {
                    animation: navFadeIn 0.5s ease forwards;
                }
            `}</style>
    </>
  );
};

export default Navbar;
