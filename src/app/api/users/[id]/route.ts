// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nama dan email wajib diisi" }, { status: 400 });
    }

    // Check email uniqueness (excluding self)
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Email sudah digunakan akun lain" }, { status: 409 });
    }

    const updateData: Record<string, unknown> = { name, email, role: role || "admin" };

    await db.update(users).set(updateData).where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui pengguna" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Prevent deleting the only superadmin
    const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!target) return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });

    if (target.role === "superadmin") {
      const allSuperadmins = await db.select().from(users).where(eq(users.role, "superadmin"));
      if (allSuperadmins.length <= 1) {
        return NextResponse.json({ error: "Tidak dapat menghapus satu-satunya Super Admin" }, { status: 403 });
      }
    }

    await db.delete(users).where(eq(users.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus pengguna" }, { status: 500 });
  }
}
