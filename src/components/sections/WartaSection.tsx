"use client";
// src/components/sections/WartaSection.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FileText, Download, Calendar, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface WartaItem {
  id: number;
  title: string;
  editionDate: string;
  fileUrl: string;
  description?: string;
}

export function WartaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [wartas, setWartas] = useState<WartaItem[]>([]);

  useEffect(() => {
    fetch("/api/warta")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setWartas(data.data.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".warta-reveal",
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="section-base" style={{ background: "#FDFAF4" }}>
      <div className="container-main">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
            alignItems: "start",
          }}
        >
          {/* Left: Info */}
          <div className="warta-reveal">
            <div className="section-label" style={{ marginBottom: "1.25rem" }}>Warta Paroki</div>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
                fontWeight: 700,
                color: "#1A1614",
                lineHeight: 1.2,
                marginBottom: "1.25rem",
              }}
            >
              Informasi Minggu{" "}
              <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Ini</span>
            </h2>
            <div className="divider-gold-left" style={{ marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "#8B7355", lineHeight: 1.8, marginBottom: "2rem" }}>
              Warta Paroki diterbitkan setiap minggu berisi informasi jadwal misa, kegiatan paroki, pengumuman komunitas, dan renungan mingguan untuk seluruh umat.
            </p>

            <div
              style={{
                background: "linear-gradient(135deg, #F5F0E4, #EDE8D8)",
                borderLeft: "3px solid #C9A84C",
                padding: "1.5rem",
                borderRadius: "0 0.75rem 0.75rem 0",
                marginBottom: "2rem",
              }}
            >
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", fontStyle: "italic", color: "#5C3D2E", lineHeight: 1.6 }}>
                &ldquo;Firman-Mu adalah pelita bagi kakiku dan terang bagi jalanku.&rdquo;
              </p>
              <p style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: "#C9A84C", marginTop: "0.75rem", textTransform: "uppercase" }}>
                — Mazmur 119:105
              </p>
            </div>

            <Link href="/warta" className="btn-gold">Arsip Warta Paroki</Link>
          </div>

          {/* Right: Warta list */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {wartas.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", background: "#F5F0E4", borderRadius: "0.75rem", border: "1px solid #E2D8C0" }}>
                  <FileText size={32} style={{ color: "#C9A84C", margin: "0 auto 0.75rem" }} />
                  <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", color: "#8B7355" }}>
                    Belum ada warta yang tersedia
                  </p>
                </div>
              ) : (
                wartas.map((item, i) => (
                  <div key={item.id} className="warta-reveal">
                    <div className="warta-card">
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "0.75rem",
                          background: i === 0 ? "rgba(201,168,76,0.15)" : "#F5F0E4",
                          border: `1px solid ${i === 0 ? "rgba(201,168,76,0.3)" : "#E2D8C0"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={20} style={{ color: i === 0 ? "#C9A84C" : "#B09878" }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                          {i === 0 && (
                            <span
                              style={{
                                background: "#C9A84C",
                                color: "#1A1614",
                                fontFamily: "Cinzel, serif",
                                fontSize: "0.55rem",
                                letterSpacing: "0.1em",
                                padding: "0.15rem 0.5rem",
                                borderRadius: "999px",
                                textTransform: "uppercase",
                                fontWeight: 600,
                              }}
                            >
                              Terbaru
                            </span>
                          )}
                        </div>
                        <h4
                          style={{
                            fontFamily: "Playfair Display, serif",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            color: "#1A1614",
                            marginBottom: "0.35rem",
                            lineHeight: 1.3,
                          }}
                        >
                          {item.title}
                        </h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <Calendar size={12} style={{ color: "#B09878" }} />
                          <span style={{ fontSize: "0.75rem", color: "#B09878" }}>
                            {formatDate(item.editionDate)}
                          </span>
                        </div>
                      </div>

                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "0.5rem",
                          background: "#F5F0E4",
                          border: "1px solid #E2D8C0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#8B7355",
                          flexShrink: 0,
                          textDecoration: "none",
                        }}
                        title="Unduh Warta"
                      >
                        <Download size={15} />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="warta-reveal" style={{ marginTop: "1.5rem" }}>
              <Link
                href="/warta"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#A07830",
                  textDecoration: "none",
                }}
              >
                Lihat Semua Warta <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
