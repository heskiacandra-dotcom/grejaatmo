"use client";
// src/components/cms/CmsJadwalManager.tsx
import { useState } from "react";
import { Plus, Edit, Trash2, Clock, Check, X, AlertCircle, MapPin } from "lucide-react";
import { useEffect } from "react";
const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"] as const;
type Day = typeof DAYS[number];

interface Schedule {
  id: number;
  dayOfWeek: Day;
  time: string;
  location: string;
  celebrant?: string;
  notes?: string;
  isActive: boolean;
}

const emptySchedule: Omit<Schedule, "id"> = {
  dayOfWeek: "Minggu",
  time: "07:00",
  location: "Gereja Paroki",
  celebrant: "",
  notes: "",
  isActive: true,
};

export function CmsJadwalManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    fetch("/api/schedules")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSchedules(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Schedule, "id">>(emptySchedule);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openEdit = (s: Schedule) => {
    setEditingId(s.id);
    setFormData({ dayOfWeek: s.dayOfWeek, time: s.time, location: s.location, celebrant: s.celebrant, notes: s.notes, isActive: s.isActive });
    setShowForm(true);
  };

  const openNew = () => {
    setEditingId(null);
    setFormData(emptySchedule);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.time || !formData.location) {
      showToast("Waktu dan lokasi wajib diisi");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        // PUT /api/schedules/:id
        await fetch(`/api/schedules/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        setSchedules((prev) => prev.map((s) => s.id === editingId ? { ...s, ...formData } : s));
        showToast("Jadwal berhasil diperbarui ✓");
      } else {
        // POST /api/schedules
        await fetch("/api/schedules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const newId = Date.now();
        setSchedules((prev) => [...prev, { id: newId, ...formData }]);
        showToast("Jadwal berhasil ditambahkan ✓");
      }
      setShowForm(false);
    } catch {
      showToast("Gagal menyimpan jadwal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus jadwal ini?")) return;
    try {
      await fetch(`/api/schedules/${id}`, { method: "DELETE" });
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      showToast("Jadwal dihapus ✓");
    } catch {
      showToast("Gagal menghapus jadwal");
    }
  };

  const toggleActive = async (id: number, current: boolean) => {
    try {
      await fetch(`/api/schedules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      setSchedules((prev) => prev.map((s) => s.id === id ? { ...s, isActive: !current } : s));
    } catch {
      showToast("Gagal mengubah status");
    }
  };

  // Group by day
  const grouped = DAYS.map((day) => ({
    day,
    schedules: schedules.filter((s) => s.dayOfWeek === day),
  }));

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
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", color: "#1A1614", fontWeight: 700 }}>
            Jadwal Perayaan Misa
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#8B7355", marginTop: "0.25rem" }}>
            {schedules.filter((s) => s.isActive).length} jadwal aktif
          </p>
        </div>
        <button onClick={openNew} className="btn-gold">
          <Plus size={16} />
          Tambah Jadwal
        </button>
      </div>

      {/* Modal form */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,22,20,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="card" style={{ width: "100%", maxWidth: "480px", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", color: "#1A1614" }}>
                {editingId ? "Edit Jadwal" : "Jadwal Baru"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8B7355" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Hari</label>
                <select value={formData.dayOfWeek} onChange={(e) => setFormData((p) => ({ ...p, dayOfWeek: e.target.value as Day }))} className="input-sacred">
                  {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Waktu (WIB) *</label>
                <input type="time" value={formData.time} onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))} className="input-sacred" />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Lokasi *</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} className="input-sacred" placeholder="Gereja Paroki" />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Selebran</label>
                <input type="text" value={formData.celebrant} onChange={(e) => setFormData((p) => ({ ...p, celebrant: e.target.value }))} className="input-sacred" placeholder="Rm. Nama Pastor, Pr" />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>Catatan</label>
                <input type="text" value={formData.notes} onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))} className="input-sacred" placeholder="Misal: Misa Vigili, dll" />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))} style={{ accentColor: "#C9A84C", width: 16, height: 16 }} />
                <span style={{ fontSize: "0.875rem", color: "#1A1614" }}>Jadwal Aktif</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "0.75rem", borderRadius: "0.4rem", border: "1px solid #E2D8C0", background: "transparent", color: "#8B7355", cursor: "pointer", fontFamily: "Cinzel, serif", fontSize: "0.7rem", textTransform: "uppercase" }}>
                Batal
              </button>
              <button type="button" onClick={handleSave} disabled={saving} className="btn-gold" style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule grid by day */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {grouped.map(({ day, schedules: daySchedules }) => (
          <div key={day} className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1A1614", fontWeight: 600 }}>
                {day}
              </h2>
              <span style={{ fontFamily: "Cinzel, serif", fontSize: "0.6rem", color: "#B09878" }}>
                {daySchedules.filter((s) => s.isActive).length} aktif
              </span>
            </div>

            {daySchedules.length === 0 ? (
              <p style={{ fontSize: "0.82rem", color: "#B09878", fontStyle: "italic", marginBottom: "1rem" }}>
                Belum ada jadwal
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "0.75rem" }}>
                {daySchedules.map((s) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "0.5rem", background: s.isActive ? "#F5F0E4" : "#FAFAFA", border: `1px solid ${s.isActive ? "#E2D8C0" : "#F0ECE0"}`, opacity: s.isActive ? 1 : 0.6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.2rem" }}>
                        <Clock size={12} style={{ color: "#C9A84C" }} />
                        <span style={{ fontFamily: "Cinzel, serif", fontSize: "0.9rem", fontWeight: 700, color: "#1A1614" }}>{s.time} WIB</span>
                      </div>
                      {s.celebrant && <p style={{ fontSize: "0.72rem", color: "#8B7355" }}>{s.celebrant}</p>}
                      {s.location && (
                        <p style={{ fontSize: "0.68rem", color: "#C9A84C", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.1rem" }}>
                          <MapPin size={10} /> {s.location}
                        </p>
                      )}
                      {s.notes && <p style={{ fontSize: "0.68rem", color: "#B09878", fontStyle: "italic" }}>{s.notes}</p>}
                    </div>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button onClick={() => toggleActive(s.id, s.isActive)} style={{ width: 28, height: 28, borderRadius: "0.375rem", border: "1px solid #E2D8C0", background: s.isActive ? "rgba(107,124,94,0.1)" : "#F5F0E4", color: s.isActive ? "#6B7C5E" : "#B09878", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title={s.isActive ? "Non-aktifkan" : "Aktifkan"}>
                        <Check size={12} />
                      </button>
                      <button onClick={() => openEdit(s)} style={{ width: 28, height: 28, borderRadius: "0.375rem", border: "1px solid rgba(201,168,76,0.25)", background: "rgba(201,168,76,0.1)", color: "#C9A84C", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Edit size={12} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} style={{ width: 28, height: 28, borderRadius: "0.375rem", border: "1px solid rgba(180,60,60,0.2)", background: "rgba(180,60,60,0.08)", color: "#b43c3c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => { setFormData({ ...emptySchedule, dayOfWeek: day }); setEditingId(null); setShowForm(true); }}
              style={{ width: "100%", padding: "0.5rem", border: "1px dashed #E2D8C0", borderRadius: "0.5rem", background: "transparent", color: "#B09878", cursor: "pointer", fontSize: "0.75rem", fontFamily: "Cinzel, serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2D8C0"; e.currentTarget.style.color = "#B09878"; }}
            >
              <Plus size={13} /> Tambah jadwal {day}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
