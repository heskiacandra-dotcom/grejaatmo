// src/app/cms/berita/new/page.tsx
import { CmsBeritaForm } from "@/components/cms/CmsBeritaForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tulis Berita Baru | CMS" };

export default function NewBeritaPage() {
  return <CmsBeritaForm mode="new" />;
}
