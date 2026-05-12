"use client";
// src/components/ui/Navbar.tsx
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/jadwal", label: "Jadwal Misa" },
  { href: "/warta", label: "Warta" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

export function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Navbar entrance
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "nav-glass shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container-main">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: isScrolled ? "64px" : "80px",
              transition: "height 0.4s ease",
              position: "relative",
            }}
          >
            {/* Logo Area */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              {/* Easter Egg Admin Link (1-Click on Logo Icon) */}
              <Link href="/auth/login" aria-label="Admin Login">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: `1px solid ${isScrolled ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.6)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                    background: isScrolled ? "rgba(253,250,244,0.8)" : "rgba(26,22,20,0.3)",
                    transition: "all 0.4s ease",
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt="Logo Paroki"
                    width={32}
                    height={32}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </Link>

              {/* Home Link (Text) */}
              <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: isScrolled ? "#8B7355" : "rgba(253,250,244,0.7)",
                    transition: "color 0.4s ease",
                  }}
                >
                  Paroki
                </span>
                <span
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: isScrolled ? "#1A1614" : "#FDFAF4",
                    lineHeight: 1.2,
                    transition: "color 0.4s ease",
                  }}
                >
                  Keluarga Kudus
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div
              className="hidden md:flex"
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                alignItems: "center",
                gap: "2.5rem",
              }}
            >

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                  style={{
                    color:
                      pathname === link.href
                        ? "#A07830"
                        : isScrolled
                        ? "#8B7355"
                        : "rgba(253,250,244,0.85)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="flex md:hidden items-center justify-center"
              onClick={toggleMobile}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isScrolled ? "#1A1614" : "#FDFAF4",
                padding: "0.5rem",
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`mobile-menu ${mobileOpen ? "open" : ""}`}
        style={{ top: isScrolled ? "64px" : "80px" }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="mobile-nav-link"
            onClick={closeMobile}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
