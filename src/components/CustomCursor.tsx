import React, { useEffect, useState } from "react";

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailingPosition, setTrailingPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updatePosition);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    // Check for hoverable elements
    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    const hoverables = document.querySelectorAll(
      "a, button, input, textarea, .hoverable"
    );
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    // Mutation observer to attach listeners to new elements
    const observer = new MutationObserver(() => {
      const newHoverables = document.querySelectorAll(
        "a, button, input, textarea, .hoverable"
      );
      newHoverables.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const animateTrailing = () => {
      setTrailingPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15, // Smooth lag
          y: prev.y + dy * 0.15,
        };
      });
      animationFrameId = requestAnimationFrame(animateTrailing);
    };

    animateTrailing();
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main Dot */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          backgroundColor: "var(--primary-color)",
          borderRadius: "50%",
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          pointerEvents: "none",
          zIndex: 99999,
          transition: "transform 0.1s ease",
          mixBlendMode: "difference",
        }}
      />

      {/* Trailing Ring */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "40px" : "24px",
          height: isHovering ? "40px" : "24px",
          border: "1px solid var(--primary-color)",
          borderRadius: "50%",
          transform: `translate(${
            trailingPosition.x - (isHovering ? 20 : 12)
          }px, ${trailingPosition.y - (isHovering ? 20 : 12)}px)`,
          pointerEvents: "none",
          zIndex: 99998,
          transition: "width 0.3s, height 0.3s, background-color 0.3s",
          backgroundColor: isHovering
            ? "rgba(0, 255, 157, 0.1)"
            : "transparent",
          boxShadow: isHovering ? "0 0 15px var(--primary-color)" : "none",
        }}
      />
    </>
  );
};

export default CustomCursor;
