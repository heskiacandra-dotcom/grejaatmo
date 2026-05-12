"use client";
// src/components/sections/NewsSection.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronRight } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  isFeatured?: boolean;
  publishedAt?: string;
  category?: { name: string; color: string; slug: string };
  author?: { name: string };
}

const gradients = [
  "linear-gradient(135deg, #F0E8D0, #E2D5B8)",
  "linear-gradient(135deg, #E8E0D5, #D5CAB8)",
  "linear-gradient(135deg, #EDE5D5, #DCCFBA)",
];

export function NewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts?status=published&limit=5")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    gsap.fromTo(
      ".news-reveal",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      }
    );
  }, [loading]);

  const featured = posts.find((p) => p.isFeatured) || posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id).slice(0, 4);

  return (
    <section ref={sectionRef} className="section-base" style={{ background: "#F5F0E4" }}>
      <div className="container-main">
        {/* Header */}
        <div
          className="news-reveal"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1.5rem",
            marginBottom: "3.5rem",
          }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: "1rem" }}>Warta &amp; Berita</div>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 700,
                color: "#1A1614",
                lineHeight: 1.2,
              }}
            >
              Kabar Terbaru dari{" "}
              <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Paroki</span>
            </h2>
          </div>
          <Link
            href="/berita"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "Cinzel, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#A07830",
              textDecoration: "none",
            }}
          >
            Semua Berita <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#B09878", fontFamily: "Cinzel, serif", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            Memuat berita...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.1rem", color: "#B09878" }}>
              Belum ada berita yang dipublikasikan.
            </p>
            <p style={{ fontSize: "0.85rem", color: "#B09878", marginTop: "0.5rem" }}>
              Admin dapat menambahkan berita melalui CMS.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.5rem" }}>
            {/* Featured card */}
            {featured && (
              <div className="news-reveal" style={{ gridColumn: "span 12" }}>
                <Link href={`/berita/${featured.slug}`} style={{ textDecoration: "none" }}>
                  <div
                    className="card"
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", overflow: "hidden" }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        background: gradients[0],
                        minHeight: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {featured.coverImage ? (
                        <Image
                          src={featured.coverImage}
                          alt={featured.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontFamily: "serif", fontSize: "8rem", color: "#8B7355", opacity: 0.15 }}>✝</span>
                      )}
                      {featured.category && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "1rem",
                            left: "1rem",
                            background: featured.category.color || "#C9A84C",
                            color: "#FFF",
                            padding: "0.3rem 0.75rem",
                            borderRadius: "999px",
                            fontSize: "0.7rem",
                            fontFamily: "Cinzel, serif",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                          }}
                        >
                          {featured.category.name}
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ padding: "2.5rem" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          fontFamily: "Cinzel, serif",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: "#C9A84C",
                          textTransform: "uppercase",
                          marginBottom: "1rem",
                        }}
                      >
                        <span style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                          Pilihan Utama
                        </span>
                      </div>
                      <h3
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                          fontWeight: 700,
                          color: "#1A1614",
                          lineHeight: 1.3,
                          marginBottom: "1rem",
                        }}
                      >
                        {featured.title}
                      </h3>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "#8B7355", lineHeight: 1.7, marginBottom: "2rem" }}>
                        {featured.excerpt}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#B09878", fontFamily: "Inter, sans-serif" }}>
                        <Calendar size={13} />
                        <span>{formatDateShort(featured.publishedAt || "")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Rest cards */}
            {rest.map((post, i) => (
              <div
                key={post.id}
                className="news-reveal"
                style={{ gridColumn: "span 12" }}
              >
                <Link href={`/berita/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div className="news-card">
                    <div
                      style={{
                        background: gradients[i % gradients.length],
                        height: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {post.coverImage ? (
                        <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontFamily: "serif", fontSize: "4rem", color: "#8B7355", opacity: 0.12 }}>✝</span>
                      )}
                      {post.category && (
                        <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                          <span
                            style={{
                              background: post.category.color || "#C9A84C",
                              color: "#FFF",
                              padding: "0.2rem 0.6rem",
                              borderRadius: "999px",
                              fontSize: "0.65rem",
                              fontFamily: "Cinzel, serif",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            {post.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "1.5rem" }}>
                      <h3
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontSize: "1.05rem",
                          fontWeight: 600,
                          color: "#1A1614",
                          lineHeight: 1.4,
                          marginBottom: "0.75rem",
                        }}
                      >
                        {post.title}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "#8B7355", lineHeight: 1.6, marginBottom: "1rem" }}>
                        {post.excerpt?.substring(0, 100)}...
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "#B09878" }}>
                        <Calendar size={12} />
                        <span>{formatDateShort(post.publishedAt || "")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="news-reveal" style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/berita" className="btn-gold">Lihat Semua Berita</Link>
        </div>
      </div>
    </section>
  );
}
