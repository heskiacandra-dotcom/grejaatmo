"use client";
// src/components/cms/CmsTentang.tsx
import { Save, Globe, Check, Heart } from "lucide-react";
import { useEffect, useState } from "react";

const INITIAL_SETTINGS = {
  tentangImage: "/gereja-atmo-baru.jpg",
  tentangTitle1: "Lebih dari Tujuh Dekade",
  tentangTitle2: "Melayani dengan Kasih",
  tentangParagraf1: "Paroki Keluarga Kudus Atmodirono berdiri sejak tahun 1952, melayani umat Katolik di wilayah Semarang Selatan. Dengan semangat Keluarga Kudus Nazaret sebagai teladan, paroki kami terus bertumbuh dalam iman, persaudaraan, dan pelayanan.",
  tentangParagraf2: "Kami adalah komunitas yang beragam — dari anak-anak hingga lansia — bersatu dalam doa, perayaan sakramen, dan kegiatan sosial. Setiap minggu, ribuan umat berkumpul merayakan iman dan memperbarui komitmen sebagai pengikut Kristus.",
  statsYear: "1952",
  statsUmat: "2847",
  statsKomunitas: "12",
  statsKegiatan: "48",
  romo1Name: "R.D. Nama Romo Kepala",
  romo1Desc: "Pastor Kepala Paroki",
  romo1Image: "/gereja-atmo-baru.jpg",
  romo2Name: "R.D. Nama Romo Vikaris",
  romo2Desc: "Pastor Vikaris Paroki",
  romo2Image: "/gereja-atmo-baru.jpg",
  romo3Name: "R.D. Nama Romo Rekan",
  romo3Desc: "Pastor Rekan",
  romo3Image: "/gereja-atmo-baru.jpg",
  pastoralGroups: "Seksi Liturgi & Sakramen\nPersekutuan Doa Paroki\nOMK (Orang Muda Katolik)\nWKRI (Wanita Katolik RI)\nLegio Maria\nSeksi Sosial & Caritas\nKelompok Prodiakon\nLansia Paroki\nSekolah Minggu & Bina Iman\nTim Koor & Musik Liturgi",
  valuesSectionTitle: "Nilai Paroki",
  valuesMainTitle1: "Landasan Kehidupan",
  valuesMainTitle2: "Beriman",
  value1Title: "Kasih",
  value1Desc: "Melayani sesama dengan kasih Kristus yang tanpa batas sebagaimana teladan Keluarga Kudus Nazaret.",
  value2Title: "Persaudaraan",
  value2Desc: "Membangun komunitas iman yang hangat, inklusif, dan saling mendukung dalam suka maupun duka.",
  value3Title: "Iman",
  value3Desc: "Menjaga kemurnian iman Katolik melalui perayaan liturgi, sakramen, dan pembinaan iman.",
  value4Title: "Pelayanan",
  value4Desc: "Menghadirkan Kerajaan Allah melalui pelayanan sosial dan karya nyata kepada masyarakat.",
};

const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
    <h2 style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "Playfair Display, serif", fontSize: "1.1rem", color: "#1A1614", marginBottom: "1.5rem" }}>
      <Icon size={18} style={{ color: "#C9A84C" }} />
      {title}
    </h2>
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {children}
    </div>
  </div>
);

const Field = ({ label, value, onChange, type = "text", placeholder = "", textarea = false }: any) => (
  <div>
    <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>
      {label}
    </label>
    {textarea ? (
      <textarea value={value || ""} onChange={onChange} className="input-sacred" rows={4} style={{ resize: "vertical" }} placeholder={placeholder} />
    ) : (
      <input type={type} value={value || ""} onChange={onChange} className="input-sacred" placeholder={placeholder} />
    )}
  </div>
);

