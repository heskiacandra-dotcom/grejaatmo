"use client";
// src/components/sections/AboutSection.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { mockStats } from "@/lib/mock-data";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: mockStats.tahunBerdiri, label: "Tahun Berdiri", suffix: "" },
  { value: mockStats.jumlahJemaat, label: "Umat Paroki", suffix: "+" },
  { value: mockStats.komunitasKomunitas, label: "Komunitas", suffix: "" },
  { value: mockStats.kegiatanPerTahun, label: "Kegiatan/Tahun", suffix: "+" },
];

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: counterRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: value,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent =
                Math.round(obj.val).toLocaleString("id-ID") + suffix;
            }
          },
        });
      },
    });
  }, [value, suffix]);

  return (
    <span ref={counterRef} className="counter-number">
      0{suffix}
    </span>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<any>({
    tentangImage: "/gereja-atmo-baru.jpg",
    tentangTitle1: "Lebih dari Tujuh Dekade",
    tentangTitle2: "Melayani dengan Kasih",
    tentangParagraf1: "Paroki Keluarga Kudus Atmodirono berdiri sejak tahun 1952, melayani umat Katolik di wilayah Semarang Selatan. Dengan semangat Keluarga Kudus Nazaret sebagai teladan, paroki kami terus bertumbuh dalam iman, persaudaraan, dan pelayanan.",
    tentangParagraf2: "Komunitas yang beragam, mulai dari anak-anak hingga lansia, bersatu dalam doa, perayaan sakramen, dan kegiatan sosial demi mewujudkan Kerajaan Allah di bumi.",
    statsYear: mockStats.tahunBerdiri,
    statsUmat: mockStats.jumlahJemaat,
    statsKomunitas: mockStats.komunitasKomunitas,
    statsKegiatan: mockStats.kegiatanPerTahun,
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings((prev: any) => ({ ...prev, ...data.data }));
        }
      })
      .catch((err) => console.error(err));

    gsap.fromTo(
      leftRef.current,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    gsap.fromTo(
      rightRef.current,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    gsap.fromTo(
      ".stat-item",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  const statsList = [
    { value: parseInt(settings.statsYear), label: "Tahun Berdiri", suffix: "" },
    { value: parseInt(settings.statsUmat), label: "Umat Paroki", suffix: "+" },
    { value: parseInt(settings.statsKomunitas), label: "Komunitas", suffix: "" },
    { value: parseInt(settings.statsKegiatan), label: "Kegiatan/Tahun", suffix: "+" },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-base"
      style={{ background: "#FDFAF4" }}
    >
      <div className="container-main">
        {/* Centered Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="section-label" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
            Tentang Paroki
          </div>
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(1.8rem, 4.5vw, 3rem)",
              fontWeight: 700,
              color: "#1A1614",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
              maxWidth: "800px",
              margin: "0 auto 1.5rem"
            }}
          >
            {settings.tentangTitle1}{" "}
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>
              {settings.tentangTitle2}
            </span>
          </h2>
          <div className="divider-gold" style={{ marginBottom: "0" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Left: Image + ornament */}
          <div ref={leftRef} style={{ padding: "1rem" }}>
            <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
              {/* Decorative frame */}
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "-12px",
                  right: "-12px",
                  bottom: "-12px",
                  border: "2px solid #C9A84C",
                  borderRadius: "0.75rem",
                  zIndex: 0,
                }}
              />
              {/* Main image box */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  aspectRatio: "4/5",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              >
                <Image
                  src={settings.tentangImage}
                  alt="Gereja Katolik Paroki Keluarga Kudus Atmodirono"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div ref={rightRef}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "1rem",
                color: "#5C3D2E",
                lineHeight: 1.8,
                marginBottom: "1.5rem",
              }}
            >
              {settings.tentangParagraf1}
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "1rem",
                color: "#5C3D2E",
                lineHeight: 1.8,
                marginBottom: "3rem",
              }}
            >
              {settings.tentangParagraf2}
            </p>

            {/* Stats Grid */}
            <div
              ref={statsRef}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              {statsList.map((stat, i) => (
                <div
                  key={i}
                  className="stat-item"
                  style={{
                    padding: "1.25rem",
                    background: "#F5F0E4",
                    borderRadius: "0.75rem",
                    border: "1px solid #E2D8C0",
                  }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <p
                    style={{
                      fontFamily: "Cinzel, serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#8B7355",
                      marginTop: "0.25rem",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
