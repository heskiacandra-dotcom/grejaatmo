"use client";
// src/components/ui/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer
      style={{
        background: "#1A1614",
        color: "rgba(253,250,244,0.8)",
        paddingTop: "5rem",
        paddingBottom: "2rem",
      }}
    >
      <div className="container-main">
        {/* Top section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "3rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "1px solid rgba(201,168,76,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Logo Paroki"
                  width={40}
                  height={40}
                  style={{
                    objectFit: "contain",

                    opacity: 0.85,
                  }}
                />
              </div>
              <div>
                <p style={{ fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase" }}>
                  Paroki
                </p>
                <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 600, color: "#FDFAF4", lineHeight: 1.2 }}>
                  Keluarga Kudus
                </p>
                <p style={{ fontFamily: "Playfair Display, serif", fontSize: "0.8rem", color: "rgba(253,250,244,0.6)", lineHeight: 1.2 }}>
                  Atmodirono
                </p>
              </div>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "rgba(253,250,244,0.55)", maxWidth: "260px" }}>
              {settings.siteTagline || "Melayani umat Katolik di wilayah Atmodirono dan sekitarnya dalam semangat Keluarga Kudus Nazaret."}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", color: "rgba(201,168,76,0.4)" }}>✝</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#C9A84C",
                marginBottom: "1.25rem",
              }}
            >
              Navigasi
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { href: "/", label: "Beranda" },

                { href: "/jadwal", label: "Jadwal Misa" },
                { href: "/warta", label: "Warta Paroki" },
                { href: "/tentang", label: "Tentang Paroki" },
                { href: "/kontak", label: "Kontak" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: "rgba(253,250,244,0.6)",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      transition: "color 0.3s ease",
                      fontFamily: "Inter, sans-serif",
                    }}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#C9A84C",
                marginBottom: "1.25rem",
              }}
            >
              Informasi Kontak
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <li style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <MapPin size={16} style={{ color: "#C9A84C", marginTop: "2px", flexShrink: 0 }} />
                <span style={{ fontSize: "0.85rem", color: "rgba(253,250,244,0.6)", lineHeight: 1.5 }}>
                  {settings.address || <>Jl. Atmodirono, Wonodri,<br />Kec. Semarang Selatan, Kota Semarang</>}
                </span>
              </li>
              <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Phone size={16} style={{ color: "#C9A84C", flexShrink: 0 }} />
                <span style={{ fontSize: "0.85rem", color: "rgba(253,250,244,0.6)" }}>
                  {settings.contactPhone || "(024) 8317XXX"}
                </span>
              </li>
              <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Mail size={16} style={{ color: "#C9A84C", flexShrink: 0 }} />
                <span style={{ fontSize: "0.85rem", color: "rgba(253,250,244,0.6)" }}>
                  {settings.contactEmail || "info@paroki-keluargakudus.id"}
                </span>
              </li>
              <li style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <Clock size={16} style={{ color: "#C9A84C", marginTop: "2px", flexShrink: 0 }} />
                <span style={{ fontSize: "0.85rem", color: "rgba(253,250,244,0.6)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                  {settings.officeHours || <>Sekretariat:<br />Senin–Sabtu 08.00–16.00 WIB</>}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            paddingTop: "2rem",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "rgba(253,250,244,0.35)", fontFamily: "Cinzel, serif", letterSpacing: "0.05em" }}>
            {settings.footerText || `© ${new Date().getFullYear()} Paroki Keluarga Kudus Atmodirono. Hak Cipta Dilindungi.`}
          </p>
        </div>
      </div>

    </footer>
  );
}
