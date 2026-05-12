// src/app/cms/pengumuman/page.tsx
import { CmsPengumumanManager } from "@/components/cms/CmsPengumumanManager";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Kelola Pengumuman | CMS" };
export default function CmsPengumumanPage() { return <CmsPengumumanManager />; }
