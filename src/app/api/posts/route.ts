// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, categories, users } from "@/lib/db/schema";
import { eq, desc, and, like, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

// GET /api/posts — list all posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const conditions = [];
    if (status) conditions.push(eq(posts.status, status as any));
    if (search) conditions.push(like(posts.title, `%${search}%`));
    if (categorySlug) conditions.push(eq(categories.slug, categorySlug));

    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        coverImage: posts.coverImage,
        status: posts.status,
        isFeatured: posts.isFeatured,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          color: categories.color,
        },
        author: {
          id: users.id,
          name: users.name,
        },
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(posts.publishedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ data: result, success: true });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Gagal mengambil data berita" }, { status: 500 });
  }
}

// POST /api/posts — create new post
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, content, excerpt, coverImage, categoryId, status, isFeatured } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Judul dan konten wajib diisi" }, { status: 400 });
    }

    const slug = slugify(title) + "-" + Date.now();

    await db.insert(posts).values({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      categoryId: categoryId || null,
      authorId: session.user!.id!,
      status: status || "draft",
      isFeatured: isFeatured || false,
      publishedAt: status === "published" ? new Date() : null,
    });

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Gagal membuat berita" }, { status: 500 });
  }
}
