import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const SETTINGS_FILE = path.join(process.cwd(), "settings.json");

function getSettings() {
  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return {};
}

export async function GET() {
  try {
    const settingsObj = getSettings();
    return NextResponse.json({ success: true, data: settingsObj });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json(); // Expected: { key1: val1, key2: val2, ... }
    
    const existing = getSettings();
    const newSettings = { ...existing, ...body };
    
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
