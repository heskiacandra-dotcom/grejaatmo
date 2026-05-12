"use client";
// src/components/sections/AnnouncementBanner.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Bell } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  priority: string;
}

export function AnnouncementBanner() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [active, setActive] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch("/api/announcements?active=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setActive(data.data);
        }
      })
      .catch(() => {}); // silently fail — no announcements shown
  }, []);

  useEffect(() => {
    if (active.length <= 1) return;
    const interval = setInterval(() => {
      if (tickerRef.current) {
        gsap.to(tickerRef.current, {
          opacity: 0,
          y: -8,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setCurrentIdx((prev) => (prev + 1) % active.length);
            gsap.fromTo(
              tickerRef.current,
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            );
          },
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [active.length]);

  if (active.length === 0) return null;

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #A07830, #C9A84C, #A07830)",
        padding: "0.65rem 0",
        overflow: "hidden",
      }}
    >
      <div className="container-main">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <Bell size={13} style={{ color: "#1A1614" }} />
            <span
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#1A1614",
                whiteSpace: "nowrap",
              }}
            >
              Pengumuman
            </span>
          </div>
          <div style={{ width: "1px", height: "16px", background: "rgba(26,22,20,0.2)" }} />
          <div ref={tickerRef} style={{ flex: 1, overflow: "hidden" }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.8rem",
                color: "#1A1614",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {active[currentIdx]?.title}
            </p>
          </div>
          {active.length > 1 && (
            <div style={{ display: "flex", gap: "0.3rem", flexShrink: 0 }}>
              {active.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: i === currentIdx ? "#1A1614" : "rgba(26,22,20,0.3)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
