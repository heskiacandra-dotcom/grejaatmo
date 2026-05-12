"use client";
// src/components/cms/CmsWartaManager.tsx
import { useState, useRef } from "react";
import { Plus, Upload, Trash2, Download, FileText, Calendar, X, Check } from "lucide-react";
import { useEffect } from "react";
import { formatDate } from "@/lib/utils";

interface WartaItem {
  id: number;
  title: string;
  editionDate: Date | string;
  fileUrl: string;
  description?: string | null;
}

export function CmsWartaManager() {
  const [wartas, setWartas] = useState<WartaItem[]>([]);

  useEffect(() => {
    fetch("/api/warta")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWartas(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    editionDate: "",
    description: "",
    file: null as File | null,
    fileUrl: "",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setForm((p) => ({ ...p, file: f, title: p.title || f.name.replace(".pdf", "") }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.editionDate) {
      showToast("Judul dan tanggal wajib diisi");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("editionDate", form.editionDate);
      fd.append("description", form.description);
      if (form.file) fd.append("file", form.file);

      const res = await fetch("/api/warta", { method: "POST", body: fd });
      const data = await res.json();

      if (data.success) {
        const newItem: WartaItem = {
          id: Date.now(),
          title: form.title,
          editionDate: new Date(form.editionDate),
          fileUrl: data.fileUrl || "#",
          description: form.description,
        };
        setWartas((prev) => [newItem, ...prev]);
        setForm({ title: "", editionDate: "", description: "", file: null, fileUrl: "" });
        setShowForm(false);
        showToast("Warta berhasil diunggah ✓");
      } else {
        showToast(data.error || "Gagal mengunggah warta");
      }
    } catch {
      showToast("Terjadi kesalahan. Coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus warta ini?")) return;
    setWartas((prev) => prev.filter((w) => w.id !== id));
    showToast("Warta dihapus ✓");
  };

  return (
    <div style={{ padding: "2.5rem" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999, background: "rgba(107,124,94,0.95)", color: "#FDFAF4", padding: "1rem 1.25rem", borderRadius: "0.75rem", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Check size={16} /> {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", color: "#1A1614", fontWeight: 700 }}>Warta Paroki</h1>
          <p style={{ fontSize: "0.875rem", color: "#8B7355", marginTop: "0.25rem" }}>{wartas.length} edisi tersedia</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-gold">
          <Upload size={16} /> Upload Warta Baru
        </button>
      </div>

      {/* Upload Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,22,20,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="card" style={{ width: "100%", maxWidth: "500px", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", color: "#1A1614" }}>Upload Warta Paroki</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8B7355" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* File upload zone */}
              <div
                onClick={() => fileRef.current?.click()}
                style={{ border: "2px dashed #E2D8C0", borderRadius: "0.75rem", padding: "2rem", textAlign: "center", cursor: "pointer", background: form.file ? "rgba(107,124,94,0.05)" : "#F5F0E4", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E2D8C0")}
              >
                {form.file ? (
                  <>
                    <FileText size={32} style={{ color: "#C9A84C", margin: "0 auto 0.5rem" }} />
                    <p style={{ fontSize: "0.9rem", color: "#1A1614", fontWeight: 600 }}>{form.file.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#8B7355" }}>{(form.file.size / 1024).toFixed(1)} KB</p>
                  </>
                ) : (
                  <>
                    <Upload size={32} style={{ color: "#B09878", margin: "0 auto 0.5rem" }} />
                    <p style={{ fontSize: "0.875rem", color: "#8B7355" }}>Klik untuk pilih file PDF</p>
                    <p style={{ fontSize: "0.75rem", color: "#B09878", marginTop: "0.25rem" }}>Format: PDF • Maks 20MB</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFileChange} />

              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Judul Edisi *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="input-sacred" placeholder="Warta Paroki Minggu, 4 Mei 2025" required />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Tanggal Edisi *</label>
                <input type="date" value={form.editionDate} onChange={(e) => setForm((p) => ({ ...p, editionDate: e.target.value }))} className="input-sacred" required />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Keterangan / Ringkasan Isi (Opsional)</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input-sacred" rows={2} style={{ resize: "vertical" }} placeholder="Tema pekan ini, ringkasan isi warta, dll" />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "0.75rem", borderRadius: "0.4rem", border: "1px solid #E2D8C0", background: "transparent", color: "#8B7355", cursor: "pointer", fontFamily: "Cinzel, serif", fontSize: "0.7rem", textTransform: "uppercase" }}>Batal</button>
                <button type="submit" disabled={uploading} className="btn-gold" style={{ flex: 1, justifyContent: "center", opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? "Mengunggah..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warta list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {wartas.map((w, i) => (
          <div key={w.id} className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "0.75rem", background: i === 0 ? "rgba(201,168,76,0.12)" : "#F5F0E4", border: `1px solid ${i === 0 ? "rgba(201,168,76,0.3)" : "#E2D8C0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileText size={22} style={{ color: i === 0 ? "#C9A84C" : "#B09878" }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                {i === 0 && <span style={{ background: "#C9A84C", color: "#1A1614", fontFamily: "Cinzel, serif", fontSize: "0.5rem", padding: "0.1rem 0.4rem", borderRadius: "999px", fontWeight: 700, textTransform: "uppercase" }}>Terbaru</span>}
              </div>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 600, color: "#1A1614", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.title}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                <Calendar size={11} style={{ color: "#C9A84C" }} />
                <span style={{ fontSize: "0.75rem", color: "#B09878" }}>{formatDate(w.editionDate)}</span>
                {w.description && <span style={{ fontSize: "0.75rem", color: "#B09878" }}>• {w.description}</span>}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
              <a href={w.fileUrl} target="_blank" rel="noreferrer" style={{ width: 36, height: 36, borderRadius: "0.5rem", border: "1px solid rgba(201,168,76,0.25)", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A84C", textDecoration: "none" }} title="Unduh PDF">
                <Download size={16} />
              </a>
              <button onClick={() => handleDelete(w.id)} style={{ width: 36, height: 36, borderRadius: "0.5rem", border: "1px solid rgba(180,60,60,0.2)", background: "rgba(180,60,60,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#b43c3c", cursor: "pointer" }} title="Hapus">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
