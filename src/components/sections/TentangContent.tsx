"use client";
// src/components/sections/TentangContent.tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Heart, Users, Church, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  { icon: Heart, title: "Kasih", desc: "Melayani sesama dengan kasih Kristus yang tanpa batas sebagaimana teladan Keluarga Kudus Nazaret." },
  { icon: Users, title: "Persaudaraan", desc: "Membangun komunitas iman yang hangat, inklusif, dan saling mendukung dalam suka maupun duka." },
  { icon: Church, title: "Iman", desc: "Menjaga kemurnian iman Katolik melalui perayaan liturgi, sakramen, dan pembinaan iman." },
  { icon: Star, title: "Pelayanan", desc: "Menghadirkan Kerajaan Allah melalui pelayanan sosial dan karya nyata kepada masyarakat." },
];



const PASTORAL = [
  "Seksi Liturgi & Sakramen",
  "Persekutuan Doa Paroki",
  "OMK (Orang Muda Katolik)",
  "WKRI (Wanita Katolik RI)",
  "Legio Maria",
  "Seksi Sosial & Caritas",
  "Kelompok Prodiakon",
  "Lansia Paroki",
  "Sekolah Minggu & Bina Iman",
  "Tim Koor & Musik Liturgi",
];

export function TentangContent({ settings = {} }: { settings?: any }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".tentang-reveal",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      }
    );
  }, []);

  return (
    <>
      {/* Hero header */}
      <div className="page-header">
        <div className="container-main" style={{ textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center", color: "rgba(201,168,76,0.8)", marginBottom: "1.25rem" }}>
            <span style={{ background: "rgba(201,168,76,0.5)" }} />
            Profil Paroki
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FDFAF4", fontWeight: 700, marginBottom: "1rem" }}>
            Tentang <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Paroki Kami</span>
          </h1>
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.15rem", color: "rgba(253,250,244,0.55)", maxWidth: "500px", margin: "0 auto" }}>
            &ldquo;Dimana ada kasih, di situ hadirlah Allah.&rdquo;
          </p>
        </div>
      </div>

      <div ref={sectionRef} style={{ background: "#FDFAF4" }}>
        {/* Mission & Vision */}
        <div className="section-base" style={{ background: "#F5F0E4" }}>
          <div className="container-main">
            {/* Centered Header */}
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <div className="section-label" style={{ justifyContent: "center", marginBottom: "1.25rem" }}>
                Identitas Paroki
              </div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)", color: "#1A1614", fontWeight: 700, lineHeight: 1.2, marginBottom: "1.5rem", maxWidth: "800px", margin: "0 auto 1.5rem" }}>
                {settings.tentangTitle1 || "Komunitas Iman dalam"}{" "}
                <span style={{ color: "#C9A84C", fontStyle: "italic" }}>{settings.tentangTitle2 || "Semangat Keluarga Kudus"}</span>
              </h2>
              <div className="divider-gold" style={{ marginBottom: "0" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "4rem", alignItems: "center" }}>
              <div className="tentang-reveal">
                <p style={{ fontSize: "1rem", color: "#8B7355", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                  {settings.tentangParagraf1 || "Paroki Keluarga Kudus Atmodirono berdiri sejak tahun 1952, melayani umat Katolik di wilayah Semarang Selatan. Dengan semangat Keluarga Kudus Nazaret sebagai teladan, paroki kami terus bertumbuh dalam iman, persaudaraan, dan pelayanan."}
                </p>
                <p style={{ fontSize: "1rem", color: "#8B7355", lineHeight: 1.8 }}>
                  {settings.tentangParagraf2 || "Kami adalah komunitas yang beragam — dari anak-anak hingga lansia — bersatu dalam doa, perayaan sakramen, dan kegiatan sosial. Setiap minggu, ribuan umat berkumpul merayakan iman dan memperbarui komitmen sebagai pengikut Kristus."}
                </p>
              </div>

              {/* Image card */}
              <div className="tentang-reveal" style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ position: "relative", width: "100%", maxWidth: "580px" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: "-15px",
                      left: "-15px",
                      right: "-15px",
                      bottom: "-15px",
                      border: "1px solid rgba(201,168,76,0.3)",
                      borderRadius: "1rem",
                      zIndex: 0,
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      borderRadius: "1rem",
                      overflow: "hidden",
                      aspectRatio: "16/10",
                      boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
                    }}
                  >
                    <Image
                      src={settings.tentangImage || "/gereja-atmo-baru.jpg"}
                      alt="Gereja Katolik Paroki Keluarga Kudus Atmodirono"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="section-base">
          <div className="container-main">
            <div className="tentang-reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="section-label" style={{ justifyContent: "center", marginBottom: "1rem" }}>
                {settings.valuesSectionTitle || "Nilai Paroki"}
              </div>
              <h2 style={{ textAlign: "center", fontFamily: "Playfair Display, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.3rem)", color: "#1A1614", fontWeight: 700 }}>
                {settings.valuesMainTitle1 || "Landasan Kehidupan"}{" "}
                <span style={{ color: "#C9A84C", fontStyle: "italic" }}>
                  {settings.valuesMainTitle2 || "Beriman"}
                </span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {[1, 2, 3, 4].map((num) => {
                const title = settings[`value${num}Title`] || VALUES[num - 1].title;
                const desc = settings[`value${num}Desc`] || VALUES[num - 1].desc;
                const Icon = VALUES[num - 1].icon;

                return (
                  <div key={num} className="tentang-reveal card" style={{ padding: "2rem", textAlign: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "1rem", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                      <Icon size={24} style={{ color: "#C9A84C" }} />
                    </div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15rem", color: "#1A1614", fontWeight: 600, marginBottom: "0.75rem" }}>
                      {title}
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "#8B7355", lineHeight: 1.7 }}>
                      {desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Para Romo */}
        <div className="section-base" style={{ background: "linear-gradient(135deg, #1A1614, #2C2420)" }}>
          <div className="container-main">
            <div className="tentang-reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="section-label" style={{ justifyContent: "center", color: "rgba(201,168,76,0.7)", marginBottom: "1rem" }}>Gembala Kami</div>
              <h2 style={{ textAlign: "center", fontFamily: "Playfair Display, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.3rem)", color: "#FDFAF4", fontWeight: 700 }}>
                Para <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Romo</span>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: "2rem" }}>
              {[1, 2, 3].map((num) => {
                const imgKey = `romo${num}Image`;
                const nameKey = `romo${num}Name`;
                const descKey = `romo${num}Desc`;
                
                // If setting doesn't exist, use fallback
                const name = settings[nameKey] || `R.D. Nama Romo ${num}`;
                const desc = settings[descKey] || "Pastor Paroki";
                const img = settings[imgKey] || "/gereja-atmo-baru.jpg";

                return (
                  <div key={num} className="tentang-reveal" style={{ textAlign: "center", background: "rgba(253,250,244,0.03)", padding: "2.5rem 1.5rem", borderRadius: "1rem", border: "1px solid rgba(201,168,76,0.15)", transition: "transform 0.3s ease" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-10px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                    <div style={{ width: 140, height: 140, borderRadius: "50%", margin: "0 auto 1.5rem auto", position: "relative", border: "3px solid #C9A84C", overflow: "hidden", padding: "4px" }}>
                      <div style={{ width: "100%", height: "100%", position: "relative", borderRadius: "50%", overflow: "hidden" }}>
                        <Image src={img} alt={name} fill style={{ objectFit: "cover" }} />
                      </div>
                    </div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", color: "#C9A84C", fontWeight: 600, marginBottom: "0.5rem" }}>{name}</h3>
                    <p style={{ fontSize: "0.9rem", color: "rgba(253,250,244,0.6)" }}>{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pastoral groups */}
        <div className="section-base">
          <div className="container-main">
            <div className="tentang-reveal" style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="section-label" style={{ justifyContent: "center", marginBottom: "1rem" }}>Komunitas & Kelompok</div>
              <h2 style={{ textAlign: "center", fontFamily: "Playfair Display, serif", fontSize: "clamp(1.6rem, 3.5vw, 2.3rem)", color: "#1A1614", fontWeight: 700 }}>
                Kelompok <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Pastoral</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {(settings.pastoralGroups ? settings.pastoralGroups.split("\n").filter((g: string) => g.trim()) : PASTORAL).map((group: string) => (
                <div key={group} className="tentang-reveal" style={{ background: "#F5F0E4", border: "1px solid #E2D8C0", borderRadius: "0.75rem", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.875rem", color: "#5C3D2E" }}>{group}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
