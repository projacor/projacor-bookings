"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Mail, Phone, MapPin, UserPlus, Building2, Download } from "lucide-react";
import { useStore } from "@/lib/store";
import { ALL_TAGS } from "@/lib/types";
import { Avatar, Card, PageHeader, TagChip } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function ContactsPage() {
  const { contacts } = useStore();
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string[]>([]);

  const toggle = (t: string) =>
    setActive((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]));

  const rows = contacts
    .filter((c) => (active.length ? active.every((t) => c.tags.includes(t)) : true))
    .filter((c) => {
      if (!q) return true;
      const t = q.toLowerCase();
      return (
        c.name.toLowerCase().includes(t) ||
        (c.company ?? "").toLowerCase().includes(t) ||
        (c.role ?? "").toLowerCase().includes(t)
      );
    });

  return (
    <div>
      <PageHeader
        title="Contactos"
        subtitle="Artistas, promotores, salas e câmaras."
        action={
          <div className="flex gap-2">
            <Link href="/contacts/new" className="inline-flex items-center gap-1.5 rounded-md bg-link px-3.5 py-2 text-sm font-medium text-white hover:bg-link-dark">
              <UserPlus className="h-4 w-4" /> Adicionar pessoa
            </Link>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-green px-3.5 py-2 text-sm font-medium text-white hover:bg-green-dark">
              <Building2 className="h-4 w-4" /> Adicionar empresa
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-link focus:ring-2 focus:ring-link/20"
                placeholder="Procurar contactos…"
              />
            </div>
            <span className="whitespace-nowrap text-xs text-muted">Contactos: {rows.length}</span>
          </div>

          <div className="divide-y divide-border">
            {rows.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2/40">
                <Avatar name={c.name} color={c.color} size={40} square={c.kind === "company"} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-link">{c.name}</span>
                    {c.kind === "company" && (
                      <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">Empresa</span>
                    )}
                  </div>
                  <div className="truncate text-xs text-muted">
                    {c.role}
                    {c.company && c.kind === "person" ? ` · ${c.company}` : ""}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {c.email}</span>
                    {c.mobile && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {c.mobile}</span>}
                    {c.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {c.city}</span>}
                  </div>
                </div>
                <div className="hidden shrink-0 flex-wrap justify-end gap-1 sm:flex">
                  {c.tags.map((t) => (
                    <TagChip key={t} label={t} />
                  ))}
                </div>
              </div>
            ))}
            {rows.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-muted">Sem contactos para os filtros aplicados.</div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <button className="mb-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-surface-2">
              <Download className="h-4 w-4" /> Exportar para CSV
            </button>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Filtrar por etiqueta</h3>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggle(t)}
                  className={cn(
                    "rounded border px-2 py-1 text-xs font-medium transition-colors",
                    active.includes(t)
                      ? "border-brand bg-brand text-white"
                      : "border-border bg-surface text-muted hover:bg-surface-2"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            {active.length > 0 && (
              <button onClick={() => setActive([])} className="mt-3 text-xs text-link hover:underline">
                Limpar filtros
              </button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
