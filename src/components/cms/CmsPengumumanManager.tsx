"use client";
// src/components/cms/CmsPengumumanManager.tsx
import { useState } from "react";
import { Plus, Edit, Trash2, X, Check, Bell, BellOff } from "lucide-react";
import { useEffect } from "react";
interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: "low" | "normal" | "high";
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

const PRIORITY_LABELS: Record<string, string> = { low: "Rendah", normal: "Normal", high: "Penting" };
const PRIORITY_COLORS: Record<string, string> = { low: "#B09878", normal: "#8B7355", high: "#C9A84C" };
const PRIORITY_BG: Record<string, string> = { low: "rgba(176,152,120,0.1)", normal: "rgba(139,115,85,0.1)", high: "rgba(201,168,76,0.1)" };

export function CmsPengumumanManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnnouncements(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Announcement, "id">>({
    title: "", content: "", priority: "normal", isActive: true, startDate: "", endDate: "",
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const openNew = () => {
    setEditingId(null);
    setForm({ title: "", content: "", priority: "normal", isActive: true, startDate: "", endDate: "" });
    setShowForm(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingId(a.id);
    setForm({ title: a.title, content: a.content, priority: a.priority, isActive: a.isActive, startDate: a.startDate || "", endDate: a.endDate || "" });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { showToast("Judul wajib diisi"); return; }
    setSaving(true);
    try {
      if (editingId) {
        await fetch(`/api/announcements/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        setAnnouncements((prev) => prev.map((a) => a.id === editingId ? { ...a, ...form } : a));
        showToast("Pengumuman diperbarui ✓");
      } else {
        await fetch("/api/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        setAnnouncements((prev) => [{ id: Date.now(), ...form }, ...prev]);
        showToast("Pengumuman ditambahkan ✓");
      }
      setShowForm(false);
    } catch { showToast("Gagal menyimpan"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pengumuman ini?")) return;
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast("Dihapus ✓");
  };

  const toggleActive = async (id: number, current: boolean) => {
    await fetch(`/api/announcements/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !current }) });
    setAnnouncements((prev) => prev.map((a) => a.id === id ? { ...a, isActive: !current } : a));
  };

  return (
    <div style={{ padding: "2.5rem" }}>
      {toast && (
        <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999, background: "rgba(107,124,94,0.95)", color: "#FDFAF4", padding: "1rem 1.25rem", borderRadius: "0.75rem", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Check size={16} /> {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", color: "#1A1614", fontWeight: 700 }}>Pengumuman</h1>
          <p style={{ fontSize: "0.875rem", color: "#8B7355", marginTop: "0.25rem" }}>
            {announcements.filter((a) => a.isActive).length} aktif dari {announcements.length} total
          </p>
        </div>
        <button onClick={openNew} className="btn-gold"><Plus size={16} /> Tambah Pengumuman</button>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,22,20,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="card" style={{ width: "100%", maxWidth: "520px", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", color: "#1A1614" }}>{editingId ? "Edit Pengumuman" : "Pengumuman Baru"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8B7355" }}><X size={20} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Judul *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="input-sacred" placeholder="Judul pengumuman..." />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Konten</label>
                <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className="input-sacred" rows={4} style={{ resize: "vertical" }} placeholder="Isi pengumuman selengkapnya..." />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Prioritas</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["low", "normal", "high"] as const).map((p) => (
                    <button key={p} type="button" onClick={() => setForm((f) => ({ ...f, priority: p }))} style={{ flex: 1, padding: "0.6rem", borderRadius: "0.4rem", border: `1px solid ${form.priority === p ? PRIORITY_COLORS[p] : "#E2D8C0"}`, background: form.priority === p ? PRIORITY_BG[p] : "transparent", color: form.priority === p ? PRIORITY_COLORS[p] : "#8B7355", fontFamily: "Cinzel, serif", fontSize: "0.65rem", textTransform: "uppercase", cursor: "pointer", fontWeight: form.priority === p ? 600 : 400 }}>
                      {PRIORITY_LABELS[p]}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Mulai Tampil</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="input-sacred" />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Berakhir</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="input-sacred" />
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} style={{ accentColor: "#C9A84C", width: 16, height: 16 }} />
                <span style={{ fontSize: "0.875rem", color: "#1A1614" }}>Tampilkan pengumuman ini</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "0.75rem", borderRadius: "0.4rem", border: "1px solid #E2D8C0", background: "transparent", color: "#8B7355", cursor: "pointer", fontFamily: "Cinzel, serif", fontSize: "0.7rem", textTransform: "uppercase" }}>Batal</button>
              <button type="button" onClick={handleSave} disabled={saving} className="btn-gold" style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {announcements.map((ann) => (
          <div key={ann.id} className="card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start", opacity: ann.isActive ? 1 : 0.6, borderLeft: ann.priority === "high" ? `3px solid ${PRIORITY_COLORS.high}` : undefined }}>
            <div style={{ width: 40, height: 40, borderRadius: "0.5rem", background: PRIORITY_BG[ann.priority], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bell size={18} style={{ color: PRIORITY_COLORS[ann.priority] }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", color: "#1A1614", fontWeight: 600 }}>{ann.title}</h3>
                <span style={{ background: PRIORITY_BG[ann.priority], color: PRIORITY_COLORS[ann.priority], border: `1px solid ${PRIORITY_COLORS[ann.priority]}40`, padding: "0.1rem 0.4rem", borderRadius: "999px", fontFamily: "Cinzel, serif", fontSize: "0.55rem", textTransform: "uppercase", fontWeight: 600, flexShrink: 0 }}>
                  {PRIORITY_LABELS[ann.priority]}
                </span>
                {!ann.isActive && <span style={{ background: "#F5F0E4", color: "#B09878", border: "1px solid #E2D8C0", padding: "0.1rem 0.4rem", borderRadius: "999px", fontSize: "0.55rem", fontFamily: "Cinzel, serif", textTransform: "uppercase" }}>Non-aktif</span>}
              </div>
              {ann.content && <p style={{ fontSize: "0.85rem", color: "#8B7355", lineHeight: 1.5 }}>{ann.content}</p>}
            </div>

            <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
              <button onClick={() => toggleActive(ann.id, ann.isActive)} style={{ width: 32, height: 32, borderRadius: "0.4rem", border: "1px solid #E2D8C0", background: ann.isActive ? "rgba(107,124,94,0.1)" : "#F5F0E4", color: ann.isActive ? "#6B7C5E" : "#B09878", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title={ann.isActive ? "Non-aktifkan" : "Aktifkan"}>
                {ann.isActive ? <Bell size={14} /> : <BellOff size={14} />}
              </button>
              <button onClick={() => openEdit(ann)} style={{ width: 32, height: 32, borderRadius: "0.4rem", border: "1px solid rgba(201,168,76,0.25)", background: "rgba(201,168,76,0.1)", color: "#C9A84C", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Edit size={14} />
              </button>
              <button onClick={() => handleDelete(ann.id)} style={{ width: 32, height: 32, borderRadius: "0.4rem", border: "1px solid rgba(180,60,60,0.2)", background: "rgba(180,60,60,0.08)", color: "#b43c3c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
