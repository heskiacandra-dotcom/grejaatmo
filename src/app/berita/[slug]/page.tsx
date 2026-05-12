// src/app/berita/[slug]/page.tsx
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { BeritaDetail } from "@/components/sections/BeritaDetail";
import { db } from "@/lib/db";
import { posts, categories, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db.select({ title: posts.title, excerpt: posts.excerpt }).from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!post) return { title: "Berita tidak ditemukan" };
  return {
    title: post.title,
    description: post.excerpt || "",
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const [post] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      coverImage: posts.coverImage,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      status: posts.status,
      isFeatured: posts.isFeatured,
      category: { id: categories.id, name: categories.name, slug: categories.slug, color: categories.color },
      author: { id: users.id, name: users.name }
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main>
        <BeritaDetail post={post} />
      </main>
      <Footer />
    </>
  );
}
