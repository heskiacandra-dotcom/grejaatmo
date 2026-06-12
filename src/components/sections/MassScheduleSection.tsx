"use client";
// src/components/sections/MassScheduleSection.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Clock, MapPin, User, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

interface Schedule {
  id: number;
  dayOfWeek: string;
  time: string;
  location: string;
  celebrant?: string;
  notes?: string;
  isActive: boolean;
}

export function MassScheduleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    fetch("/api/schedules")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSchedules(data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".schedule-reveal",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
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

  // Tampilkan hari yang memiliki jadwal aktif, ATAU hari ini (meskipun kosong)
  const previewDays = grouped.filter(
    (g) => g.schedules.length > 0 || g.isToday
  );

  return (
    <section
      ref={sectionRef}
      className="section-base"
      style={{
        background: "linear-gradient(135deg, #1A1614 0%, #2C2420 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background ornament */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "-150px",
          transform: "translateY(-50%)",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-main" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className="schedule-reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div
            className="section-label"
            style={{
              justifyContent: "center",
              color: "rgba(201,168,76,0.8)",
              marginBottom: "1.25rem",
            }}
          >
            <span style={{ background: "rgba(201,168,76,0.5)" }} />
            Liturgi &amp; Sakramen
          </div>
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              color: "#FDFAF4",
              marginBottom: "1rem",
            }}
          >
            Jadwal{" "}
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Perayaan Misa</span>
          </h2>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.1rem",
              color: "rgba(253,250,244,0.55)",
              fontStyle: "italic",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Bergabunglah bersama kami dalam perayaan Ekaristi suci setiap harinya
          </p>
        </div>

        {/* Quick schedule preview */}
        <div
          className="schedule-reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
            marginBottom: "3rem",
          }}
        >
          {previewDays.map(({ day, schedules: daySchedules, isToday }) => (
            <div
              key={day}
              style={{
                background: isToday ? "rgba(201,168,76,0.1)" : "rgba(253,250,244,0.04)",
                border: `1px solid ${isToday ? "rgba(201,168,76,0.4)" : "rgba(253,250,244,0.08)"}`,
                borderRadius: "1rem",
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {isToday && (
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "#C9A84C",
                    color: "#1A1614",
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.55rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "999px",
                    fontWeight: 600,
                  }}
                >
                  Hari Ini
                </div>
              )}

              <h3
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.8rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: isToday ? "#C9A84C" : "rgba(253,250,244,0.6)",
                  marginBottom: "1.25rem",
                }}
              >
                {day}
              </h3>

              {daySchedules.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: "rgba(253,250,244,0.35)", fontStyle: "italic" }}>
                  Tidak ada misa
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {daySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      style={{ borderLeft: "2px solid rgba(201,168,76,0.3)", paddingLeft: "1rem" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                        <Clock size={13} style={{ color: "#C9A84C" }} />
                        <span
                          style={{
                            fontFamily: "Cinzel, serif",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            color: "#FDFAF4",
                          }}
                        >
                          {schedule.time} WIB
                        </span>
                      </div>
                      {schedule.location && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.15rem" }}>
                          <MapPin size={11} style={{ color: "rgba(201,168,76,0.5)" }} />
                          <span style={{ fontSize: "0.75rem", color: "rgba(253,250,244,0.6)", fontWeight: 500 }}>
                            {schedule.location}
                          </span>
                        </div>
                      )}
                      {schedule.celebrant && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <User size={11} style={{ color: "rgba(253,250,244,0.4)" }} />
                          <span style={{ fontSize: "0.75rem", color: "rgba(253,250,244,0.5)" }}>
                            {schedule.celebrant}
                          </span>
                        </div>
                      )}
                      {schedule.notes && (
                        <p style={{ fontSize: "0.75rem", color: "rgba(253,250,244,0.4)", marginTop: "0.2rem" }}>
                          {schedule.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Location info */}
        <div
          className="schedule-reveal"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "1.5rem",
            background: "rgba(201,168,76,0.06)",
            border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: "0.75rem",
            marginBottom: "2.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <MapPin size={18} style={{ color: "#C9A84C" }} />
            <span style={{ fontSize: "0.9rem", color: "rgba(253,250,244,0.7)", fontFamily: "Inter, sans-serif" }}>
              Jl. Atmodirono, Wonodri, Kec. Semarang Selatan, Kota Semarang
            </span>
          </div>
          <span
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: "0.9rem",
              color: "rgba(201,168,76,0.6)",
            }}
          >
            &ldquo;Datanglah, marilah kita menyembah dan berlutut&rdquo; — Mzm 95:6
          </span>
        </div>

        {/* CTA */}
        <div className="schedule-reveal" style={{ textAlign: "center" }}>
          <Link
            href="/jadwal"
            className="btn-outline"
            style={{ borderColor: "rgba(201,168,76,0.5)", color: "#C9A84C" }}
          >
            Lihat Jadwal Lengkap
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
