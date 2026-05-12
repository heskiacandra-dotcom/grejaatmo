"use client";
// src/components/cms/CmsPengaturan.tsx
import { Save, Globe, Phone, Mail, MapPin, Clock, Check } from "lucide-react";
import { useEffect, useState } from "react";

const INITIAL_SETTINGS = {
  siteName: "Paroki Keluarga Kudus Atmodirono",
  siteTagline: "Komunitas Iman dalam Semangat Keluarga Kudus Nazaret",
  contactPhone: "(024) 8317XXX",
  contactEmail: "info@paroki-keluargakudus.id",
  address: "Jl. Atmodirono, Wonodri, Kec. Semarang Selatan, Kota Semarang",
  officeHours: "Senin – Sabtu: 08.00 – 16.00 WIB",
  facebookUrl: "https://facebook.com/paroki-atmodirono",
  instagramUrl: "https://instagram.com/paroki_atmodirono",
  youtubeUrl: "",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18...",
  contactWhatsapp: "081390820723",
  footerText: "Paroki Keluarga Kudus Atmodirono © 2025. Melayani dengan kasih.",
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
      <textarea value={value} onChange={onChange} className="input-sacred" rows={2} style={{ resize: "vertical" }} placeholder={placeholder} />
    ) : (
      <input type={type} value={value} onChange={onChange} className="input-sacred" placeholder={placeholder} />
    )}
  </div>
);

export function CmsPengaturan() {
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
        showToast("Pengaturan disimpan ✓");
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
    <div style={{ padding: "2.5rem", width: "100%" }}>
      {toast && (
        <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999, background: "rgba(107,124,94,0.95)", color: "#FDFAF4", padding: "1rem 1.25rem", borderRadius: "0.75rem", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Check size={16} /> {toast}
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", color: "#1A1614", fontWeight: 700 }}>Kontak & Identitas Website</h1>
        <p style={{ fontSize: "0.875rem", color: "#8B7355", marginTop: "0.25rem" }}>Kelola informasi kontak dan identitas paroki</p>
      </div>

      <Section title="Identitas Website" icon={Globe}>
        <Field label="Nama Paroki" value={settings.siteName} onChange={update("siteName")} />
        <Field label="Tagline" value={settings.siteTagline} onChange={update("siteTagline")} textarea />
        <Field label="Teks Footer" value={settings.footerText} onChange={update("footerText")} textarea />
      </Section>

      <Section title="Informasi Kontak" icon={Phone}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Nomor Telepon (Umum)" value={settings.contactPhone} onChange={update("contactPhone")} type="tel" />
          <Field label="Nomor WhatsApp" value={settings.contactWhatsapp} onChange={update("contactWhatsapp")} type="tel" />
          <Field label="Email" value={settings.contactEmail} onChange={update("contactEmail")} textarea />
        </div>
        <Field label="Alamat" value={settings.address} onChange={update("address")} textarea />
        <Field label="Jam Pelayanan Sekretariat" value={settings.officeHours} onChange={update("officeHours")} textarea />
      </Section>

      <Section title="Media Sosial" icon={Globe}>
        <Field label="URL Facebook" value={settings.facebookUrl} onChange={update("facebookUrl")} type="url" placeholder="https://facebook.com/..." />
        <Field label="URL Instagram" value={settings.instagramUrl} onChange={update("instagramUrl")} type="url" placeholder="https://instagram.com/..." />
        <Field label="URL YouTube" value={settings.youtubeUrl} onChange={update("youtubeUrl")} type="url" placeholder="https://youtube.com/..." />
      </Section>



      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
        <button onClick={handleSave} disabled={saving} className="btn-gold" style={{ opacity: saving ? 0.7 : 1 }}>
        <Save size={16} />
        {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
}
