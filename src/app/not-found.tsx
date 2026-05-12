// src/app/not-found.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan | Paroki Keluarga Kudus",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1A1614, #2C2420)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "serif",
            fontSize: "6rem",
            color: "rgba(201,168,76,0.15)",
            marginBottom: "1rem",
            lineHeight: 1,
          }}
        >
          ✝
        </div>
        <p
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(201,168,76,0.6)",
            marginBottom: "0.75rem",
          }}
        >
          Kesalahan 404
        </p>
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#FDFAF4",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Halaman Tidak Ditemukan
        </h1>
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontStyle: "italic",
            fontSize: "1.1rem",
            color: "rgba(253,250,244,0.5)",
            marginBottom: "2.5rem",
            maxWidth: "400px",
          }}
        >
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.875rem 2rem",
            background: "#C9A84C",
            color: "#1A1614",
            fontFamily: "Cinzel, serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            borderRadius: "2px",
            textDecoration: "none",
          }}
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
