// src/app/api/schedules/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { massSchedules } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(massSchedules)
      .where(eq(massSchedules.isActive, true))
      .orderBy(asc(massSchedules.id));
    return NextResponse.json({ data: result, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil jadwal" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await db.insert(massSchedules).values(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah jadwal" }, { status: 500 });
  }
}
