"use client";
// src/components/sections/HeroSection.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const [tagline, setTagline] = useState(
    "Komunitas iman yang hidup dalam semangat Keluarga Kudus Nazaret — penuh kasih, pengharapan, dan pengabdian."
  );

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.siteTagline) {
          setTagline(res.data.siteTagline);
        }
      })
      .catch(() => {});

    const tl = gsap.timeline({ delay: 0.5 });

    // Set initial states
    gsap.set(
      [labelRef.current, title1Ref.current, title2Ref.current, subtitleRef.current, ctaRef.current],
      { opacity: 0, y: 40 }
    );
    gsap.set(logoRef.current, { opacity: 0, scale: 0.8, rotate: -5 });
    gsap.set(scrollRef.current, { opacity: 0 });

    // Animate in sequence
    tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
      .to(logoRef.current, { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: "power3.out" }, "-=0.4")
      .to(title1Ref.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.6")
      .to(title2Ref.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.7")
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .to(scrollRef.current, { opacity: 1, duration: 0.6 }, "-=0.2");

    // Parallax on background
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        if (bgRef.current) {
          gsap.set(bgRef.current, { y: self.progress * 120 });
        }
        if (contentRef.current) {
          gsap.set(contentRef.current, {
            opacity: 1 - self.progress * 1.5,
            y: self.progress * 60,
          });
        }
      },
    });

    // Scroll indicator bounce
    gsap.to(scrollRef.current, {
      y: 8,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#1A1614",
      }}
    >
      {/* Background */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: "-10%",
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.05) 0%, transparent 40%),
            linear-gradient(135deg, #1A1614 0%, #2C2420 50%, #1A1614 100%)
          `,
        }}
      />

      {/* Decorative geometric */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(700px, 90vw)",
          height: "min(700px, 90vw)",
          border: "1px solid rgba(201,168,76,0.04)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(500px, 70vw)",
          height: "min(500px, 70vw)",
          border: "1px solid rgba(201,168,76,0.07)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Gold orb top right */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="container-main"
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          paddingTop: "6rem",
          paddingBottom: "6rem",
        }}
      >
        {/* Label */}
        <div
          ref={labelRef}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          <span style={{ width: "32px", height: "1px", background: "rgba(201,168,76,0.5)" }} />
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.6rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(201,168,76,0.8)",
            }}
          >
            Gereja Katolik Paroki
          </span>
          <span style={{ width: "32px", height: "1px", background: "rgba(201,168,76,0.5)" }} />
        </div>

        {/* Logo */}
        <div
          ref={logoRef}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "clamp(120px, 18vw, 180px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/logo.png"
              alt="Logo Paroki Keluarga Kudus Atmodirono"
              width={180}
              height={180}
              priority
              style={{
                objectFit: "contain",

                opacity: 0.88,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div ref={title1Ref} style={{ marginBottom: "0.25rem" }}>
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              fontWeight: 700,
              color: "#FDFAF4",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            Keluarga Kudus
          </h1>
        </div>
        <div ref={title2Ref} style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "clamp(1rem, 2.5vw, 1.6rem)",
              fontWeight: 400,
              color: "#C9A84C",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Atmodirono
          </h2>
        </div>

        {/* Divider ornament */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
          <span style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5))" }} />
          <span style={{ fontFamily: "serif", fontSize: "1rem", color: "rgba(201,168,76,0.5)" }}>✝</span>
          <span style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, rgba(201,168,76,0.5), transparent)" }} />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "rgba(253,250,244,0.6)",
            maxWidth: "520px",
            margin: "0 auto 3rem",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          {tagline}
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <Link href="/jadwal" className="btn-gold">
            Jadwal Misa
          </Link>
          <Link href="/berita" className="btn-outline">
            Berita Paroki
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "0.55rem",
            letterSpacing: "0.25em",
            color: "rgba(201,168,76,0.5)",
            textTransform: "uppercase",
          }}
        >
          Gulir
        </span>
        <ChevronDown size={18} style={{ color: "rgba(201,168,76,0.5)" }} />
      </div>
    </section>
  );
}
