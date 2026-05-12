"use client";
// src/components/sections/BeritaDetail.tsx
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { mockPosts } from "@/lib/mock-data";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null | undefined;
  content: string;
  coverImage: string | null;
  category: { id: number; name: string; slug: string; color: string | null } | null;
  author: { name: string } | null;
  status: string;
  isFeatured: boolean | null;
  publishedAt: Date | null;
  createdAt?: Date | null;
}

export function BeritaDetail({ post }: { post: Post }) {
  const related = mockPosts
    .filter((p) => p.id !== post.id && post.category && p.category.slug === post.category.slug)
    .slice(0, 3);

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div className="container-main">
          <Link
            href="/berita"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "Cinzel, serif",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "rgba(201,168,76,0.7)",
              textDecoration: "none",
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            <ArrowLeft size={14} /> Kembali ke Berita
          </Link>

          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <span
              style={{
              background: post.category?.color || "#C9A84C",
              color: "#FFF",
              padding: "0.3rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.7rem",
              fontFamily: "Cinzel, serif",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {post.category?.name || "Umum"}
          </span>
            {post.isFeatured && (
              <span
                style={{
                  background: "rgba(201,168,76,0.2)",
                  border: "1px solid rgba(201,168,76,0.4)",
                  color: "#C9A84C",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  fontFamily: "Cinzel, serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                ★ Pilihan Utama
              </span>
            )}
          </div>

          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              color: "#FDFAF4",
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: "800px",
              marginBottom: "1.5rem",
            }}
          >
            {post.title}
          </h1>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <User size={14} style={{ color: "rgba(201,168,76,0.6)" }} />
              <span style={{ fontSize: "0.85rem", color: "rgba(253,250,244,0.6)" }}>
                {post.author?.name || "Admin"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Calendar size={14} style={{ color: "rgba(201,168,76,0.6)" }} />
              <span style={{ fontSize: "0.85rem", color: "rgba(253,250,244,0.6)" }}>
                {formatDate(post.publishedAt || post.createdAt || new Date())}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article */}
      <div style={{ background: "#FDFAF4", paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div className="container-main">
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            {/* Excerpt */}
            {post.excerpt && (
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.2rem",
                  fontStyle: "italic",
                  color: "#8B7355",
                  lineHeight: 1.7,
                  borderLeft: "3px solid #C9A84C",
                  paddingLeft: "1.5rem",
                  marginBottom: "2.5rem",
                }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="prose-sacred"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share / back */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "3rem",
                marginTop: "3rem",
                borderTop: "1px solid #E2D8C0",
              }}
            >
              <Link href="/berita" className="btn-outline" style={{ borderColor: "#C9A84C", color: "#C9A84C" }}>
                ← Kembali
              </Link>
              <span style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", color: "#B09878", letterSpacing: "0.1em" }}>
                Semoga bermanfaat ✝
              </span>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ marginTop: "5rem" }}>
              <h3
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.5rem",
                  color: "#1A1614",
                  marginBottom: "2rem",
                }}
              >
                Berita Terkait
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {related.map((r) => (
                  <Link key={r.id} href={`/berita/${r.slug}`} style={{ textDecoration: "none" }}>
                    <div
                      className="card"
                      style={{ padding: "1.5rem" }}
                    >
                      <span
                        style={{
                          fontFamily: "Cinzel, serif",
                          fontSize: "0.6rem",
                          color: "#C9A84C",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {r.category.name}
                      </span>
                      <h4
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontSize: "0.95rem",
                          color: "#1A1614",
                          lineHeight: 1.4,
                          marginBottom: "0.5rem",
                        }}
                      >
                        {r.title}
                      </h4>
                      <span style={{ fontSize: "0.75rem", color: "#B09878" }}>
                        {formatDate(r.publishedAt, { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
