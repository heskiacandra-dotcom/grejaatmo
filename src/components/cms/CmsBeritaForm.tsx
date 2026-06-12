"use client";
// src/components/cms/CmsBeritaForm.tsx
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TiptapEditor } from "./TiptapEditor";
import { ArrowLeft, Save, Eye, Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { mockPosts } from "@/lib/mock-data";

const CATEGORIES = [
  { id: 1, name: "Kegiatan Paroki", slug: "kegiatan-paroki" },
  { id: 2, name: "Kaum Muda", slug: "kaum-muda" },
  { id: 3, name: "Sosial", slug: "sosial" },
  { id: 4, name: "Iman & Spiritualitas", slug: "iman-spiritualitas" },
  { id: 5, name: "Pengumuman", slug: "pengumuman" },
];

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  categoryId: number | null;
  status: "draft" | "published";
  isFeatured: boolean;
  coverImage: string;
}

interface CmsBeritaFormProps {
  initialData?: Partial<FormData & { id: number }>;
  mode: "new" | "edit";
}

export function CmsBeritaForm({ initialData, mode }: CmsBeritaFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState<FormData>({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    categoryId: initialData?.categoryId || null,
    status: initialData?.status || "draft",
    isFeatured: initialData?.isFeatured || false,
    coverImage: initialData?.coverImage || "",
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "berita");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, coverImage: data.url }));
        showToast("success", "Gambar berhasil diunggah");
      } else {
        showToast("error", data.error || "Gagal mengunggah gambar");
      }
    } catch {
      showToast("error", "Gagal mengunggah gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (statusOverride?: "draft" | "published") => {
    if (!form.title.trim()) {
      showToast("error", "Judul berita wajib diisi");
      return;
    }
    if (!form.content.trim() || form.content === "<p></p>") {
      showToast("error", "Konten berita wajib diisi");
      return;
    }

    setSaving(true);
    try {
      // Auto-generate excerpt from content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = form.content;
      const textContent = tempDiv.textContent || tempDiv.innerText || "";
      const generatedExcerpt = textContent.slice(0, 150).trim() + (textContent.length > 150 ? "..." : "");

      const payload = { ...form, excerpt: generatedExcerpt, status: statusOverride || form.status };
      const url = mode === "edit" ? `/api/posts/${initialData?.id}` : "/api/posts";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", mode === "edit" ? "Berita berhasil diperbarui" : "Berita berhasil dibuat");
        setTimeout(() => router.push("/cms/berita"), 1500);
      } else {
        showToast("error", data.error || "Gagal menyimpan berita");
      }
    } catch {
      showToast("error", "Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "2.5rem", minHeight: "100vh" }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
            borderRadius: "0.75rem",
            background: toast.type === "success" ? "rgba(107,124,94,0.95)" : "rgba(180,60,60,0.95)",
            color: "#FDFAF4",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            backdropFilter: "blur(12px)",
            maxWidth: "360px",
          }}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: "0.875rem" }}>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <Link href="/cms/berita" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.12em", color: "#C9A84C", textDecoration: "none", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <ArrowLeft size={14} /> Kembali ke Daftar Berita
          </Link>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", color: "#1A1614", fontWeight: 700 }}>
            {mode === "new" ? "Tulis Berita Baru" : "Edit Berita"}
          </h1>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={saving}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 1.25rem", borderRadius: "0.4rem",
              border: "1px solid #E2D8C0", background: "#F5F0E4",
              color: "#8B7355", fontFamily: "Cinzel, serif", fontSize: "0.7rem",
              letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            <Save size={14} />
            Simpan Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={saving}
            className="btn-gold"
            style={{ opacity: saving ? 0.6 : 1 }}
          >
            <Eye size={14} />
            {saving ? "Menyimpan..." : "Terbitkan"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>
        {/* Main editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Title */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Judul Berita *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Masukkan judul berita yang menarik..."
              className="input-sacred"
              style={{ fontSize: "1.1rem", fontFamily: "Playfair Display, serif", fontWeight: 600 }}
            />
          </div>

          {/* Content editor */}
          <div className="card" style={{ overflow: "visible" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E2D8C0" }}>
              <label style={{ fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#C9A84C", textTransform: "uppercase" }}>
                Konten Berita *
              </label>
            </div>
            <TiptapEditor
              content={form.content}
              onChange={(c) => setForm((p) => ({ ...p, content: c }))}
            />
          </div>
        </div>

        {/* Sidebar settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "sticky", top: "1.5rem" }}>
          {/* Status */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem" }}>
              Status Berita
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {(["draft", "published"] as const).map((s) => (
                <label key={s} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", padding: "0.6rem", borderRadius: "0.4rem", background: form.status === s ? "rgba(201,168,76,0.1)" : "transparent", border: `1px solid ${form.status === s ? "rgba(201,168,76,0.3)" : "transparent"}` }}>
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => setForm((p) => ({ ...p, status: s }))}
                    style={{ accentColor: "#C9A84C" }}
                  />
                  <span style={{ color: "#1A1614", fontFamily: "Cinzel, serif", fontSize: "0.75rem" }}>
                    {s === "draft" ? "📝 Draft" : "✅ Terbit"}
                  </span>
                </label>
              ))}
            </div>

            <div style={{ height: "1px", background: "#E2D8C0", margin: "1rem 0" }} />

            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                style={{ accentColor: "#C9A84C", width: 16, height: 16 }}
              />
              <span style={{ fontSize: "0.875rem", color: "#1A1614" }}>
                ⭐ Tampilkan sebagai Pilihan Utama
              </span>
            </label>
          </div>

          {/* Category */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem" }}>
              Kategori
            </h3>
            <select
              value={form.categoryId || ""}
              onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value ? parseInt(e.target.value) : null }))}
              className="input-sacred"
            >
              <option value="">— Pilih Kategori —</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Cover Image */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", marginBottom: "1rem" }}>
              Gambar Sampul
            </h3>

            {form.coverImage ? (
              <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.coverImage}
                  alt="Cover"
                  style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "0.5rem", border: "1px solid #E2D8C0" }}
                />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, coverImage: "" }))}
                  style={{
                    position: "absolute", top: "0.5rem", right: "0.5rem",
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(180,60,60,0.9)", color: "#FFF",
                    border: "none", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #E2D8C0", borderRadius: "0.5rem",
                  padding: "2rem", textAlign: "center", cursor: "pointer",
                  background: "#F5F0E4", marginBottom: "0.75rem",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E2D8C0")}
              >
                {uploadingImage ? (
                  <p style={{ fontSize: "0.85rem", color: "#8B7355" }}>Mengunggah...</p>
                ) : (
                  <>
                    <Upload size={24} style={{ color: "#B09878", margin: "0 auto 0.5rem" }} />
                    <p style={{ fontSize: "0.8rem", color: "#8B7355" }}>Klik untuk unggah gambar</p>
                    <p style={{ fontSize: "0.7rem", color: "#B09878", marginTop: "0.25rem" }}>JPG, PNG, WebP • Maks 500KB</p>
                  </>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />

            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))}
              placeholder="Atau masukkan URL gambar..."
              className="input-sacred"
              style={{ fontSize: "0.8rem" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
