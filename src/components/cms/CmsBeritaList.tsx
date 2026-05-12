"use client";
// src/components/cms/CmsBeritaList.tsx
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Eye, Search, RefreshCw } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  status: "draft" | "published" | "archived";
  isFeatured?: boolean;
  publishedAt?: string;
  createdAt?: string;
  category?: { id: number; name: string; color: string; slug: string };
  author?: { id: string; name: string };
}

export function CmsBeritaList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "100" });
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search) params.set("search", search);

    fetch(`/api/posts?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchPosts, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchPosts]);

  const handleDelete = async (post: Post) => {
    if (!confirm(`Hapus berita "${post.title}"?`)) return;
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        showToast("Berita dihapus ✓");
      } else {
        showToast(data.error || "Gagal menghapus");
      }
    } catch {
      showToast("Gagal menghapus berita");
    }
  };

  return (
    <div style={{ padding: "clamp(1rem, 5vw, 2.5rem)" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999, background: "rgba(107,124,94,0.95)", color: "#FDFAF4", padding: "1rem 1.25rem", borderRadius: "0.75rem", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px" }}>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", color: "#1A1614", fontWeight: 700 }}>Kelola Berita</h1>
          <p style={{ fontSize: "0.875rem", color: "#8B7355", marginTop: "0.25rem" }}>
            {loading ? "Memuat..." : `${posts.length} berita ditemukan`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", width: "100%", justifyContent: "space-between", maxWidth: "none" }} className="sm:w-auto sm:justify-end">
          <button
            onClick={fetchPosts}
            style={{ width: 40, height: 40, borderRadius: "0.5rem", border: "1px solid #E2D8C0", background: "#F5F0E4", color: "#8B7355", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <Link href="/cms/berita/new" className="btn-gold sm:flex-none" style={{ flex: 1, justifyContent: "center" }}>
            <Plus size={16} /> Tulis Berita
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ position: "relative", flex: "1 1 100%", minWidth: "none" }} className="md:flex-1">
          <Search size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#B09878" }} />
          <input
            type="text"
            placeholder="Cari berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-sacred"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", width: "100%", overflowX: "auto", paddingBottom: "0.25rem" }} className="md:w-auto">
          {["all", "published", "draft"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.4rem",
                border: `1px solid ${statusFilter === s ? "#C9A84C" : "#E2D8C0"}`,
                background: statusFilter === s ? "#C9A84C" : "transparent",
                color: statusFilter === s ? "#1A1614" : "#8B7355",
                fontFamily: "Cinzel, serif",
                fontSize: "0.65rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              }}
            >
              {s === "all" ? "Semua" : s === "published" ? "Terbit" : "Draft"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#B09878", fontFamily: "Cinzel, serif", fontSize: "0.8rem" }}>Memuat data...</div>
        ) : (
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
              <thead>
                <tr style={{ background: "#F5F0E4", borderBottom: "1px solid #E2D8C0" }}>
                  {["Judul", "Kategori", "Status", "Tanggal", "Aksi"].map((col) => (
                    <th key={col} style={{ padding: "0.875rem 1rem", textAlign: "left", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", fontWeight: 600 }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    style={{ borderBottom: "1px solid #E2D8C0", transition: "background 0.2s ease" }}
                  >
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        {post.isFeatured && (
                          <span style={{ background: "rgba(201,168,76,0.15)", color: "#A07830", fontSize: "0.6rem", fontFamily: "Cinzel, serif", padding: "0.1rem 0.4rem", borderRadius: "999px", textTransform: "uppercase", flexShrink: 0 }}>
                            ★
                          </span>
                        )}
                        <span style={{ fontSize: "0.9rem", color: "#1A1614", fontWeight: 500, display: "block", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</span>
                      </div>
                      {post.author && (
                        <p style={{ fontSize: "0.75rem", color: "#B09878", marginTop: "0.2rem" }}>oleh {post.author.name}</p>
                      )}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {post.category ? (
                        <span
                          style={{
                            background: (post.category.color || "#C9A84C") + "20",
                            color: post.category.color || "#C9A84C",
                            border: `1px solid ${post.category.color || "#C9A84C"}40`,
                            padding: "0.2rem 0.6rem",
                            borderRadius: "999px",
                            fontSize: "0.7rem",
                            fontFamily: "Cinzel, serif",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {post.category.name}
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#B09878" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          background: post.status === "published" ? "rgba(107,124,94,0.15)" : "rgba(176,152,120,0.15)",
                          color: post.status === "published" ? "#6B7C5E" : "#8B7355",
                          border: `1px solid ${post.status === "published" ? "rgba(107,124,94,0.3)" : "rgba(176,152,120,0.3)"}`,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                          fontSize: "0.65rem",
                          fontFamily: "Cinzel, serif",
                          textTransform: "uppercase",
                        }}
                      >
                        {post.status === "published" ? "Terbit" : "Draft"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "#8B7355", whiteSpace: "nowrap" }}>
                        {formatDateShort(post.publishedAt || post.createdAt || "")}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Link
                          href={`/berita/${post.slug}`}
                          target="_blank"
                          style={{ width: 32, height: 32, borderRadius: "0.4rem", background: "#F5F0E4", border: "1px solid #E2D8C0", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B7355", textDecoration: "none" }}
                          title="Lihat"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          href={`/cms/berita/${post.id}/edit`}
                          style={{ width: 32, height: 32, borderRadius: "0.4rem", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A84C", textDecoration: "none" }}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          style={{ width: 32, height: 32, borderRadius: "0.4rem", background: "rgba(180,60,60,0.08)", border: "1px solid rgba(180,60,60,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#b43c3c", cursor: "pointer" }}
                          title="Hapus"
                          onClick={() => handleDelete(post)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {posts.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: "#B09878" }}>
                <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.1rem" }}>
                  Tidak ada berita yang ditemukan.
                </p>
                <Link href="/cms/berita/new" className="btn-gold" style={{ display: "inline-flex", marginTop: "1rem" }}>
                  <Plus size={15} /> Tulis Berita Pertama
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
