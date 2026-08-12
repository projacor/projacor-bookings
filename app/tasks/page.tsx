"use client";

import Link from "next/link";
import { format, parseISO, isBefore } from "date-fns";
import { pt } from "date-fns/locale";
import { Check, Plus, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, PageHeader } from "@/components/ui";
import { cn } from "@/lib/utils";

const TODAY = parseISO("2026-08-12");

const PRIORITY = {
  alta: { label: "Alta", cls: "bg-brand/10 text-brand" },
  media: { label: "Média", cls: "bg-amber-100 text-amber-800" },
  baixa: { label: "Baixa", cls: "bg-slate-100 text-slate-600" },
};

export default function TasksPage() {
  const { tasks, toggleTask, bookingById } = useStore();

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div>
      <PageHeader
        title="Tarefas"
        subtitle={`${open.length} por fazer · ${done.length} concluídas`}
        action={
          <button className="inline-flex items-center gap-1.5 rounded-md bg-link px-3.5 py-2 text-sm font-medium text-white hover:bg-link-dark">
            <Plus className="h-4 w-4" /> Nova tarefa
          </button>
        }
      />

      <Card className="overflow-hidden">
        <div className="border-b border-border bg-surface-2/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
          Por fazer
        </div>
        <div className="divide-y divide-border">
          {open.map((t) => {
            const booking = t.bookingId ? bookingById(t.bookingId) : undefined;
            const overdue = isBefore(parseISO(t.due), TODAY);
            return (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                <button
                  onClick={() => toggleTask(t.id)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border hover:border-green"
                  aria-label="Concluir"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  {booking && (
                    <Link href={`/bookings/${booking.id}`} className="text-xs text-link hover:underline">
                      {booking.name}
                    </Link>
                  )}
                </div>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", PRIORITY[t.priority].cls)}>
                  {PRIORITY[t.priority].label}
                </span>
                <span className="hidden w-28 text-xs text-muted sm:block">{t.assignee}</span>
                <span className={cn("inline-flex w-24 items-center justify-end gap-1 text-xs", overdue ? "font-semibold text-brand" : "text-muted")}>
                  {overdue && <AlertCircle className="h-3.5 w-3.5" />}
                  {format(parseISO(t.due), "d MMM", { locale: pt })}
                </span>
              </div>
            );
          })}
          {open.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-muted">Sem tarefas pendentes 🎉</div>
          )}
        </div>

        {done.length > 0 && (
          <>
            <div className="border-y border-border bg-surface-2/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
              Concluídas
            </div>
            <div className="divide-y divide-border">
              {done.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                  <button
                    onClick={() => toggleTask(t.id)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-green bg-green text-white"
                    aria-label="Reabrir"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <div className="min-w-0 flex-1 truncate text-sm text-muted line-through">{t.title}</div>
                  <span className="hidden w-28 text-xs text-muted sm:block">{t.assignee}</span>
                  <span className="w-24 text-right text-xs text-muted">{format(parseISO(t.due), "d MMM", { locale: pt })}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
