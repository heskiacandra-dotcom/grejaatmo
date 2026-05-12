// src/app/api/warta/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { warta } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const result = await db.select().from(warta).orderBy(desc(warta.editionDate));
    return NextResponse.json({ data: result, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil warta" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const editionDate = formData.get("editionDate") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File | null;

    let fileUrl = "#";
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads", "warta");
      await mkdir(uploadDir, { recursive: true });
      const fileName = `warta-${Date.now()}-${file.name.replace(/\s/g, "-")}`;
      await writeFile(path.join(uploadDir, fileName), buffer);
      fileUrl = `/uploads/warta/${fileName}`;
    }

    await db.insert(warta).values({
      title,
      editionDate: new Date(editionDate),
      fileUrl,
      description: description || null,
    });

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    console.error("POST /api/warta error:", error);
    return NextResponse.json({ error: "Gagal upload warta" }, { status: 500 });
  }
}