export function CmsTentang() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings((prev: any) => ({ ...prev, ...data.data }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSaving(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "tentang");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setSettings((p: any) => ({ ...p, [key]: data.url }));
        showToast("Foto berhasil diunggah ✓");
      } else {
        showToast(data.error || "Gagal mengunggah foto");
      }
    } catch {
      showToast("Gagal mengunggah foto");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof typeof settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings((p: any) => ({ ...p, [key]: e.target.value }));
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
        showToast("Halaman Tentang disimpan ✓");
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
    <div style={{ padding: "clamp(1rem, 5vw, 2.5rem)", width: "100%" }}>
      {toast && (
        <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999, background: "rgba(107,124,94,0.95)", color: "#FDFAF4", padding: "1rem 1.25rem", borderRadius: "0.75rem", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Check size={16} /> {toast}
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", color: "#1A1614", fontWeight: 700 }}>Halaman Tentang</h1>
        <p style={{ fontSize: "0.875rem", color: "#8B7355", marginTop: "0.25rem" }}>Kelola profil gereja dan data para romo paroki</p>
      </div>

      <Section title="Profil Utama (Beranda & Tentang)" icon={Globe}>
        <div>
          <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>
            Foto Gereja Utama
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
            {settings.tentangImage && (
              <img src={settings.tentangImage} alt="Preview" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "0.5rem" }} />
            )}
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "tentangImage")} className="input-sacred" style={{ flex: 1, minWidth: "200px" }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <Field label="Judul 1 (Teks Hitam)" value={settings.tentangTitle1} onChange={update("tentangTitle1")} />
          <Field label="Judul 2 (Teks Emas Italic)" value={settings.tentangTitle2} onChange={update("tentangTitle2")} />
        </div>
        <Field label="Paragraf 1" textarea value={settings.tentangParagraf1} onChange={update("tentangParagraf1")} />
        <Field label="Paragraf 2" textarea value={settings.tentangParagraf2} onChange={update("tentangParagraf2")} />
      </Section>

      <Section title="Statistik (Angka)" icon={Check}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1.25rem" }}>
          <Field label="Tahun Berdiri" value={settings.statsYear} onChange={update("statsYear")} type="number" />
          <Field label="Jumlah Umat" value={settings.statsUmat} onChange={update("statsUmat")} type="number" />
          <Field label="Komunitas" value={settings.statsKomunitas} onChange={update("statsKomunitas")} type="number" />
          <Field label="Kegiatan / Tahun" value={settings.statsKegiatan} onChange={update("statsKegiatan")} type="number" />
        </div>
      </Section>

      <Section title="Kelompok Pastoral (Komunitas)" icon={Globe}>
        <p style={{ fontSize: "0.8rem", color: "#8B7355", marginBottom: "0.5rem" }}>Tuliskan nama kelompok/komunitas, pisahkan dengan baris baru (Enter).</p>
        <Field label="Daftar Kelompok" textarea value={settings.pastoralGroups} onChange={update("pastoralGroups")} placeholder="Seksi Liturgi..." />
      </Section>

      <Section title="Nilai-nilai Paroki (Values)" icon={Heart}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <Field label="Label Seksi" value={settings.valuesSectionTitle} onChange={update("valuesSectionTitle")} />
          <Field label="Judul Utama 1" value={settings.valuesMainTitle1} onChange={update("valuesMainTitle1")} />
          <Field label="Judul Utama 2 (Emas)" value={settings.valuesMainTitle2} onChange={update("valuesMainTitle2")} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "1.5rem" }}>
          {[1, 2, 3, 4].map((num) => (
            <div key={num} style={{ background: "#F5F0E4", padding: "1.25rem", borderRadius: "0.5rem", border: "1px solid #E2D8C0" }}>
              <h4 style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", color: "#C9A84C", marginBottom: "1rem" }}>Nilai {num}</h4>
              <Field label={`Judul Nilai ${num}`} value={settings[`value${num}Title` as keyof typeof settings]} onChange={update(`value${num}Title` as keyof typeof settings)} />
              <div style={{ marginTop: "0.75rem" }}>
                <Field label={`Deskripsi Nilai ${num}`} textarea value={settings[`value${num}Desc` as keyof typeof settings]} onChange={update(`value${num}Desc` as keyof typeof settings)} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Para Romo (Gembala Paroki)" icon={Globe}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {[1, 2, 3].map((num) => {
            const prefix = `romo${num}` as keyof typeof settings;
            const imgKey = `${prefix}Image` as keyof typeof settings;
            const nameKey = `${prefix}Name` as keyof typeof settings;
            const descKey = `${prefix}Desc` as keyof typeof settings;

            return (
              <div key={num} style={{ background: "#F5F0E4", padding: "clamp(1rem, 3vw, 1.5rem)", borderRadius: "0.5rem", border: "1px solid #E2D8C0" }}>
                <h4 style={{ fontFamily: "Cinzel, serif", fontSize: "0.9rem", color: "#C9A84C", marginBottom: "1.25rem" }}>Romo {num}</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                      Foto Romo
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                      {settings[imgKey] && (
                        <img src={settings[imgKey] as string} alt="Preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "50%", border: "2px solid #C9A84C" }} />
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleUpload(e, imgKey)} className="input-sacred" style={{ flex: 1, minWidth: "150px" }} />
                    </div>
                  </div>
                  <Field label="Nama Romo" value={settings[nameKey]} onChange={update(nameKey)} />
                  <Field label="Jabatan / Keterangan" value={settings[descKey]} onChange={update(descKey)} />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
        <button onClick={handleSave} disabled={saving} className="btn-gold" style={{ width: "100%", maxWidth: "300px", opacity: saving ? 0.7 : 1 }}>
          <Save size={16} />
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
