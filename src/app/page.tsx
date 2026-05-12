"use client";
// src/app/page.tsx
import { useState, useEffect } from "react";
import { Preloader } from "@/components/animations/Preloader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AnnouncementBanner } from "@/components/sections/AnnouncementBanner";
import { AboutSection } from "@/components/sections/AboutSection";
import { MassScheduleSection } from "@/components/sections/MassScheduleSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { WartaSection } from "@/components/sections/WartaSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { PopupAnnouncement } from "@/components/ui/PopupAnnouncement";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [skipPreloader, setSkipPreloader] = useState(false);

  useEffect(() => {
    // Force scroll to top on refresh
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    if (typeof window !== "undefined" && sessionStorage.getItem("hasPreloaded")) {
      setSkipPreloader(true);
      setLoaded(true);
    }
  }, []);

  return (
    <>
      {!skipPreloader && !loaded && (
        <Preloader 
          onComplete={() => {
            if (typeof window !== "undefined") sessionStorage.setItem("hasPreloaded", "true");
            setLoaded(true);
          }} 
        />
      )}
      <CustomCursor />
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
          visibility: loaded ? "visible" : "hidden",
        }}
      >
        <Navbar />
        <main>
          <HeroSection />
          <AnnouncementBanner />
          <AboutSection />
          <MassScheduleSection />
          <NewsSection />
          <WartaSection />
          <ContactSection />
        </main>
        <Footer />

      </div>
    </>
  );
}
