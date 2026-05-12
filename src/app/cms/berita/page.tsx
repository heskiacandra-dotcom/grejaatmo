// src/app/cms/berita/page.tsx
import { CmsBeritaList } from "@/components/cms/CmsBeritaList";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kelola Berita | CMS" };

export default function CmsBeritaPage() {
  return <CmsBeritaList />;
}
