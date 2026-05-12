// src/app/jadwal/page.tsx
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { JadwalFull } from "@/components/sections/JadwalFull";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jadwal Misa",
  description: "Jadwal lengkap Misa harian dan Minggu Paroki Keluarga Kudus Atmodirono, Semarang.",
};

export default function JadwalPage() {
  return (
    <>
      <Navbar />
      <main>
        <JadwalFull />
      </main>
      <Footer />
    </>
  );
}
