import { NextResponse } from "next/server";
import { hasDb, ensureSchema, insertContact } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  if (hasDb) {
    try {
      await ensureSchema();
      await insertContact(body);
    } catch (e) {
      return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}
