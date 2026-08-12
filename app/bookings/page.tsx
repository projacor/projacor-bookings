"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { Search, Calendar as CalIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { eur } from "@/lib/utils";
import { Card, PageHeader, StatusBadge } from "@/components/ui";
import { BOOKING_STATUS_ORDER, STATUS_META, type BookingStatus } from "@/lib/types";
import { NewBookingButton } from "@/components/new-booking";

function dateRange(start: string, end?: string) {
  const s = format(parseISO(start), "dd/MM/yyyy");
  if (!end || end === start) return s;
  return `${s} — ${format(parseISO(end), "dd/MM/yyyy")}`;
}

export default function BookingsPage() {
  const { bookings, artistById } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  const rows = bookings
    .filter((b) => (filter === "all" ? true : b.status === filter))
    .filter((b) => {
      if (!q) return true;
      const t = q.toLowerCase();
      return (
        b.name.toLowerCase().includes(t) ||
        b.city.toLowerCase().includes(t) ||
        b.venue.toLowerCase().includes(t) ||
        b.id.includes(t)
      );
    })
    .sort((a, b) => a.start.localeCompare(b.start));

  const total = rows.reduce((s, b) => s + b.fee, 0);
  const commission = rows.reduce((s, b) => s + b.commission, 0);

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle={`${rows.length} bookings · Cachet total ${eur(total)} · Comissão ${eur(commission)}`}
        action={<NewBookingButton />}
      />

      <Card className="mb-4 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-link focus:ring-2 focus:ring-link/20"
              placeholder="Procurar por nome, cidade, local ou ID…"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as BookingStatus | "all")}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-link"
          >
            <option value="all">Todos os estados</option>
            {BOOKING_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>{STATUS_META[s].label}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2/60 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Booking</th>
                <th className="px-5 py-3">Artista</th>
                <th className="px-5 py-3 text-right">Cachet</th>
                <th className="px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((b) => {
                const artist = artistById(b.artistId);
                return (
                  <tr key={b.id} className="hover:bg-surface-2/40">
                    <td className="px-5 py-3 font-mono text-xs text-muted">{b.id}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-muted">{dateRange(b.start, b.end)}</td>
                    <td className="px-5 py-3">
                      <Link href={`/bookings/${b.id}`} className="inline-flex items-center gap-1.5 font-medium text-link hover:underline">
                        <CalIcon className="h-3.5 w-3.5" /> {b.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3">{artist?.name}</td>
                    <td className="px-5 py-3 text-right font-medium">{eur(b.fee)}</td>
                    <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted">
                    Sem bookings para os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
