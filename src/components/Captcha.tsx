import React, { useState, useEffect, useCallback, useRef } from "react";
import { ShieldCheck, RefreshCw, CheckCircle, Bot } from "lucide-react";

// Generate random captcha text
const generateCaptchaText = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Draw captcha on canvas with distortion
const drawCaptcha = (canvas: HTMLCanvasElement, text: string) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = "rgba(10, 10, 10, 0.9)";
  ctx.fillRect(0, 0, width, height);

  // Noise lines
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = `rgba(${Math.random() * 100 + 50}, ${
      Math.random() * 100 + 50
    }, ${Math.random() * 100 + 50}, 0.5)`;
    ctx.lineWidth = Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.bezierCurveTo(
      Math.random() * width,
      Math.random() * height,
      Math.random() * width,
      Math.random() * height,
      Math.random() * width,
      Math.random() * height
    );
    ctx.stroke();
  }

  // Noise dots
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    }, 0.3)`;
    ctx.beginPath();
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Draw text
  const colors = ["#00ff9d", "#00b8ff", "#ffbd2e", "#ff6b6b", "#a855f7"];
  const fontSize = 28;
  ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
  ctx.textBaseline = "middle";

  const startX = 15;
  const charWidth = (width - 30) / text.length;

  for (let i = 0; i < text.length; i++) {
    ctx.save();
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    const rotation = (Math.random() - 0.5) * 0.5;
    const x = startX + i * charWidth + charWidth / 2;
    const y = height / 2 + (Math.random() - 0.5) * 10;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text[i], -fontSize / 4, 0);
    ctx.restore();
  }

  // Top lines
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * height);
    ctx.lineTo(width, Math.random() * height);
    ctx.stroke();
  }
};

interface CaptchaProps {
  onVerified: (verified: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerified }) => {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaText, setCaptchaText] = useState(generateCaptchaText());
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const refreshCaptcha = useCallback(() => {
    const newText = generateCaptchaText();
    setCaptchaText(newText);
    setCaptchaInput("");
    setCaptchaVerified(false);
    onVerified(false);
  }, [onVerified]);

  // Draw captcha
  useEffect(() => {
    if (canvasRef.current && showCaptcha) {
      drawCaptcha(canvasRef.current, captchaText);
    }
  }, [captchaText, showCaptcha]);

  // Verify captcha
  useEffect(() => {
    const verified = captchaInput.toUpperCase() === captchaText;
    setCaptchaVerified(verified);
    onVerified(verified);
  }, [captchaInput, captchaText, onVerified]);

  const handleCheckboxChange = () => {
    if (!isChecked) {
      setIsChecked(true);
      setShowCaptcha(true);
      refreshCaptcha();
    }
  };

  const resetCaptcha = () => {
    setIsChecked(false);
    setShowCaptcha(false);
    setCaptchaInput("");
    setCaptchaVerified(false);
    onVerified(false);
  };

  return (
    <div className={`captcha-wrapper ${captchaVerified ? "verified" : ""}`}>
      {/* Checkbox - Saya bukan robot */}
      {!showCaptcha && !captchaVerified && (
        <div className="robot-check" onClick={handleCheckboxChange}>
          <div className={`checkbox ${isChecked ? "checked" : ""}`}>
            {isChecked && <CheckCircle size={16} />}
          </div>
          <span>Saya bukan robot</span>
          <Bot size={20} className="robot-icon" />
        </div>
      )}

      {/* Captcha Challenge */}
      {showCaptcha && !captchaVerified && (
        <div className="captcha-challenge">
          <div className="captcha-header">
            <ShieldCheck size={18} />
            <span>Verifikasi Keamanan</span>
          </div>

          <div className="captcha-body">
            <div className="captcha-canvas-row">
              <canvas
                ref={canvasRef}
                width={200}
                height={60}
                className="captcha-canvas"
              />
              <button
                type="button"
                onClick={refreshCaptcha}
                className="refresh-btn"
                title="Ganti kode"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            <div className="captcha-input-row">
              <label>Ketik kode di atas:</label>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                maxLength={6}
                className={`captcha-input ${
                  captchaInput.length === 6 && !captchaVerified
                    ? "incorrect"
                    : ""
                }`}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Verified State */}
      {captchaVerified && (
        <div className="captcha-verified" onClick={resetCaptcha}>
          <div className="verified-checkbox">
            <CheckCircle size={20} />
          </div>
          <div className="verified-text">
            <span className="verified-title">Terverifikasi</span>
            <span className="verified-desc">Anda bukan robot</span>
          </div>
          <ShieldCheck size={24} className="shield-icon" />
        </div>
      )}

      <style>{`
        .captcha-wrapper {
          border-radius: 12px;
          background: rgba(0, 184, 255, 0.05);
          border: 2px solid rgba(0, 184, 255, 0.2);
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .captcha-wrapper.verified {
          background: rgba(0, 255, 157, 0.05);
          border-color: rgba(0, 255, 157, 0.3);
        }
        
        /* Robot Check */
        .robot-check {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .robot-check:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        .checkbox {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: var(--primary-color);
        }
        .robot-check:hover .checkbox {
          border-color: var(--secondary-color);
        }
        .checkbox.checked {
          background: var(--primary-color);
          border-color: var(--primary-color);
        }
        .robot-check span {
          flex: 1;
          font-family: var(--font-mono);
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .robot-icon {
          color: var(--text-secondary);
          opacity: 0.5;
        }
        
        /* Captcha Challenge */
        .captcha-challenge {
          padding: 1.25rem;
          animation: slideDown 0.3s ease;
        }
        .captcha-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: var(--secondary-color);
          font-family: var(--font-mono);
        }
        .captcha-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .captcha-canvas-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .captcha-canvas {
          border-radius: 8px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.3);
        }
        .refresh-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .refresh-btn:hover {
          background: rgba(0, 184, 255, 0.1);
          border-color: var(--secondary-color);
          color: var(--secondary-color);
          transform: rotate(180deg);
        }
        .captcha-input-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .captcha-input-row label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-family: var(--font-mono);
        }
        .captcha-input {
          width: 100%;
          max-width: 200px;
          padding: 0.75rem 1rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          outline: none;
        }
        .captcha-input:focus {
          border-color: var(--secondary-color);
          box-shadow: 0 0 15px rgba(0, 184, 255, 0.2);
        }
        .captcha-input.incorrect {
          border-color: rgba(255, 100, 100, 0.5);
          animation: shake 0.3s ease;
        }
        .captcha-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
          letter-spacing: 2px;
        }
        
        /* Verified State */
        .captcha-verified {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          animation: fadeIn 0.3s ease;
        }
        .captcha-verified:hover {
          background: rgba(0, 255, 157, 0.05);
        }
        .verified-checkbox {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--bg-color);
        }
        .verified-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .verified-title {
          font-family: var(--font-mono);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--primary-color);
        }
        .verified-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .shield-icon {
          color: var(--primary-color);
          opacity: 0.7;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default Captcha;
