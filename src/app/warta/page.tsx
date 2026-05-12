// src/app/warta/page.tsx
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { WartaList } from "@/components/sections/WartaList";
import { BeritaList } from "@/components/sections/BeritaList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warta Paroki",
  description: "Arsip Warta Paroki dan Berita terbaru Keluarga Kudus Atmodirono, Semarang.",
};

export default function WartaPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Shared Header for Merged Page */}
        <div className="page-header">
          <div className="container-main" style={{ textAlign: "center" }}>
            <div className="section-label" style={{ justifyContent: "center", color: "rgba(201,168,76,0.8)", marginBottom: "1.25rem" }}>
              <span style={{ background: "rgba(201,168,76,0.5)" }} />
              Pusat Informasi
            </div>
            <h1
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "#FDFAF4",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Warta</span> Paroki
            </h1>
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic",
                fontSize: "1.1rem",
                color: "rgba(253,250,244,0.55)",
              }}
            >
              Kabar terkini dan buletin mingguan umat Paroki Keluarga Kudus Atmodirono
            </p>
          </div>
        </div>

        <div style={{ background: "#F5F0E4", paddingTop: "3rem" }}>
          <BeritaList hideHeader={true} />
        </div>
        
        <div style={{ background: "#F5F0E4" }}>
          <div className="container-main">
            <hr style={{ borderTop: "1px dashed #C9A84C", opacity: 0.3, margin: "0" }} />
          </div>
        </div>

        <WartaList hideHeader={true} />
      </main>
      <Footer />
    </>
  );
}
