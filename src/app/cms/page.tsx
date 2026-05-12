// src/app/cms/page.tsx
import { auth } from "@/lib/auth";
import { CmsDashboard } from "@/components/cms/CmsDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard CMS | Paroki Keluarga Kudus",
};

export default async function CmsDashboardPage() {
  const session = await auth();
  return <CmsDashboard user={session?.user} />;
}
