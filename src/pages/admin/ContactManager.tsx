import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { supabase } from "../../lib/supabase";
import {
  Mail,
  Phone,
  MapPin,
  Save,
  Inbox,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const ContactManager: React.FC = () => {
  const { about, updateAbout, refreshData } = useData();
  const [contactData, setContactData] = useState(about.contact);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"info" | "messages">("messages");

  // Sync local state when context changes
  useEffect(() => {
    setContactData(about.contact);
  }, [about]);

  // Fetch messages
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }
    setMessages(data || []);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");

    try {
      await updateAbout({ ...about, contact: contactData });
      await refreshData();
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("Error saving:", err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Delete this message?")) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (!error) {
      setMessages(messages.filter((m) => m.id !== id));
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

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
        <h1 style={{ fontSize: "2rem" }}>Contact Management</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => setActiveTab("messages")}
          style={{
            padding: "0.75rem 1.5rem",
            background:
              activeTab === "messages"
                ? "var(--primary-color)"
                : "rgba(255,255,255,0.05)",
            color: activeTab === "messages" ? "#000" : "var(--text-secondary)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Inbox size={18} /> Messages
          {unreadCount > 0 && (
            <span
              style={{
                background:
                  activeTab === "messages" ? "#000" : "var(--primary-color)",
                color:
                  activeTab === "messages" ? "var(--primary-color)" : "#000",
                padding: "0.1rem 0.5rem",
                borderRadius: "10px",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("info")}
          style={{
            padding: "0.75rem 1.5rem",
            background:
              activeTab === "info"
                ? "var(--primary-color)"
                : "rgba(255,255,255,0.05)",
            color: activeTab === "info" ? "#000" : "var(--text-secondary)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Mail size={18} /> Contact Info
        </button>
      </div>

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {messages.length === 0 ? (
            <div
              className="glass-panel"
              style={{ padding: "3rem", textAlign: "center" }}
            >
              <Inbox size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
              <p style={{ color: "var(--text-secondary)" }}>No messages yet</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="glass-panel"
                style={{
                  padding: "1.5rem",
                  borderLeft: msg.is_read
                    ? "3px solid var(--border-color)"
                    : "3px solid var(--primary-color)",
                  opacity: msg.is_read ? 0.7 : 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {msg.name}
                    </div>
                    <div
                      style={{
                        color: "var(--secondary-color)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {msg.email}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                    {!msg.is_read && (
                      <span
                        style={{
                          background: "var(--primary-color)",
                          color: "#000",
                          padding: "0.1rem 0.5rem",
                          borderRadius: "10px",
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                </div>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  {msg.message}
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {!msg.is_read && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "6px",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Eye size={14} /> Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "rgba(255, 59, 48, 0.1)",
                      border: "1px solid rgba(255, 59, 48, 0.3)",
                      borderRadius: "6px",
                      color: "var(--error-color)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Contact Info Tab */}
      {activeTab === "info" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            {status === "success" && (
              <span
                style={{
                  color: "var(--primary-color)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginRight: "1rem",
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
                  marginRight: "1rem",
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

          <div
            className="glass-panel"
            style={{ padding: "2rem", maxWidth: "600px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    background: "rgba(0, 255, 157, 0.1)",
                    padding: "0.75rem",
                    borderRadius: "50%",
                    color: "var(--primary-color)",
                  }}
                >
                  <Mail size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={contactData.email}
                    onChange={handleChange}
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    background: "rgba(0, 184, 255, 0.1)",
                    padding: "0.75rem",
                    borderRadius: "50%",
                    color: "var(--secondary-color)",
                  }}
                >
                  <Phone size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={contactData.phone}
                    onChange={handleChange}
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    background: "rgba(255, 189, 46, 0.1)",
                    padding: "0.75rem",
                    borderRadius: "50%",
                    color: "var(--accent-color)",
                  }}
                >
                  <MapPin size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={contactData.location}
                    onChange={handleChange}
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
        </div>
      )}
    </div>
  );
};

export default ContactManager;
