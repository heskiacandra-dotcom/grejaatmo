// src/app/tentang/page.tsx
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { TentangContent } from "@/components/sections/TentangContent";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Paroki",
  description: "Sejarah, visi misi, dan komunitas Paroki Keluarga Kudus Atmodirono, Semarang sejak tahun 1952.",
};

export default function TentangPage() {
  let settings: any = {};
  try {
    const filePath = path.join(process.cwd(), "settings.json");
    if (fs.existsSync(filePath)) {
      settings = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading settings", e);
  }

  return (
    <>
      <Navbar />
      <main>
        <TentangContent settings={settings} />
      </main>
      <Footer />
    </>
  );
}
