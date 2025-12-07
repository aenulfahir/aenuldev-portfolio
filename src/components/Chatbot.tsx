import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader,
  ChevronRight,
  Briefcase,
  HelpCircle,
  DollarSign,
  Mail,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface UserInfo {
  name: string;
  reason: string;
}

type ChatStage = "greeting" | "askName" | "askReason" | "chatting";

const WEBSITE_CONTEXT = `
You are AenulBot, a friendly and professional AI assistant for AenulDev's portfolio website.

About AenulDev (Muhammad Aenul Fahir):
- Professional Full Stack Developer & Mobile Developer
- Specializes in React, TypeScript, Node.js, React Native, and modern web technologies
- Creates high-performance web and mobile applications
- Based in Indonesia

Services Offered:
1. Landing Page (Rp 500K) - Single page website, responsive design, basic SEO, 3 revisions
2. Company Profile (Rp 1.5M) - Multi-page website, CMS integration, contact form, 5 revisions
3. Custom Web App (Rp 3M+) - Full-stack application, database integration, API development, unlimited revisions

Key Features:
- Modern, futuristic design aesthetic
- Focus on performance and user experience
- Clean, maintainable code
- Responsive across all devices

How to Order:
1. Visit the Pricing page
2. Choose a package
3. Fill out the order form with project details
4. Wait for confirmation via WhatsApp/Email

Contact:
- Use the Contact form on the website
- Response within 24 hours

Your personality:
- Friendly and helpful
- Professional but approachable
- Knowledgeable about web development
- Enthusiastic about technology
- Always provide clear, concise answers
- If asked about something outside your knowledge, politely redirect to the contact form

Remember to:
- Address users by their name when known
- Be concise but informative
- Suggest relevant services when appropriate
- Encourage users to explore the portfolio
- Offer to help with any questions about services
`;

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [stage, setStage] = useState<ChatStage>("greeting");
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, stage]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowPulse(false);
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage(
          "assistant",
          "👋 Halo! Selamat datang di AenulDev!\n\nSaya AenulBot, asisten virtual yang siap membantu kamu.\n\nSebelum kita mulai, boleh saya tahu nama kamu?"
        );
        setStage("askName");
      }, 500);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const reasonOptions = [
    {
      id: "services",
      label: "Tanya Layanan & Harga",
      icon: <DollarSign size={16} />,
    },
    {
      id: "portfolio",
      label: "Lihat Portfolio",
      icon: <Briefcase size={16} />,
    },
    {
      id: "consultation",
      label: "Konsultasi Project",
      icon: <HelpCircle size={16} />,
    },
    { id: "other", label: "Lainnya", icon: <Mail size={16} /> },
  ];

  const handleReasonSelect = async (reason: string) => {
    const reasonLabel =
      reasonOptions.find((r) => r.id === reason)?.label || reason;
    setUserInfo((prev) => (prev ? { ...prev, reason: reasonLabel } : null));
    addMessage("user", reasonLabel);
    setStage("chatting");

    // Generate contextual welcome based on reason
    let welcomeMessage = "";
    switch (reason) {
      case "services":
        welcomeMessage = `Baik ${userInfo?.name}! 🎯\n\nSaya bisa bantu jelaskan layanan yang tersedia:\n\n💼 **Landing Page** - Rp 500K\n🏢 **Company Profile** - Rp 1.5M\n🚀 **Custom Web App** - Rp 3M+\n\nMau tahu detail paket yang mana?`;
        break;
      case "portfolio":
        welcomeMessage = `Oke ${userInfo?.name}! 🎨\n\nAenulDev sudah mengerjakan berbagai project menarik, mulai dari web apps hingga mobile apps.\n\nKamu bisa lihat langsung di halaman Projects, atau tanya saya tentang project tertentu yang kamu minati!`;
        break;
      case "consultation":
        welcomeMessage = `Siap ${userInfo?.name}! 💡\n\nSaya bisa bantu konsultasi awal untuk project kamu.\n\nCeritakan saja ide atau kebutuhan project kamu, nanti saya bantu kasih rekomendasi solusi yang cocok!`;
        break;
      default:
        welcomeMessage = `Baik ${userInfo?.name}! 😊\n\nSilakan tanya apa saja tentang AenulDev, layanan, atau hal lainnya. Saya siap membantu!`;
    }

    setTimeout(() => {
      addMessage("assistant", welcomeMessage);
    }, 500);
  };

  const sendToOpenRouter = async (userMessage: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
      // Fallback response if no API key
      return getFallbackResponse(userMessage);
    }

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "AenulDev Portfolio Chatbot",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct:free",
            messages: [
              {
                role: "system",
                content: `${WEBSITE_CONTEXT}\n\nUser's name: ${
                  userInfo?.name || "Guest"
                }\nUser's reason for chatting: ${
                  userInfo?.reason || "General inquiry"
                }`,
              },
              ...messages
                .filter((m) => m.role !== "system")
                .map((m) => ({
                  role: m.role,
                  content: m.content,
                })),
              { role: "user", content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      return (
        data.choices[0]?.message?.content ||
        "Maaf, saya tidak bisa memproses permintaan saat ini."
      );
    } catch (error) {
      console.error("OpenRouter API error:", error);
      return getFallbackResponse(userMessage);
    }
  };

  const getFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    const name = userInfo?.name || "kamu";

    // Price/Service related
    if (
      lowerMessage.includes("harga") ||
      lowerMessage.includes("price") ||
      lowerMessage.includes("biaya") ||
      lowerMessage.includes("tarif")
    ) {
      return `Hai ${name}! 💰\n\nBerikut daftar harga layanan:\n\n1. **Landing Page** - Rp 500.000\n   • Single page, responsive, basic SEO\n\n2. **Company Profile** - Rp 1.500.000\n   • Multi-page, CMS, contact form\n\n3. **Custom Web App** - Mulai Rp 3.000.000\n   • Full-stack, database, API\n\nMau order atau tanya detail lebih lanjut?`;
    }

    // Contact related
    if (
      lowerMessage.includes("kontak") ||
      lowerMessage.includes("contact") ||
      lowerMessage.includes("hubungi")
    ) {
      return `${name}, kamu bisa menghubungi AenulDev melalui:\n\n📧 Form kontak di website\n📱 WhatsApp (akan dikirim setelah order)\n\nAtau langsung isi form di halaman Contact ya!`;
    }

    // Order related
    if (
      lowerMessage.includes("order") ||
      lowerMessage.includes("pesan") ||
      lowerMessage.includes("beli")
    ) {
      return `Untuk order, ${name} bisa:\n\n1. Buka halaman **Pricing**\n2. Pilih paket yang sesuai\n3. Klik tombol "Order Now"\n4. Isi form dengan detail project\n5. Tunggu konfirmasi via WhatsApp/Email\n\nMudah kan? 😊`;
    }

    // Portfolio related
    if (
      lowerMessage.includes("portfolio") ||
      lowerMessage.includes("project") ||
      lowerMessage.includes("karya")
    ) {
      return `${name} bisa lihat portfolio lengkap di halaman **Projects**! 🎨\n\nAda berbagai project web dan mobile yang sudah dikerjakan. Klik salah satu untuk lihat detail teknologi yang digunakan.`;
    }

    // About related
    if (
      lowerMessage.includes("siapa") ||
      lowerMessage.includes("about") ||
      lowerMessage.includes("tentang")
    ) {
      return `AenulDev adalah Muhammad Aenul Fahir, seorang Full Stack Developer & Mobile Developer dari Indonesia! 🇮🇩\n\nSpesialisasi:\n• React & TypeScript\n• Node.js & Express\n• React Native\n• Modern Web Technologies\n\nFokus pada performa dan user experience yang optimal!`;
    }

    // Greeting
    if (
      lowerMessage.includes("halo") ||
      lowerMessage.includes("hai") ||
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi")
    ) {
      return `Hai juga ${name}! 👋\n\nAda yang bisa saya bantu hari ini? Mau tanya tentang layanan, portfolio, atau hal lainnya?`;
    }

    // Thank you
    if (
      lowerMessage.includes("terima kasih") ||
      lowerMessage.includes("thanks") ||
      lowerMessage.includes("makasih")
    ) {
      return `Sama-sama ${name}! 😊\n\nSenang bisa membantu. Kalau ada pertanyaan lain, jangan ragu untuk tanya ya!`;
    }

    // Default response
    return `Terima kasih ${name} untuk pertanyaannya! 🤔\n\nUntuk informasi lebih detail, saya sarankan:\n\n• Cek halaman **Pricing** untuk layanan\n• Lihat **Projects** untuk portfolio\n• Gunakan **Contact** form untuk pertanyaan spesifik\n\nAtau tanya saya hal lain yang lebih spesifik!`;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    if (stage === "askName") {
      setUserInfo({ name: userMessage, reason: "" });
      addMessage("user", userMessage);

      setTimeout(() => {
        addMessage(
          "assistant",
          `Senang berkenalan, **${userMessage}**! ✨\n\nApa yang membawa kamu ke sini hari ini?`
        );
        setStage("askReason");
      }, 500);
      return;
    }

    addMessage("user", userMessage);
    setIsLoading(true);

    try {
      const response = await sendToOpenRouter(userMessage);
      addMessage("assistant", response);
    } catch (error) {
      addMessage(
        "assistant",
        "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi melalui form kontak."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={handleOpen}
        className="chatbot-button"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
          border: "none",
          cursor: "pointer",
          display: isOpen ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0, 255, 157, 0.4)",
          transition: "all 0.3s ease",
          zIndex: 9998,
        }}
        title="Chat with AenulBot"
      >
        <MessageCircle size={28} color="#000" />
        {showPulse && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              width: "20px",
              height: "20px",
              background: "var(--accent-color)",
              borderRadius: "50%",
              animation: "pulse 2s infinite",
            }}
          />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="chatbot-window"
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            width: "380px",
            maxWidth: "calc(100vw - 2rem)",
            height: "600px",
            maxHeight: "calc(100vh - 4rem)",
            background: "rgba(10, 10, 20, 0.98)",
            borderRadius: "20px",
            border: "1px solid rgba(0, 255, 157, 0.3)",
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 157, 0.1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
            animation: "slideUp 0.3s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1rem 1.25rem",
              background:
                "linear-gradient(135deg, rgba(0, 255, 157, 0.1), rgba(0, 184, 255, 0.1))",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bot size={24} color="#000" />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  AenulBot <Sparkles size={14} color="var(--accent-color)" />
                </div>
                <div
                  style={{ fontSize: "0.75rem", color: "var(--primary-color)" }}
                >
                  ● Online
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem",
                cursor: "pointer",
                color: "var(--text-secondary)",
                transition: "all 0.2s",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent:
                    message.role === "user" ? "flex-end" : "flex-start",
                  gap: "0.5rem",
                }}
              >
                {message.role === "assistant" && (
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      background:
                        "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={16} color="#000" />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "0.75rem 1rem",
                    borderRadius:
                      message.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    background:
                      message.role === "user"
                        ? "linear-gradient(135deg, var(--primary-color), var(--secondary-color))"
                        : "rgba(255, 255, 255, 0.05)",
                    color:
                      message.role === "user" ? "#000" : "var(--text-primary)",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                    border:
                      message.role === "assistant"
                        ? "1px solid rgba(255, 255, 255, 0.1)"
                        : "none",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(message.content),
                  }}
                />
                {message.role === "user" && (
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {/* Reason Selection */}
            {stage === "askReason" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                {reasonOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleReasonSelect(option.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(0, 255, 157, 0.1)";
                      e.currentTarget.style.borderColor =
                        "var(--primary-color)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.1)";
                    }}
                  >
                    <span style={{ color: "var(--primary-color)" }}>
                      {option.icon}
                    </span>
                    <span style={{ flex: 1 }}>{option.label}</span>
                    <ChevronRight size={16} color="var(--text-secondary)" />
                  </button>
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background:
                      "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={16} color="#000" />
                </div>
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "16px 16px 16px 4px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Loader
                    size={16}
                    className="spin"
                    color="var(--primary-color)"
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {(stage === "askName" || stage === "chatting") && (
            <div
              style={{
                padding: "1rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    stage === "askName"
                      ? "Ketik nama kamu..."
                      : "Ketik pesan..."
                  }
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "0.75rem 1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary-color)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: inputValue.trim()
                      ? "linear-gradient(135deg, var(--primary-color), var(--secondary-color))"
                      : "rgba(255, 255, 255, 0.05)",
                    border: "none",
                    cursor: inputValue.trim() ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <Send
                    size={18}
                    color={inputValue.trim() ? "#000" : "var(--text-secondary)"}
                  />
                </button>
              </div>
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                  textAlign: "center",
                }}
              >
                Powered by AenulBot AI ✨
              </div>
            </div>
          )}
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .chatbot-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 30px rgba(0, 255, 157, 0.5);
        }

        .chatbot-window::-webkit-scrollbar {
          width: 6px;
        }

        .chatbot-window::-webkit-scrollbar-track {
          background: transparent;
        }

        .chatbot-window::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        @media (max-width: 480px) {
          .chatbot-window {
            bottom: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
          }

          .chatbot-button {
            bottom: 1rem !important;
            right: 1rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
