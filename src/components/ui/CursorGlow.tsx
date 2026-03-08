"use client";
// src/components/ui/CursorGlow.tsx
import { useEffect, useRef } from "react";

export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;
    let isHovering = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot snaps instantly — sharp, precise
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    };

    const onEnter = () => {
      isHovering = true;
      if (ringRef.current) ringRef.current.style.transform += " scale(1.6)";
    };
    const onLeave = () => {
      isHovering = false;
    };

    // Ring lags slightly — but much tighter than before
    const animate = () => {
      ringX += (mouseX - ringX) * 0.25;
      ringY += (mouseY - ringY) * 0.25;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`;
      }
      raf = requestAnimationFrame(animate);
    };

    const interactives = document.querySelectorAll("a, button, [role='button']");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Outer ring — tight, geometric */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1.5px solid #00FFA8",
          opacity: 0.7,
          transition: "transform 0.08s linear",
        }}
      />
      {/* Center dot — crisp */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#00FFA8",
        }}
      />
    </>
  );
}
