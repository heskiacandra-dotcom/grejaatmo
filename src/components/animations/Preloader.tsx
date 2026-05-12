"use client";
// src/components/animations/Preloader.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const obj = { value: 0 };
    const ctx = gsap.context(() => {
      // Animate progress
      gsap.to(obj, {
        value: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
          const val = Math.round(obj.value);
          setProgress(val);
          if (percentRef.current) {
            percentRef.current.textContent = val + "%";
          }
          if (progressRef.current) {
            progressRef.current.style.width = val + "%";
          }
        },
        onComplete: () => {
          // Exit animation
          gsap.to(logoRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: "power2.in",
          });

          gsap.to(preloaderRef.current, {
            yPercent: -100,
            duration: 0.9,
            ease: "power4.inOut",
            delay: 0.3,
            onComplete,
          });
        },
      });

      // Logo entrance
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
      );
    }, preloaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={preloaderRef}
      className="preloader"
      style={{
        background: "#1A1614",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* Logo */}
      <div ref={logoRef} style={{ textAlign: "center" }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(201,168,76,0.1)",
            border: "1px solid rgba(201,168,76,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            padding: "0.5rem",
          }}
        >
          <Image
            src="/logo.png"
            alt="Logo Gereja"
            width={64}
            height={64}
            style={{
              objectFit: "contain",

              opacity: 0.9,
            }}
          />
        </div>

        <p
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "0.6rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(253,250,244,0.5)",
            marginBottom: "0.5rem",
          }}
        >
          Gereja Katolik Paroki
        </p>
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(1rem, 3vw, 1.4rem)",
            color: "#C9A84C",
            fontWeight: 600,
          }}
        >
          Keluarga Kudus Atmodirono
        </h1>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "200px",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "rgba(201,168,76,0.2)",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            ref={progressRef}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #A07830, #C9A84C, #E4C97A)",
              width: "0%",
              borderRadius: "999px",
              transition: "width 0.05s linear",
            }}
          />
        </div>
        <span
          ref={percentRef}
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "rgba(201,168,76,0.7)",
          }}
        >
          0%
        </span>
      </div>

      {/* Quote */}
      <p
        ref={textRef}
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "0.9rem",
          fontStyle: "italic",
          color: "rgba(253,250,244,0.35)",
          textAlign: "center",
          maxWidth: "280px",
        }}
      >
        &ldquo;Di mana ada kasih dan kebijaksanaan, tidak ada ketakutan maupun kebodohan.&rdquo;
      </p>
    </div>
  );
}
