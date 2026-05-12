// src/app/berita/page.tsx
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { BeritaList } from "@/components/sections/BeritaList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita & Pengumuman",
  description: "Berita terbaru, pengumuman, dan informasi kegiatan dari Paroki Keluarga Kudus Atmodirono, Semarang.",
};

export default function BeritaPage() {
  return (
    <>
      <Navbar />
      <main>
        <BeritaList />
      </main>
      <Footer />
    </>
  );
}
