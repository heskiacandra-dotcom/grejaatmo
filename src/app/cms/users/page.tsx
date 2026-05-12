// src/app/cms/users/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CmsUsersManager } from "@/components/cms/CmsUsersManager";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kelola Pengguna | CMS" };

export default async function CmsUsersPage() {
  const session = await auth();
  
  if ((session?.user as any)?.role !== "superadmin") {
    redirect("/cms");
  }

  return <CmsUsersManager />;
}
