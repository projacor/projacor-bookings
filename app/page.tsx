"use client";

import Link from "next/link";
import { format, parseISO, isAfter } from "date-fns";
import { pt } from "date-fns/locale";
import {
  TrendingUp,
  CalendarCheck,
  FileClock,
  ListTodo,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { eur } from "@/lib/utils";
import { Avatar, Card, PageHeader, StatusBadge } from "@/components/ui";
import { STATUS_META, BOOKING_STATUS_ORDER } from "@/lib/types";
import { NewBookingButton } from "@/components/new-booking";

const TODAY = parseISO("2026-08-12");

export default function DashboardPage() {
  const { bookings, tasks, artistById, contactById } = useStore();

  const confirmedRevenue = bookings
    .filter((b) => ["confirmed", "contract_signed", "fully_executed"].includes(b.status))
    .reduce((s, b) => s + b.fee, 0);
  const confirmedCount = bookings.filter((b) =>
    ["confirmed", "contract_sent", "contract_signed", "fully_executed"].includes(b.status)
  ).length;
  const inNegotiation = bookings.filter((b) =>
    ["enquiry", "pencilled", "pending", "awaiting"].includes(b.status)
  ).length;
  const openTasks = tasks.filter((t) => !t.done).length;

  const upcoming = bookings
    .filter((b) => b.status !== "cancelled" && isAfter(parseISO(b.start), TODAY))
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 6);

  const statusCounts = BOOKING_STATUS_ORDER.map((key) => ({
    key,
    label: STATUS_META[key].label,
    color: STATUS_META[key].color,
    count: bookings.filter((b) => b.status === key).length,
  })).filter((s) => s.count > 0);
  const maxCount = Math.max(...statusCounts.map((s) => s.count), 1);

  const pendingTasks = tasks.filter((t) => !t.done).slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Painel"
        subtitle={`Bom dia, Ben — ${format(TODAY, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })}`}
        action={<NewBookingButton />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={<CalendarCheck className="h-5 w-5" />} label="Bookings confirmados" value={String(confirmedCount)} hint="Em produção" accent="#1e7a34" />
        <Kpi icon={<FileClock className="h-5 w-5" />} label="Em negociação" value={String(inNegotiation)} hint="Pedidos e pré-reservas" accent="#f0932b" />
        <Kpi icon={<TrendingUp className="h-5 w-5" />} label="Receita confirmada" value={eur(confirmedRevenue)} hint="Cachets confirmados" accent="#d6492f" />
        <Kpi icon={<ListTodo className="h-5 w-5" />} label="Tarefas por fazer" value={String(openTasks)} hint="Da equipa" accent="#2f6fb0" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold">Próximos eventos</h2>
            <Link href="/bookings" className="inline-flex items-center gap-1 text-xs font-medium text-link hover:underline">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {upcoming.map((b) => {
              const artist = artistById(b.artistId);
              const promoter = contactById(b.promoterId);
              return (
                <Link key={b.id} href={`/bookings/${b.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-2/50">
                  <div className="w-12 shrink-0 text-center">
                    <div className="text-lg font-semibold leading-none">{format(parseISO(b.start), "dd")}</div>
                    <div className="text-[11px] uppercase text-muted">{format(parseISO(b.start), "MMM", { locale: pt })}</div>
                  </div>
                  <Avatar name={artist?.name ?? "?"} color={artist?.color} size={36} square />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{b.name}</div>
                    <div className="truncate text-xs text-muted">{artist?.name} · {b.venue}, {b.city}</div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="text-sm font-medium">{eur(b.fee)}</div>
                    <div className="truncate text-[11px] text-muted">{promoter?.company ?? promoter?.name}</div>
                  </div>
                  <StatusBadge status={b.status} />
                </Link>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold">Bookings por estado</h2>
          </div>
          <div className="space-y-3 px-5 py-4">
            {statusCounts.map((s) => (
              <div key={s.key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: s.color }} />
                    {s.label}
                  </span>
                  <span className="text-muted">{s.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full" style={{ width: `${(s.count / maxCount) * 100}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">Tarefas pendentes</h2>
          <Link href="/tasks" className="inline-flex items-center gap-1 text-xs font-medium text-link hover:underline">
            Ir para tarefas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {pendingTasks.map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-5 py-3 text-sm">
              <span className="h-4 w-4 shrink-0 rounded border border-border" />
              <span className="min-w-0 flex-1 truncate">{t.title}</span>
              <span className="text-xs text-muted">{t.assignee}</span>
              <span className="w-24 text-right text-xs text-muted">
                {format(parseISO(t.due), "d MMM", { locale: pt })}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  accent: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}1a`, color: accent }}>
          {icon}
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted">{hint}</div>
    </Card>
  );
}
