// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// GET /api/posts/[id]
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [post] = await db.select().from(posts).where(eq(posts.id, parseInt(id))).limit(1);
    if (!post) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ data: post, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// PUT /api/posts/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { title, content, excerpt, coverImage, categoryId, status, isFeatured } = body;

    const updateData: any = {
      title,
      content,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      categoryId: categoryId || null,
      status: status || "draft",
      isFeatured: isFeatured || false,
    };

    if (status === "published") {
      updateData.publishedAt = new Date();
    }

    await db.update(posts).set(updateData).where(eq(posts.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate berita" }, { status: 500 });
  }
}

// DELETE /api/posts/[id]
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await db.delete(posts).where(eq(posts.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus berita" }, { status: 500 });
  }
}
