// src/app/cms/berita/[id]/edit/page.tsx
import { CmsBeritaForm } from "@/components/cms/CmsBeritaForm";
import { mockPosts } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: "Edit Berita | CMS" };

export default async function EditBeritaPage({ params }: Props) {
  const { id } = await params;
  // In production: fetch from DB. For now use mock data
  const post = mockPosts.find((p) => p.id === parseInt(id));
  if (!post) notFound();

  return (
    <CmsBeritaForm
      mode="edit"
      initialData={{
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || "",
        content: post.content,
        categoryId: post.category.id,
        status: post.status as any,
        isFeatured: post.isFeatured,
        coverImage: "",
      }}
    />
  );
}
