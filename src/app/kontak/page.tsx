// src/app/kontak/page.tsx
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { KontakContent } from "@/components/sections/KontakContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak & Lokasi",
  description: "Alamat, nomor telepon, dan informasi kontak Paroki Keluarga Kudus Atmodirono, Semarang.",
};

export default function KontakPage() {
  return (
    <>
      <Navbar />
      <main>
        <KontakContent />
      </main>
      <Footer />
    </>
  );
}
