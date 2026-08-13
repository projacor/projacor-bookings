import { NextResponse } from "next/server";
import { hasDb, ensureSchema, setTaskDone } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { done } = await req.json();
  if (hasDb) {
    try {
      await ensureSchema();
      await setTaskDone(id, !!done);
    } catch (e) {
      return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}
