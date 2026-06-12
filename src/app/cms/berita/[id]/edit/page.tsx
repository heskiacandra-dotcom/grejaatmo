// src/app/cms/berita/[id]/edit/page.tsx
import { CmsBeritaForm } from "@/components/cms/CmsBeritaForm";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: "Edit Berita | CMS" };

export default async function EditBeritaPage({ params }: Props) {
  const { id } = await params;
  
  const [post] = await db.select().from(posts).where(eq(posts.id, parseInt(id)));
  
  if (!post) notFound();

  return (
    <CmsBeritaForm
      mode="edit"
      initialData={{
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || "",
        content: post.content,
        categoryId: post.categoryId,
        status: post.status as any,
        isFeatured: !!post.isFeatured,
        coverImage: post.coverImage || "",
      }}
    />
  );
}
