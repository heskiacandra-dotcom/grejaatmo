"use client";
// src/components/sections/WartaList.tsx
import { useEffect, useState } from "react";
import { FileText, Download, Calendar, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface WartaItem {
  id: number;
  title: string;
  editionDate: string;
  fileUrl: string;
  description?: string;
}

export function WartaList({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const [wartaItems, setWartaItems] = useState<WartaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/warta")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWartaItems(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Header */}
      {!hideHeader && (
        <div className="page-header">
        <div className="container-main" style={{ textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center", color: "rgba(201,168,76,0.8)", marginBottom: "1.25rem" }}>
            <span style={{ background: "rgba(201,168,76,0.5)" }} />
            Publikasi Paroki
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
            Warta{" "}
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Paroki</span>
          </h1>
          <p
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: "1.1rem",
              color: "rgba(253,250,244,0.55)",
            }}
          >
            Buletin mingguan untuk seluruh umat Paroki Keluarga Kudus Atmodirono
          </p>
        </div>
        </div>
      )}

      {/* Content */}
      <div style={{ background: "#F5F0E4", paddingTop: hideHeader ? "0" : "4rem", paddingBottom: "5rem" }}>
        <div className="container-main">
          {/* About warta */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "1rem",
              border: "1px solid #E2D8C0",
              padding: "2rem",
              display: "flex",
              gap: "1.5rem",
              alignItems: "flex-start",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "1rem",
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <BookOpen size={24} style={{ color: "#C9A84C" }} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.2rem",
                  color: "#1A1614",
                  marginBottom: "0.5rem",
                }}
              >
                Tentang Warta Paroki
              </h2>
              <p style={{ fontSize: "0.9rem", color: "#8B7355", lineHeight: 1.7 }}>
                Warta Paroki diterbitkan setiap Minggu dan berisi jadwal perayaan Misa, kegiatan komunitas, pengumuman penting, renungan iman, dan informasi pastoral lainnya. Tersedia dalam format PDF untuk diunduh dan dibaca kapan saja.
              </p>
            </div>
          </div>

          {/* Warta grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {loading ? (
              <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", color: "#B09878", fontFamily: "Cinzel, serif", fontSize: "0.9rem" }}>
                Memuat warta...
              </div>
            ) : wartaItems.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", color: "#B09878", fontStyle: "italic", fontSize: "0.9rem" }}>
                Belum ada warta paroki yang diterbitkan.
              </div>
            ) : wartaItems.map((item, i) => (
              <div
                key={item.id}
                className="card"
                style={{ padding: "1.75rem", position: "relative", overflow: "hidden" }}
              >
                {i === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "1.25rem",
                      right: "1.25rem",
                      background: "#C9A84C",
                      color: "#1A1614",
                      fontFamily: "Cinzel, serif",
                      fontSize: "0.55rem",
                      letterSpacing: "0.1em",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "999px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Terbaru
                  </div>
                )}

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
                    marginBottom: "1.25rem",
                  }}
                >
                  <FileText size={22} style={{ color: i === 0 ? "#C9A84C" : "#B09878" }} />
                </div>

                <h3
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#1A1614",
                    lineHeight: 1.4,
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.title}
                </h3>

                {item.description && (
                  <p style={{ fontSize: "0.82rem", color: "#8B7355", lineHeight: 1.6, marginBottom: "1rem" }}>
                    {item.description}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <Calendar size={12} style={{ color: "#C9A84C" }} />
                  <span style={{ fontSize: "0.75rem", color: "#B09878" }}>
                    {formatDate(item.editionDate)}
                  </span>
                </div>

                <a
                  href={item.fileUrl}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 1.25rem",
                    background: i === 0 ? "#C9A84C" : "transparent",
                    color: i === 0 ? "#1A1614" : "#C9A84C",
                    border: `1px solid ${i === 0 ? "#C9A84C" : "rgba(201,168,76,0.4)"}`,
                    borderRadius: "0.4rem",
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                  }}
                >
                  <Download size={14} />
                  Unduh PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
