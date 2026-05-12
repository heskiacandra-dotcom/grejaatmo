"use client";
// src/components/sections/ContactSection.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".contact-reveal",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );
  }, []);

  const CONTACTS_INITIAL = [
    {
      icon: MapPin,
      title: "Alamat",
      lines: ["Jl. Atmodirono, Wonodri", "Kec. Semarang Selatan", "Kota Semarang, Jawa Tengah"],
    },
    {
      icon: Phone,
      title: "Telepon",
      lines: ["(024) 8317XXX", "Sekretariat Paroki"],
    },
    {
      icon: Mail,
      title: "Email",
      lines: ["info@paroki-keluargakudus.id"],
    },
    {
      icon: Clock,
      title: "Jam Pelayanan",
      lines: ["Senin – Sabtu", "08.00 – 16.00 WIB"],
    },
  ];

  const [contacts, setContacts] = useState(CONTACTS_INITIAL);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const newData = [...CONTACTS_INITIAL];
          if (res.data.address) newData[0].lines = [res.data.address];
          if (res.data.contactPhone) newData[1].lines = [res.data.contactPhone, "Sekretariat Paroki"];
          if (res.data.contactEmail) newData[2].lines = [res.data.contactEmail];
          if (res.data.officeHours) newData[3].lines = [res.data.officeHours];
          setContacts(newData);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-base"
      style={{
        background: "linear-gradient(135deg, #F0E8D0 0%, #FDFAF4 100%)",
      }}
    >
      <div className="container-main">
        {/* Header */}
        <div
          className="contact-reveal"
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <div className="section-label" style={{ justifyContent: "center", marginBottom: "1.25rem" }}>
            Temukan Kami
          </div>
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              color: "#1A1614",
            }}
          >
            Hubungi{" "}
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Sekretariat</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {/* Contact cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {contacts.map(({ icon: Icon, title, lines }) => (
              <div
                key={title}
                className="contact-reveal card"
                style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "0.75rem",
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} style={{ color: "#C9A84C" }} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "Cinzel, serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#C9A84C",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {title}
                  </h4>
                  {lines.map((line, i) => (
                    <p key={i} style={{ fontSize: "0.9rem", color: "#5C3D2E", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Map embed */}
          <div className="contact-reveal" style={{ minHeight: "400px" }}>
            <div
              style={{
                borderRadius: "1rem",
                overflow: "hidden",
                height: "100%",
                minHeight: "400px",
                border: "1px solid #E2D8C0",
                boxShadow: "0 8px 32px rgba(26,22,20,0.08)",
              }}
            >
              <iframe
                src="https://maps.google.com/maps?q=-6.995806,110.430111&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Paroki Keluarga Kudus Atmodirono"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
