// src/app/api/announcements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { announcements } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";

    const result = await db
      .select()
      .from(announcements)
      .where(activeOnly ? eq(announcements.isActive, true) : undefined)
      .orderBy(desc(announcements.createdAt));

    return NextResponse.json({ data: result, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil pengumuman" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await db.insert(announcements).values(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah pengumuman" }, { status: 500 });
  }
}
