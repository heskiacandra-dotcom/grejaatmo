"use client";
// src/components/sections/KontakContent.tsx
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Alamat",
    lines: ["Jl. Atmodirono, Wonodri,", "Kec. Semarang Selatan,", "Kota Semarang, Jawa Tengah 50242"],
    href: "https://maps.google.com/?q=-6.995806,110.430111",
  },
  {
    icon: Phone,
    title: "Telepon Sekretariat",
    lines: ["(024) 8317XXX"],
    href: "tel:+62248317XXX",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@paroki-keluargakudus.id"],
    href: "mailto:info@paroki-keluargakudus.id",
  },
  {
    icon: Clock,
    title: "Jam Pelayanan Sekretariat",
    lines: ["Senin – Sabtu", "08.00 – 16.00 WIB", "(Tutup hari Minggu & Hari Raya)"],
    href: null,
  },
];

export function KontakContent() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [contactInfo, setContactInfo] = useState(CONTACT_INFO);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const newData = [...CONTACT_INFO];
          if (res.data.address) newData[0].lines = [res.data.address];
          if (res.data.contactPhone) {
            newData[1].lines = [res.data.contactPhone];
            newData[1].href = `tel:${res.data.contactPhone.replace(/[^0-9+]/g, "")}`;
          }
          if (res.data.contactEmail) {
            newData[2].lines = [res.data.contactEmail];
            newData[2].href = `mailto:${res.data.contactEmail}`;
          }
          if (res.data.officeHours) newData[3].lines = [res.data.officeHours];
          setContactInfo(newData);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".kontak-reveal",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: send to API
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="container-main" style={{ textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center", color: "rgba(201,168,76,0.8)", marginBottom: "1.25rem" }}>
            <span style={{ background: "rgba(201,168,76,0.5)" }} />
            Hubungi Kami
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FDFAF4", fontWeight: 700, marginBottom: "1rem" }}>
            Kontak & <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Lokasi</span>
          </h1>
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.1rem", color: "rgba(253,250,244,0.55)" }}>
            Kami dengan senang hati mendengar dari Anda
          </p>
        </div>
      </div>

      <div ref={sectionRef} style={{ background: "#F5F0E4", paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div className="container-main">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>
            {/* Contact info cards */}
            <div>
              <h2 className="kontak-reveal" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", color: "#1A1614", marginBottom: "1.75rem" }}>
                Informasi Kontak
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {contactInfo.map(({ icon: Icon, title, lines, href }) => (
                  <div key={title} className="kontak-reveal card" style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "0.75rem", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={18} style={{ color: "#C9A84C" }} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.5rem" }}>{title}</h3>
                      {lines.map((line, i) => (
                        <p key={i} style={{ fontSize: "0.9rem", color: "#5C3D2E", lineHeight: 1.6 }}>{line}</p>
                      ))}
                      {href && (
                        <a href={href} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.75rem", color: "#C9A84C", textDecoration: "none", fontFamily: "Cinzel, serif", letterSpacing: "0.08em" }}>
                          Buka →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="kontak-reveal">
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", color: "#1A1614", marginBottom: "1.75rem" }}>
                Kirim Pesan
              </h2>
              <div className="card" style={{ padding: "2rem" }}>
                {sent ? (
                  <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    <CheckCircle size={48} style={{ color: "#6B7C5E", margin: "0 auto 1rem" }} />
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", color: "#1A1614", marginBottom: "0.5rem" }}>Pesan Terkirim!</h3>
                    <p style={{ fontSize: "0.9rem", color: "#8B7355" }}>Kami akan membalas dalam 1-2 hari kerja.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Nama *</label>
                        <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-sacred" placeholder="Nama Anda" required />
                      </div>
                      <div>
                        <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Email *</label>
                        <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="input-sacred" placeholder="email@anda.com" required />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Perihal *</label>
                      <input type="text" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} className="input-sacred" placeholder="Perihal pesan Anda" required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Pesan *</label>
                      <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} className="input-sacred" rows={5} style={{ resize: "vertical" }} placeholder="Tuliskan pesan Anda di sini..." required />
                    </div>
                    <button type="submit" className="btn-gold" style={{ alignSelf: "flex-start" }}>
                      <Send size={15} />
                      Kirim Pesan
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="kontak-reveal" style={{ borderRadius: "1.25rem", overflow: "hidden", border: "1px solid #E2D8C0", boxShadow: "0 8px 32px rgba(26,22,20,0.08)" }}>
            <iframe
              src="https://maps.google.com/maps?q=-6.995806,110.430111&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="450"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Paroki Keluarga Kudus Atmodirono"
            />
          </div>
        </div>
      </div>
    </>
  );
}
