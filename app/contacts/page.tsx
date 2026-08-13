"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Tag,
  Save,
  X,
  Check,
  UserPlus,
  Building2,
  Download,
  Megaphone,
  IdCard,
  Mail,
  Users,
  FileText,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ALL_TAGS, tagColor } from "@/lib/types";
import { Avatar, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

type Kind = "all" | "person" | "company";

export default function ContactsPage() {
  const { contacts, deleteContacts } = useStore();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<Kind>("all");
  const [active, setActive] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTag = (t: string) =>
    setActive((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]));
  const toggleSel = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const rows = contacts
    .filter((c) => (kind === "all" ? true : c.kind === kind))
    .filter((c) => (active.length ? active.every((t) => c.tags.includes(t)) : true))
    .filter((c) => {
      if (!q) return true;
      const t = q.toLowerCase();
      return (
        c.name.toLowerCase().includes(t) ||
        (c.company ?? "").toLowerCase().includes(t) ||
        (c.role ?? "").toLowerCase().includes(t) ||
        c.tags.some((tag) => tag.toLowerCase().includes(t))
      );
    });

  const allSelected = rows.length > 0 && rows.every((c) => selected.includes(c.id));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_290px]">
      {/* Lista */}
      <Card className="overflow-hidden">
        {/* Cabeçalho de pesquisa */}
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Procurar contactos</h2>
            <div className="ml-auto flex items-center gap-1 text-muted">
              <button onClick={() => { setQ(""); setActive([]); }} title="Limpar" className="rounded p-1.5 hover:bg-surface-2">
                <X className="h-4 w-4" />
              </button>
              <button title="Etiquetas" className="rounded p-1.5 hover:bg-surface-2"><Tag className="h-4 w-4" /></button>
              <button title="Guardar pesquisa" className="rounded p-1.5 hover:bg-surface-2"><Save className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-link focus:ring-2 focus:ring-link/20"
                placeholder="Procurar etiquetas ou nome…"
              />
            </div>
            {/* Operadores (construtor de pesquisa) */}
            <div className="hidden items-center gap-0.5 sm:flex">
              {["(", "E", "OU", ")"].map((op) => (
                <button key={op} className="h-8 min-w-8 rounded border border-border bg-surface px-1.5 text-xs font-medium text-muted hover:bg-surface-2">
                  {op}
                </button>
              ))}
              <button className="flex h-8 w-8 items-center justify-center rounded bg-green text-white hover:bg-green-dark">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <div className="relative">
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as Kind)}
                className="appearance-none rounded-md border border-border bg-surface py-1.5 pl-3 pr-8 text-sm outline-none focus:border-link"
              >
                <option value="all">Todos os contactos</option>
                <option value="person">Pessoas</option>
                <option value="company">Empresas</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
            <span className="ml-auto text-sm text-muted">Contactos: {rows.length}</span>
          </div>
        </div>

        {/* Barra de ações */}
        <div className="flex items-center gap-4 border-b border-border bg-surface-2/50 px-4 py-2 text-sm">
          <button
            onClick={() => setSelected(rows.map((c) => c.id))}
            className="inline-flex items-center gap-1.5 text-muted hover:text-foreground"
          >
            <Check className="h-4 w-4" /> Selecionar todos
          </button>
          <button
            onClick={() => setSelected([])}
            className="inline-flex items-center gap-1.5 text-muted hover:text-foreground"
          >
            <X className="h-4 w-4" /> Nenhum
          </button>
          <button className="inline-flex items-center gap-1.5 text-muted hover:text-foreground">
            <Tag className="h-4 w-4" /> Adicionar etiqueta
          </button>
          {selected.length > 0 && (
            <button
              onClick={() => {
                if (confirm(`Apagar ${selected.length} contacto(s)? Esta ação não pode ser anulada.`)) {
                  deleteContacts(selected);
                  setSelected([]);
                }
              }}
              className="inline-flex items-center gap-1.5 font-medium text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" /> Apagar contactos
            </button>
          )}
          {selected.length > 0 && (
            <span className="ml-auto text-xs text-muted">{selected.length} selecionados</span>
          )}
        </div>

        {/* Linhas */}
        <div className="divide-y divide-border">
          {rows.map((c) => (
            <div key={c.id} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-2/30">
              <input
                type="checkbox"
                checked={selected.includes(c.id)}
                onChange={() => toggleSel(c.id)}
                className="mt-1 h-4 w-4 shrink-0 accent-brand"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Link href={`/contacts/${c.id}`} className="font-semibold text-link hover:underline">
                    {c.name}
                  </Link>
                  {c.role && <span className="text-xs text-muted">{c.role}</span>}
                  <span className="flex items-center gap-1 text-muted/70">
                    <IdCard className="h-3.5 w-3.5" />
                    <FileText className="h-3.5 w-3.5" />
                    <Users className="h-3.5 w-3.5" />
                  </span>
                </div>
                {c.company && c.kind === "person" && (
                  <div className="text-sm">
                    <span className="text-muted">em </span>
                    <span className="text-link">{c.company}</span>
                  </div>
                )}
                {c.city && <div className="text-sm text-muted">{c.city}</div>}
                <div className="text-sm">
                  <span className="text-muted">Email: </span>
                  <a href={`mailto:${c.email}`} className="text-link hover:underline">{c.email}</a>
                </div>
                {c.mobile && (
                  <div className="text-sm">
                    <span className="text-muted">Tel: </span>
                    <a href={`tel:${c.mobile}`} className="text-link hover:underline">{c.mobile}</a>
                  </div>
                )}
              </div>
              {/* Foto à direita */}
              <Avatar name={c.name} color={c.color} size={56} square avatar={c.avatar} />
            </div>
          ))}
          {rows.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-muted">
              Sem contactos para os filtros aplicados.
            </div>
          )}
        </div>
      </Card>

      {/* Barra lateral */}
      <div className="space-y-4">
        <Card className="space-y-2 p-3">
          <Link
            href="/contacts/new"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-link px-3 py-2.5 text-sm font-semibold text-white hover:bg-link-dark"
          >
            <UserPlus className="h-4 w-4" /> Adicionar pessoa
          </Link>
          <button className="flex w-full items-center justify-center gap-2 rounded-md bg-green px-3 py-2.5 text-sm font-semibold text-white hover:bg-green-dark">
            <Building2 className="h-4 w-4" /> Adicionar empresa
          </button>
        </Card>

        <Card className="p-1.5">
          <SideLink icon={<Download className="h-4 w-4" />} label="Exportar todos os contactos (csv)" />
          <SideLink icon={<Download className="h-4 w-4" />} label="Exportar pesquisa atual (csv)" />
          <SideLink icon={<Megaphone className="h-4 w-4" />} label="Criar uma campanha" />
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filtrar por etiqueta</h3>
            {active.length > 0 && (
              <button onClick={() => setActive([])} className="text-xs text-link hover:underline">Limpar</button>
            )}
          </div>
          <div className="relative mb-3">
            <select className="w-full appearance-none rounded-md border border-border bg-surface py-1.5 pl-3 pr-8 text-xs outline-none focus:border-link">
              <option>Contactos com todas as etiquetas selecionadas</option>
              <option>Contactos com qualquer etiqueta</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TAGS.map((t) => {
              const color = tagColor(t);
              const on = active.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={cn(
                    "rounded border px-2 py-1 text-xs font-medium transition-colors",
                    on ? "text-white" : "bg-surface hover:bg-surface-2"
                  )}
                  style={
                    on
                      ? { backgroundColor: color, borderColor: color }
                      : { color, borderColor: color }
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SideLink({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-link hover:bg-surface-2">
      <span className="text-link">{icon}</span>
      {label}
    </button>
  );
}
