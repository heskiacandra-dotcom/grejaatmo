"use client";
// src/components/sections/BeritaList.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { Calendar, Search } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  isFeatured?: boolean;
  publishedAt?: string;
  createdAt?: string;
  category?: { id: number; name: string; color: string; slug: string };
  author?: { id: string; name: string };
}

const CATEGORIES = [
  { id: "all", name: "Semua" },
  { id: "kegiatan-paroki", name: "Kegiatan Paroki" },
  { id: "kaum-muda", name: "Kaum Muda" },
  { id: "sosial", name: "Sosial" },
  { id: "iman-spiritualitas", name: "Iman & Spiritualitas" },
  { id: "pengumuman", name: "Pengumuman" },
];

const gradients = [
  "linear-gradient(135deg, #F0E8D0, #E2D5B8)",
  "linear-gradient(135deg, #E8E0D5, #D5CAB8)",
  "linear-gradient(135deg, #EDE5D5, #DCCFBA)",
  "linear-gradient(135deg, #E8DDD0, #D8CCBA)",
];

export function BeritaList({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ status: "published", limit: "50" });
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (search) params.set("search", search);

    Promise.all([
      fetch(`/api/posts?${params}`).then(res => res.json()),
      fetch("/api/announcements").then(res => res.json())
    ])
      .then(([postsData, annData]) => {
        if (postsData.success) setPosts(postsData.data);
        if (annData.success) setAnnouncements(annData.data.filter((a: any) => a.isActive));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  useEffect(() => {
    const t = setTimeout(fetchPosts, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchPosts]);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".berita-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }
      );
    }
  }, [loading, posts.length]);

  return (
    <>
      {/* Page Header */}
      {!hideHeader && (
        <div className="page-header">
        <div className="container-main" style={{ textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center", color: "rgba(201,168,76,0.8)", marginBottom: "1.25rem" }}>
            <span style={{ background: "rgba(201,168,76,0.5)" }} />
            Portal Informasi
          </div>
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#FDFAF4",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Berita &amp;{" "}
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Pengumuman</span>
          </h1>
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.1rem", color: "rgba(253,250,244,0.55)" }}>
            Kabar terkini dari Paroki Keluarga Kudus Atmodirono
          </p>
        </div>
        </div>
      )}

      {/* Content */}
      <div style={{ background: "#F5F0E4", minHeight: "60vh", paddingTop: hideHeader ? "0" : "3rem", paddingBottom: "5rem" }}>
        <div className="container-main">
          {/* Search + Filter */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "3rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ position: "relative", flex: "1", minWidth: "200px", maxWidth: "360px" }}>
              <Search size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#B09878" }} />
              <input
                type="text"
                placeholder="Cari berita..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-sacred"
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "999px",
                    border: `1px solid ${activeCategory === cat.id ? "#C9A84C" : "#E2D8C0"}`,
                    background: activeCategory === cat.id ? "#C9A84C" : "transparent",
                    color: activeCategory === cat.id ? "#1A1614" : "#8B7355",
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: activeCategory === cat.id ? 600 : 400,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#B09878", fontFamily: "Cinzel, serif", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
              Memuat berita...
            </div>
          ) : posts.length === 0 && announcements.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", color: "#8B7355", fontStyle: "italic" }}>
                Tidak ada berita yang ditemukan.
              </p>
              <p style={{ fontSize: "0.85rem", color: "#B09878", marginTop: "0.5rem" }}>
                Coba ubah kata kunci pencarian atau pilih kategori lain.
              </p>
            </div>
          ) : (
            <div
              ref={cardsRef}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}
            >
              {(activeCategory === "all" || activeCategory === "pengumuman") && announcements.map((ann) => (
                <div key={`ann-${ann.id}`} className="berita-card card" style={{ padding: "1.5rem", borderLeft: ann.priority === "high" ? "4px solid #C9A84C" : "4px solid #E2D8C0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <span style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.65rem", fontFamily: "Cinzel, serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Pengumuman Paroki
                    </span>
                    {ann.priority === "high" && (
                      <span style={{ background: "rgba(180,60,60,0.1)", color: "#b43c3c", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.65rem", fontFamily: "Cinzel, serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        Penting
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 600, color: "#1A1614", marginBottom: "0.75rem", lineHeight: 1.4 }}>
                    {ann.title}
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "#8B7355", lineHeight: 1.6 }}>
                    {ann.content}
                  </p>
                </div>
              ))}

              {posts.map((post, i) => (
                <Link key={post.id} href={`/berita/${post.slug}`} style={{ textDecoration: "none" }} className="berita-card">
                  <div className="news-card">
                    <div
                      style={{
                        background: post.coverImage ? undefined : gradients[i % gradients.length],
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
                        <span style={{ fontFamily: "serif", fontSize: "5rem", color: "#8B7355", opacity: 0.1 }}>✝</span>
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
                      {post.isFeatured && (
                        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                          <span
                            style={{
                              background: "rgba(201,168,76,0.9)",
                              color: "#1A1614",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "999px",
                              fontSize: "0.6rem",
                              fontFamily: "Cinzel, serif",
                              textTransform: "uppercase",
                              fontWeight: 600,
                            }}
                          >
                            ★ Pilihan
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ padding: "1.5rem" }}>
                      <h2
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
                      </h2>
                      <p style={{ fontSize: "0.85rem", color: "#8B7355", lineHeight: 1.6, marginBottom: "1rem" }}>
                        {post.excerpt?.substring(0, 120)}...
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "#B09878" }}>
                          <Calendar size={12} />
                          <span>{formatDateShort(post.publishedAt || post.createdAt || "")}</span>
                        </div>
                        <span style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", color: "#C9A84C", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          Baca →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
