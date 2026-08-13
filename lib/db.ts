import { Pool } from "pg";
import {
  contacts as seedContacts,
  bookings as seedBookings,
  tasks as seedTasks,
} from "./data";
import type { Booking, Contact, Task } from "./types";

// Persistência opcional: só ativa quando existe DATABASE_URL (Railway Postgres).
// Sem base de dados, a app funciona na mesma (dados de demonstração em memória).
export const hasDb = !!process.env.DATABASE_URL;

let pool: Pool | null = null;
function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL!;
    const needsSsl = !/localhost|127\.0\.0\.1|\.internal/.test(url);
    pool = new Pool({
      connectionString: url,
      ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
      max: 5,
    });
  }
  return pool;
}

let ready: Promise<void> | null = null;
export function ensureSchema() {
  if (!hasDb) return Promise.resolve();
  if (!ready) ready = init();
  return ready;
}

async function init() {
  const p = getPool();
  await p.query(`CREATE TABLE IF NOT EXISTS contacts (
    id text PRIMARY KEY, kind text, name text, company text, role text,
    email text, mobile text, city text, region text, tags text[],
    color text, avatar text
  )`);
  await p.query(`CREATE TABLE IF NOT EXISTS bookings (
    id text PRIMARY KEY, name text, artist_id text, promoter_id text, venue_id text,
    start_date text, end_date text, city text, venue text, fee int, commission int,
    status text, agent text, assistant text, notes text
  )`);
  await p.query(`CREATE TABLE IF NOT EXISTS tasks (
    id text PRIMARY KEY, title text, due text, done boolean, assignee text,
    booking_id text, contact_id text, priority text
  )`);

  const { rows: cc } = await p.query("SELECT COUNT(*)::int AS n FROM contacts");
  if (cc[0].n === 0) for (const c of seedContacts) await insertContact(c);
  const { rows: bc } = await p.query("SELECT COUNT(*)::int AS n FROM bookings");
  if (bc[0].n === 0) for (const b of seedBookings) await insertBooking(b);
  const { rows: tc } = await p.query("SELECT COUNT(*)::int AS n FROM tasks");
  if (tc[0].n === 0) for (const t of seedTasks) await insertTask(t);
}

/* ---------- mapeamento linha <-> objeto ---------- */

function toContact(r: Record<string, unknown>): Contact {
  return {
    id: r.id as string,
    kind: r.kind as Contact["kind"],
    name: r.name as string,
    company: (r.company as string) ?? undefined,
    role: (r.role as string) ?? undefined,
    email: r.email as string,
    mobile: (r.mobile as string) ?? undefined,
    city: (r.city as string) ?? undefined,
    region: (r.region as string) ?? undefined,
    tags: (r.tags as string[]) ?? [],
    color: r.color as string,
    avatar: (r.avatar as string) ?? undefined,
  };
}
function toBooking(r: Record<string, unknown>): Booking {
  return {
    id: r.id as string,
    name: r.name as string,
    artistId: r.artist_id as string,
    promoterId: (r.promoter_id as string) ?? undefined,
    venueId: (r.venue_id as string) ?? undefined,
    start: r.start_date as string,
    end: (r.end_date as string) ?? undefined,
    city: r.city as string,
    venue: r.venue as string,
    fee: r.fee as number,
    commission: r.commission as number,
    status: r.status as Booking["status"],
    agent: r.agent as string,
    assistant: (r.assistant as string) ?? undefined,
    notes: (r.notes as string) ?? undefined,
  };
}
function toTask(r: Record<string, unknown>): Task {
  return {
    id: r.id as string,
    title: r.title as string,
    due: r.due as string,
    done: r.done as boolean,
    assignee: r.assignee as string,
    bookingId: (r.booking_id as string) ?? undefined,
    contactId: (r.contact_id as string) ?? undefined,
    priority: r.priority as Task["priority"],
  };
}

/* ---------- leitura ---------- */

export async function getContacts() {
  const { rows } = await getPool().query("SELECT * FROM contacts ORDER BY name");
  return rows.map(toContact);
}
export async function getBookings() {
  const { rows } = await getPool().query("SELECT * FROM bookings ORDER BY start_date");
  return rows.map(toBooking);
}
export async function getTasks() {
  const { rows } = await getPool().query("SELECT * FROM tasks");
  return rows.map(toTask);
}

/* ---------- escrita ---------- */

export async function insertContact(c: Contact) {
  await getPool().query(
    `INSERT INTO contacts (id,kind,name,company,role,email,mobile,city,region,tags,color,avatar)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     ON CONFLICT (id) DO NOTHING`,
    [c.id, c.kind, c.name, c.company ?? null, c.role ?? null, c.email, c.mobile ?? null,
     c.city ?? null, c.region ?? null, c.tags ?? [], c.color, c.avatar ?? null]
  );
}
export async function insertBooking(b: Booking) {
  await getPool().query(
    `INSERT INTO bookings (id,name,artist_id,promoter_id,venue_id,start_date,end_date,city,venue,fee,commission,status,agent,assistant,notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     ON CONFLICT (id) DO NOTHING`,
    [b.id, b.name, b.artistId, b.promoterId ?? null, b.venueId ?? null, b.start, b.end ?? null,
     b.city, b.venue, b.fee, b.commission, b.status, b.agent, b.assistant ?? null, b.notes ?? null]
  );
}
export async function insertTask(t: Task) {
  await getPool().query(
    `INSERT INTO tasks (id,title,due,done,assignee,booking_id,contact_id,priority)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (id) DO NOTHING`,
    [t.id, t.title, t.due, t.done, t.assignee, t.bookingId ?? null, t.contactId ?? null, t.priority]
  );
}

const CONTACT_COLS: Record<string, string> = {
  kind: "kind", name: "name", company: "company", role: "role", email: "email",
  mobile: "mobile", city: "city", region: "region", tags: "tags", color: "color", avatar: "avatar",
};

export async function patchContact(id: string, patch: Record<string, unknown>) {
  const sets: string[] = [];
  const vals: unknown[] = [];
  for (const [k, v] of Object.entries(patch)) {
    const col = CONTACT_COLS[k];
    if (!col) continue;
    vals.push(v ?? null);
    sets.push(`${col} = $${vals.length}`);
  }
  if (!sets.length) return;
  vals.push(id);
  await getPool().query(`UPDATE contacts SET ${sets.join(", ")} WHERE id = $${vals.length}`, vals);
}

export async function setBookingStatus(id: string, status: string) {
  await getPool().query("UPDATE bookings SET status = $1 WHERE id = $2", [status, id]);
}

export async function setTaskDone(id: string, done: boolean) {
  await getPool().query("UPDATE tasks SET done = $1 WHERE id = $2", [done, id]);
}

export async function deleteContact(id: string) {
  await getPool().query("DELETE FROM contacts WHERE id = $1", [id]);
}
