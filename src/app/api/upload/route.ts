// src/app/api/upload/route.ts
// Generic image upload API for CMS (cover images, galeri, etc.)
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 500 * 1024; // 500KB

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "images";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Format file tidak didukung (JPG, PNG, WebP, GIF)" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Ukuran file maksimal 500KB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);

    const url = `/uploads/${folder}/${fileName}`;
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
