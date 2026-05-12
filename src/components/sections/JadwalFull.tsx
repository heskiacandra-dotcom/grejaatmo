"use client";
// src/components/sections/JadwalFull.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, MapPin, User, Info } from "lucide-react";
import { mockLiturgiColors } from "@/lib/mock-data";

interface Schedule {
  id: number;
  dayOfWeek: string;
  time: string;
  location: string;
  celebrant?: string | null;
  notes?: string | null;
  isActive: boolean;
}

gsap.registerPlugin(ScrollTrigger);

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const DAY_LABELS: Record<string, string> = {
  Senin: "Sen",
  Selasa: "Sel",
  Rabu: "Rab",
  Kamis: "Kam",
  Jumat: "Jum",
  Sabtu: "Sab",
  Minggu: "Min",
};

export function JadwalFull() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    fetch("/api/schedules")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSchedules(data.data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".day-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  const todayIdx = new Date().getDay();
  const todayName = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];

  const grouped = DAYS.map((day) => ({
    day,
    schedules: schedules.filter((s) => s.dayOfWeek === day && s.isActive),
    isToday: day === todayName,
  }));

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="container-main" style={{ textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center", color: "rgba(201,168,76,0.8)", marginBottom: "1.25rem" }}>
            <span style={{ background: "rgba(201,168,76,0.5)" }} />
            Liturgi & Sakramen
          </div>
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#FDFAF4",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Jadwal{" "}
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Perayaan Misa</span>
          </h1>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: "1.1rem",
              color: "rgba(253,250,244,0.55)",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            &ldquo;Inilah cawan perjanjian baru dan yang kekal dalam darah-Ku, yang ditumpahkan bagimu.&rdquo;
          </p>
        </div>
      </div>

      {/* Content */}
      <div ref={sectionRef} style={{ background: "#F5F0E4", paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div className="container-main">
          {/* Location info banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #1A1614, #2C2420)",
              borderRadius: "1rem",
              padding: "1.5rem 2rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              alignItems: "center",
              marginBottom: "3rem",
              border: "1px solid rgba(201,168,76,0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <MapPin size={18} style={{ color: "#C9A84C" }} />
              <div>
                <p style={{ fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase", marginBottom: "0.2rem" }}>Lokasi</p>
                <p style={{ fontSize: "0.9rem", color: "#FDFAF4" }}>Jl. Atmodirono, Wonodri, Semarang Selatan</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Info size={18} style={{ color: "#C9A84C" }} />
              <div>
                <p style={{ fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(201,168,76,0.7)", textTransform: "uppercase", marginBottom: "0.2rem" }}>Catatan</p>
                <p style={{ fontSize: "0.9rem", color: "#FDFAF4" }}>Jadwal dapat berubah pada hari raya & liturgi khusus</p>
              </div>
            </div>
          </div>

          {/* Day cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
              marginBottom: "4rem",
            }}
          >
            {grouped.map(({ day, schedules, isToday }) => (
              <div
                key={day}
                className="day-card schedule-card"
                style={{
                  background: isToday
                    ? "linear-gradient(135deg, #1A1614, #2C2420)"
                    : "#FFFFFF",
                  border: `1px solid ${isToday ? "rgba(201,168,76,0.4)" : "#E2D8C0"}`,
                  position: "relative",
                }}
              >
                {/* Day label */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "Cinzel, serif",
                      fontSize: "0.9rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: isToday ? "#C9A84C" : "#1A1614",
                      fontWeight: 600,
                    }}
                  >
                    {day}
                  </h2>
                  {isToday && (
                    <span
                      style={{
                        background: "#C9A84C",
                        color: "#1A1614",
                        fontFamily: "Cinzel, serif",
                        fontSize: "0.5rem",
                        letterSpacing: "0.15em",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "999px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      Hari Ini
                    </span>
                  )}
                </div>

                {schedules.length === 0 ? (
                  <p style={{ fontSize: "0.85rem", color: isToday ? "rgba(253,250,244,0.4)" : "#B09878", fontStyle: "italic" }}>
                    Tidak ada misa terjadwal
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {schedules.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          paddingLeft: "1rem",
                          borderLeft: `2px solid ${isToday ? "rgba(201,168,76,0.4)" : "#E2D8C0"}`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                          <Clock size={13} style={{ color: "#C9A84C" }} />
                          <span
                            style={{
                              fontFamily: "Cinzel, serif",
                              fontSize: "1.15rem",
                              fontWeight: 700,
                              color: isToday ? "#FDFAF4" : "#1A1614",
                            }}
                          >
                            {s.time} WIB
                          </span>
                        </div>
                        {s.celebrant && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <User size={11} style={{ color: isToday ? "rgba(253,250,244,0.4)" : "#B09878" }} />
                            <span style={{ fontSize: "0.75rem", color: isToday ? "rgba(253,250,244,0.55)" : "#8B7355" }}>
                              {s.celebrant}
                            </span>
                          </div>
                        )}
                        {s.notes && (
                          <p style={{ fontSize: "0.72rem", color: isToday ? "rgba(253,250,244,0.4)" : "#B09878", marginTop: "0.2rem", fontStyle: "italic" }}>
                            {s.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Liturgi Colors reference */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "1rem",
              border: "1px solid #E2D8C0",
              padding: "2rem",
            }}
          >
            <h3
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.3rem",
                color: "#1A1614",
                marginBottom: "0.5rem",
              }}
            >
              Warna Liturgi
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#8B7355", marginBottom: "1.5rem", fontStyle: "italic" }}>
              Panduan warna liturgi dalam kalender gereja Katolik
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {Object.entries(mockLiturgiColors).map(([key, value]) => {
                const colorMap: Record<string, string> = {
                  putih: "#F5F0E4",
                  merah: "#C0392B",
                  hijau: "#27AE60",
                  ungu: "#8E44AD",
                  merahJambu: "#E91E8C",
                  hitam: "#2C3E50",
                };
                return (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      background: "#F5F0E4",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: colorMap[key] || "#ccc",
                        border: "1px solid #E2D8C0",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    <p style={{ fontSize: "0.8rem", color: "#5C3D2E", lineHeight: 1.5 }}>
                      {value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
