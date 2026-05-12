// src/app/cms/tentang/page.tsx
import { CmsTentang } from "@/components/cms/CmsTentang";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Halaman Tentang | CMS",
};

export default function CmsTentangPage() {
  return <CmsTentang />;
}
