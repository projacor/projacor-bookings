"use client";

import { useState } from "react";
import Link from "next/link";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  parseISO,
  format,
} from "date-fns";
import { pt } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Rss } from "lucide-react";
import { useStore } from "@/lib/store";
import { STATUS_META, BOOKING_STATUS_ORDER } from "@/lib/types";
import { Card } from "@/components/ui";
import { NewBookingButton } from "@/components/new-booking";

const TODAY = parseISO("2026-08-12");
const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function CalendarPage() {
  const { bookings } = useStore();
  const [cursor, setCursor] = useState(parseISO("2026-08-01"));

  const gridStart = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setCursor((c) => addMonths(c, -1))} className="rounded-md border border-border bg-surface p-1.5 text-muted hover:bg-surface-2">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h1 className="min-w-44 text-center text-xl font-semibold capitalize">
              {format(cursor, "MMMM yyyy", { locale: pt })}
            </h1>
            <button onClick={() => setCursor((c) => addMonths(c, 1))} className="rounded-md border border-border bg-surface p-1.5 text-muted hover:bg-surface-2">
              <ChevronRight className="h-4 w-4" />
            </button>
            <button onClick={() => setCursor(parseISO("2026-08-01"))} className="ml-1 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-surface-2">
              Hoje
            </button>
          </div>
          <div className="flex items-center gap-2">
            <NewBookingButton />
            <button className="inline-flex items-center gap-1.5 rounded-md bg-green px-3.5 py-2 text-sm font-medium text-white hover:bg-green-dark">
              <Rss className="h-4 w-4" /> Subscrever
            </button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border bg-surface-2/60 text-center text-xs font-medium text-muted">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const dayBookings = bookings.filter(
                (b) => b.status !== "cancelled" && isSameDay(parseISO(b.start), day)
              );
              const inMonth = isSameMonth(day, cursor);
              const isToday = isSameDay(day, TODAY);
              return (
                <div
                  key={i}
                  className={`min-h-[104px] border-b border-r border-border p-1.5 ${inMonth ? "bg-surface" : "bg-surface-2/40"} ${(i + 1) % 7 === 0 ? "border-r-0" : ""}`}
                >
                  <div className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${isToday ? "bg-brand font-semibold text-white" : inMonth ? "text-foreground" : "text-muted"}`}>
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.map((b) => (
                      <Link
                        key={b.id}
                        href={`/bookings/${b.id}`}
                        className="block truncate rounded px-1.5 py-1 text-[11px] font-medium text-white"
                        style={{ backgroundColor: STATUS_META[b.status].color }}
                        title={`${b.name} — ${STATUS_META[b.status].label}`}
                      >
                        {b.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="h-fit">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Legenda</h2>
        </div>
        <div className="space-y-2 px-4 py-3">
          {BOOKING_STATUS_ORDER.map((key) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              <span className="h-3.5 w-3.5 rounded-[3px]" style={{ backgroundColor: STATUS_META[key].color }} />
              <span className="text-muted">{STATUS_META[key].label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
