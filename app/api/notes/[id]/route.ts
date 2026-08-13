import { NextResponse } from "next/server";
import { hasDb, ensureSchema, deleteNote } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (hasDb) {
    try {
      await ensureSchema();
      await deleteNote(id);
    } catch (e) {
      return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}
