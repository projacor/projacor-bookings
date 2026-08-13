import { NextResponse } from "next/server";
import { hasDb, ensureSchema, getContacts, getBookings, getTasks } from "@/lib/db";
import {
  artists,
  docs,
  contacts as seedContacts,
  bookings as seedBookings,
  tasks as seedTasks,
} from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDb) {
    return NextResponse.json({
      persistent: false,
      artists,
      docs,
      contacts: seedContacts,
      bookings: seedBookings,
      tasks: seedTasks,
    });
  }
  try {
    await ensureSchema();
    const [contacts, bookings, tasks] = await Promise.all([
      getContacts(),
      getBookings(),
      getTasks(),
    ]);
    return NextResponse.json({ persistent: true, artists, docs, contacts, bookings, tasks });
  } catch (e) {
    return NextResponse.json({
      persistent: false,
      error: String(e),
      artists,
      docs,
      contacts: seedContacts,
      bookings: seedBookings,
      tasks: seedTasks,
    });
  }
}
