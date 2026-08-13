import { NextResponse } from "next/server";
import { hasDb, ensureSchema, patchContact } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patch = await req.json();
  if (hasDb) {
    try {
      await ensureSchema();
      await patchContact(id, patch);
    } catch (e) {
      return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}
