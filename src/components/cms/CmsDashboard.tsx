"use client";
// src/components/cms/CmsDashboard.tsx
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Newspaper,
  Clock,
  BookOpen,
  Bell,
  Users,
  TrendingUp,
  Plus,
  Eye,
  ChevronRight,
} from "lucide-react";
import { formatDateShort } from "@/lib/utils";

interface User {
  name?: string | null;
  email?: string | null;
}

export function CmsDashboard({ user }: { user: User | undefined }) {
  const statsRef = useRef<HTMLDivElement>(null);

  const [statsData, setStatsData] = useState({
    posts: 0,
    schedules: 0,
    warta: 0,
    announcements: 0,
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [activeAnnouncements, setActiveAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/posts").then((res) => res.json()),
      fetch("/api/schedules").then((res) => res.json()),
      fetch("/api/warta").then((res) => res.json()),
      fetch("/api/announcements").then((res) => res.json()),
    ]).then(([postsRes, schedRes, wartaRes, annRes]) => {
      const posts = postsRes.success ? postsRes.data : [];
      const sched = schedRes.success ? schedRes.data : [];
      const warta = wartaRes.success ? wartaRes.data : [];
      const anns = annRes.success ? annRes.data : [];

      setStatsData({
        posts: posts.filter((p: any) => p.status === "published").length,
        schedules: sched.filter((s: any) => s.isActive).length,
        warta: warta.length,
        announcements: anns.filter((a: any) => a.isActive).length,
      });

      setRecentPosts(posts.slice(0, 4));
      setActiveAnnouncements(anns.filter((a: any) => a.isActive));
    });
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".dashboard-stat",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }
    );
    gsap.fromTo(
      ".dashboard-section",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.3 }
    );
  }, [statsData]); // Re-trigger animation when data loads


  const stats = [
    {
      label: "Total Berita",
      value: statsData.posts,
      icon: Newspaper,
      color: "#C9A84C",
      bg: "rgba(201,168,76,0.1)",
      href: "/cms/berita",
    },
    {
      label: "Jadwal Misa",
      value: statsData.schedules,
      icon: Clock,
      color: "#7C9C6E",
      bg: "rgba(124,156,110,0.1)",
      href: "/cms/jadwal",
    },
    {
      label: "Warta Terbit",
      value: statsData.warta,
      icon: BookOpen,
      color: "#6B9BC9",
      bg: "rgba(107,155,201,0.1)",
      href: "/cms/warta",
    },
    {
      label: "Pengumuman Aktif",
      value: statsData.announcements,
      icon: Bell,
      color: "#9B6B9B",
      bg: "rgba(155,107,155,0.1)",
      href: "/cms/pengumuman",
    },
  ];

  const quickActions = [
    { label: "Tulis Berita", href: "/cms/berita/new", icon: Plus, desc: "Tambah artikel baru" },
    { label: "Upload Warta", href: "/cms/warta/new", icon: Plus, desc: "Edisi warta baru" },
    { label: "Pengumuman", href: "/cms/pengumuman/new", icon: Plus, desc: "Tambah pengumuman" },
    { label: "Lihat Website", href: "/", icon: Eye, desc: "Buka halaman publik" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam";

  return (
    <div style={{ padding: "clamp(1rem, 5vw, 2.5rem)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "#C9A84C",
            textTransform: "uppercase",
            marginBottom: "0.4rem",
          }}
        >
          {greeting}
        </p>
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "#1A1614",
            fontWeight: 700,
          }}
        >
          {user?.name ? `Halo, ${user.name}` : "Dashboard CMS"}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#8B7355", marginTop: "0.25rem" }}>
          Kelola konten website Paroki Keluarga Kudus Atmodirono
        </p>
      </div>

      {/* Stats */}
      <div
        ref={statsRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} style={{ textDecoration: "none" }}>
            <div
              className="dashboard-stat card"
              style={{
                height: "100%",
                padding: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "0.75rem",
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: "Cinzel, serif", fontSize: "0.55rem", color: "#B09878", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "#1A1614",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Quick actions */}
        <div className="dashboard-section card" style={{ padding: "clamp(1.25rem, 3vw, 1.75rem)" }}>
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.1rem",
              color: "#1A1614",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <TrendingUp size={18} style={{ color: "#C9A84C" }} />
            Aksi Cepat
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {quickActions.map(({ label, href, icon: Icon, desc }) => (
              <Link
                key={label}
                href={href}
                target={href === "/" ? "_blank" : undefined}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    padding: "0.875rem",
                    borderRadius: "0.5rem",
                    background: "#F5F0E4",
                    border: "1px solid #E2D8C0",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "0.5rem",
                      background: "rgba(201,168,76,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} style={{ color: "#C9A84C" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", color: "#1A1614", fontWeight: 600, letterSpacing: "0.05em" }}>
                      {label}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "#B09878", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{desc}</p>
                  </div>
                  <ChevronRight size={15} style={{ color: "#B09878" }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent posts */}
        <div className="dashboard-section card" style={{ padding: "clamp(1.25rem, 3vw, 1.75rem)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", color: "#1A1614", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Newspaper size={18} style={{ color: "#C9A84C" }} />
              Berita Terbaru
            </h2>
            <Link href="/cms/berita" style={{ fontSize: "0.7rem", color: "#C9A84C", textDecoration: "none", fontFamily: "Cinzel, serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Kelola →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentPosts.length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "#B09878" }}>Belum ada berita</p>
            ) : recentPosts.map((post: any) => (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  background: "#F5F0E4",
                  border: "1px solid #E2D8C0",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: post.status === "published" ? "#7C9C6E" : "#B09878",
                    marginTop: "0.35rem",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.85rem", color: "#1A1614", fontWeight: 500, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {post.title}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#B09878", marginTop: "0.2rem" }}>
                    {formatDateShort(post.publishedAt)}
                  </p>
                </div>
                <Link
                  href={`/cms/berita/${post.id}/edit`}
                  style={{ fontSize: "0.65rem", color: "#C9A84C", textDecoration: "none", flexShrink: 0, fontFamily: "Cinzel, serif" }}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="dashboard-section card" style={{ padding: "clamp(1.25rem, 3vw, 1.75rem)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", color: "#1A1614", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Bell size={18} style={{ color: "#C9A84C" }} />
              Pengumuman Aktif
            </h2>
            <Link href="/cms/pengumuman" style={{ fontSize: "0.7rem", color: "#C9A84C", textDecoration: "none", fontFamily: "Cinzel, serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Kelola →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {activeAnnouncements.length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "#B09878" }}>Belum ada pengumuman</p>
            ) : activeAnnouncements.map((ann: any) => (
              <div
                key={ann.id}
                style={{
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  background: ann.priority === "high" ? "rgba(201,168,76,0.08)" : "#F5F0E4",
                  border: `1px solid ${ann.priority === "high" ? "rgba(201,168,76,0.25)" : "#E2D8C0"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <p style={{ fontSize: "0.85rem", color: "#1A1614", fontWeight: 500, lineHeight: 1.3, flex: 1, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {ann.title}
                  </p>
                  {ann.priority === "high" && (
                    <span
                      style={{
                        background: "#C9A84C",
                        color: "#1A1614",
                        fontSize: "0.55rem",
                        fontFamily: "Cinzel, serif",
                        padding: "0.15rem 0.4rem",
                        borderRadius: "999px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      Penting
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
