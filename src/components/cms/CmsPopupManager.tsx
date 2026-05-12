"use client";
import { useState, useEffect } from "react";
import { Save, Check, Image as ImageIcon } from "lucide-react";

const Field = ({ label, value, onChange, textarea = false }: any) => (
  <div>
    <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>
      {label}
    </label>
    {textarea ? (
      <textarea value={value || ""} onChange={onChange} className="input-sacred" rows={4} style={{ resize: "vertical" }} />
    ) : (
      <input type="text" value={value || ""} onChange={onChange} className="input-sacred" />
    )}
  </div>
);

export function CmsPopupManager() {
  const [settings, setSettings] = useState<{ popupEnabled: boolean; popupImages: string[] }>({
    popupEnabled: false,
    popupImages: [],
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings((prev) => ({ ...prev, ...data.data }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast("Pop-up berhasil disimpan ✓");
      } else {
        showToast("Gagal menyimpan");
      }
    } catch {
      showToast("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "0 2.5rem 2.5rem", maxWidth: "760px", width: "100%" }}>
      {toast && (
        <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999, background: "rgba(107,124,94,0.95)", color: "#FDFAF4", padding: "1rem 1.25rem", borderRadius: "0.75rem", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Check size={16} /> {toast}
        </div>
      )}

      <div className="card" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", background: "#F5F0E4", padding: "1rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #E2D8C0" }}>
          <input
            type="checkbox"
            id="popupEnabled"
            checked={!!settings.popupEnabled}
            onChange={(e) => setSettings((p) => ({ ...p, popupEnabled: e.target.checked }))}
            style={{ width: "1.2rem", height: "1.2rem", accentColor: "#C9A84C" }}
          />
          <label htmlFor="popupEnabled" style={{ fontFamily: "Cinzel, serif", fontWeight: 600, color: "#1A1614", cursor: "pointer", fontSize: "0.9rem" }}>
            Aktifkan Pop-up Pengumuman di Halaman Utama (Beranda)
          </label>
        </div>
        
        {settings.popupEnabled && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                Poster Pengumuman
              </label>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {(settings.popupImages || []).map((img, idx) => (
                  <div key={idx} style={{ position: "relative", width: 120, height: 120, borderRadius: "0.5rem", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                    <img src={img} alt={`Poster ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      onClick={() => {
                        const newImages = [...settings.popupImages];
                        newImages.splice(idx, 1);
                        setSettings((p) => ({ ...p, popupImages: newImages }));
                      }}
                      style={{ position: "absolute", top: 4, right: 4, background: "rgba(217, 83, 79, 0.9)", color: "white", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px" }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", background: "rgba(253,250,244,0.5)", padding: "1rem", borderRadius: "0.5rem", border: "1px dashed #C9A84C" }}>
                <div style={{ width: 80, height: 80, background: "#E2D8C0", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B7355" }}>
                  <ImageIcon size={24} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#8B7355", fontWeight: 600 }}>Tambah Poster Baru</span>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSaving(true);
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("folder", "popup");
                    fetch("/api/upload", { method: "POST", body: formData })
                      .then((res) => res.json())
                      .then((data) => {
                        if (data.success) {
                          setSettings((p) => ({ ...p, popupImages: [...(p.popupImages || []), data.url] }));
                          showToast("Gambar berhasil ditambahkan");
                        }
                      })
                      .finally(() => setSaving(false));
                  }} className="input-sacred" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2.5rem" }}>
          <button onClick={handleSave} disabled={saving} className="btn-gold" style={{ opacity: saving ? 0.7 : 1 }}>
            <Save size={16} />
            {saving ? "Menyimpan..." : "Simpan Pengaturan Pop-up"}
          </button>
        </div>
      </div>
    </div>
  );
}
