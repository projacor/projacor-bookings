"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO, isWithinInterval } from "date-fns";
import {
  Play,
  Save,
  FileDown,
  SlidersHorizontal,
  CheckCircle2,
  Calendar as CalIcon,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { eur } from "@/lib/utils";
import { Card, StatusBadge } from "@/components/ui";
import { BOOKING_STATUS_ORDER, STATUS_META } from "@/lib/types";

const FIELDS = [
  "ID do booking", "Data", "Nome do booking", "Estado", "Artista", "Sala",
  "Morada da sala", "Promotor", "Agente", "Cachet", "IVA", "Comissão",
  "% Comissão", "Receita do artista", "Recebido até à data", "Em dívida",
];

export default function ReportsPage() {
  const { bookings, artistById } = useStore();
  const [from, setFrom] = useState("2026-08-01");
  const [to, setTo] = useState("2026-10-31");

  const rows = bookings
    .filter((b) => {
      try {
        return isWithinInterval(parseISO(b.start), { start: parseISO(from), end: parseISO(to) });
      } catch {
        return false;
      }
    })
    .sort((a, b) => a.start.localeCompare(b.start));

  const fees = rows.reduce((s, b) => s + b.fee, 0);
  const commission = rows.reduce((s, b) => s + b.commission, 0);

  const field = "rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-link";

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        {/* Filtro */}
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold">Filtrar por contacto</h1>
            <button className="rounded-md border border-border p-1.5 text-muted hover:bg-surface-2">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-md bg-link/5 p-2">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={field} />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={field} />
            <div className="relative">
              <select className={`${field} pr-8`}>
                <option>Data do booking</option>
                <option>Data de criação</option>
              </select>
            </div>
            <button className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-link px-4 py-2 text-sm font-medium text-white hover:bg-link-dark">
              <Play className="h-4 w-4" /> Correr relatório
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-2">
              <SlidersHorizontal className="h-4 w-4" /> Editar campos
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-2">
              <CheckCircle2 className="h-4 w-4" /> Editar estado
            </button>
          </div>
        </Card>

        {/* Campos selecionados */}
        <Card className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Campos selecionados</h2>
            <button className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground">
              Mostrar campos <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-sm text-muted">{FIELDS.join(" · ")}</p>
        </Card>

        {/* Tabela */}
        <Card className="overflow-hidden">
          <div className="border-b border-border bg-surface-2/60 px-5 py-3 text-sm font-semibold">
            Bookings {format(parseISO(from), "dd/MM/yyyy")} — {format(parseISO(to), "dd/MM/yyyy")}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Data</th>
                  <th className="px-5 py-3">Nome do booking</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-2/40">
                    <td className="px-5 py-3 font-mono text-xs text-muted">{b.id}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-muted">
                      {format(parseISO(b.start), "dd/MM/yyyy")}
                      {b.end && b.end !== b.start && ` - ${format(parseISO(b.end), "dd/MM/yyyy")}`}
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/bookings/${b.id}`} className="inline-flex items-center gap-1.5 font-medium text-link hover:underline">
                        <CalIcon className="h-3.5 w-3.5" /> {b.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">Sem resultados neste intervalo.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Barra lateral */}
      <div className="space-y-4">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Pesquisa guardada</h3>
            <span className="text-xs font-medium text-muted">Ações</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium">
                Exportação geral <span className="rounded bg-green px-1.5 py-0.5 text-[10px] font-semibold text-white">Agendada</span>
              </div>
              <div className="text-xs text-muted">Próxima: 2026-07-20 00:00</div>
            </div>
            <div className="flex gap-1 text-muted">
              <button className="rounded p-1 hover:bg-surface-2"><Play className="h-3.5 w-3.5" /></button>
              <button className="rounded p-1 hover:bg-surface-2"><SlidersHorizontal className="h-3.5 w-3.5" /></button>
              <button className="rounded p-1 hover:bg-surface-2"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="inline-flex items-center justify-center gap-1.5 rounded-md bg-link px-3 py-2 text-sm font-medium text-white hover:bg-link-dark">
              <Save className="h-4 w-4" /> Guardar
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-md bg-green px-3 py-2 text-sm font-medium text-white hover:bg-green-dark">
              <FileDown className="h-4 w-4" /> Exportar
            </button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Legenda do calendário</h3>
          <div className="space-y-2">
            {BOOKING_STATUS_ORDER.map((key) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className="h-3.5 w-3.5 rounded-[3px]" style={{ backgroundColor: STATUS_META[key].color }} />
                <span className="text-muted">{STATUS_META[key].label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Totais selecionados</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Cachets</span>
              <span className="font-semibold">{eur(fees)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Comissão</span>
              <span className="font-semibold">{eur(commission)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-muted">Bookings</span>
              <span className="font-semibold">{rows.length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
