// src/app/cms/jadwal/page.tsx
import { CmsJadwalManager } from "@/components/cms/CmsJadwalManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kelola Jadwal Misa | CMS" };

export default function CmsJadwalPage() {
  return <CmsJadwalManager />;
}
