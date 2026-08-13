import { NextResponse } from "next/server";
import { hasDb, ensureSchema, getContacts, getBookings, getTasks, getNotes } from "@/lib/db";
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
      dbConfigured: false,
      hint: "DATABASE_URL não está definida no serviço da app.",
      artists,
      docs,
      contacts: seedContacts,
      bookings: seedBookings,
      tasks: seedTasks,
      notes: [],
    });
  }
  try {
    await ensureSchema();
    const [contacts, bookings, tasks, notes] = await Promise.all([
      getContacts(),
      getBookings(),
      getTasks(),
      getNotes(),
    ]);
    return NextResponse.json({ persistent: true, dbConfigured: true, artists, docs, contacts, bookings, tasks, notes });
  } catch (e) {
    return NextResponse.json({
      persistent: false,
      dbConfigured: true,
      error: String(e),
      artists,
      docs,
      contacts: seedContacts,
      bookings: seedBookings,
      tasks: seedTasks,
      notes: [],
    });
  }
}
