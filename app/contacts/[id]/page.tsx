"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Pencil,
  Upload,
  Tag,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Mail,
  Info,
  Send,
  CheckSquare,
  Calendar as CalIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { initials } from "@/lib/utils";
import { tagColor } from "@/lib/types";
import { Avatar, StatusBadge } from "@/components/ui";

type Note = { id: string; date: string; author: string; text: string };
type Tab = "all" | "bookings" | "contracts";

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { contactById, bookings, artistById } = useStore();
  const c = contactById(id);

  const [tags, setTags] = useState<string[]>(c?.tags ?? []);
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState<Note[]>([
    { id: "n1", date: "2026-07-02", author: "Ben Jones", text: "Sugeriu o Big Band para o festival de verão." },
  ]);
  const [tab, setTab] = useState<Tab>("all");

  if (!c) {
    return (
      <div className="py-20 text-center text-sm text-muted">
        Contacto não encontrado.{" "}
        <Link href="/contacts" className="text-link hover:underline">
          Voltar aos contactos
        </Link>
      </div>
    );
  }

  const related = bookings
    .filter((b) => b.promoterId === c.id || b.venueId === c.id)
    .sort((a, b) => a.start.localeCompare(b.start));
  const shown = tab === "contracts"
    ? related.filter((b) => ["contract_sent", "contract_signed", "fully_executed"].includes(b.status))
    : related;

  const addNote = () => {
    if (!draft.trim()) return;
    setNotes((n) => [
      { id: `n${n.length + 2}`, date: "2026-08-12", author: "Ben Jones", text: draft.trim() },
      ...n,
    ]);
    setDraft("");
  };

  return (
    <div>
      <Link
        href="/contacts"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Contactos
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        {/* ---------------- Coluna principal ---------------- */}
        <div className="space-y-4">
          {/* Cabeçalho do contacto */}
          <div className="overflow-hidden rounded-md border border-border bg-surface">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold">{c.name}</h1>
                    <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold text-muted">
                      {initials(c.name)}
                    </span>
                    <CalendarDays className="h-4 w-4 text-muted" />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.role}
                    {c.company && c.kind === "person" && (
                      <>
                        {" "}em <span className="text-link">{c.company}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-semibold">Email:</span>{" "}
                    <a href={`mailto:${c.email}`} className="text-link hover:underline">{c.email}</a>
                  </div>
                  {c.city && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-link">
                      <MapPin className="h-4 w-4" /> {c.city}
                    </div>
                  )}
                  {/* Etiquetas */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: tagColor(t) }}
                      >
                        {t}
                        <button onClick={() => setTags((x) => x.filter((y) => y !== t))} className="hover:opacity-70">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
                    <span>Adicionado 26/04/2026 por <span className="text-link">Ben Jones</span></span>
                    <span>Última atualização 02/07/2026 por <span className="text-link">Ben Jones</span></span>
                  </div>
                </div>
                <Avatar name={c.name} color={c.color} size={72} square />
              </div>
            </div>

            {/* Barra de ações */}
            <div className="flex divide-x divide-border border-t border-border text-sm">
              <ToolbarBtn icon={<Pencil className="h-4 w-4" />} label="Editar contacto" />
              <ToolbarBtn icon={<Upload className="h-4 w-4" />} label="Carregar avatar" />
              <ToolbarBtn icon={<Tag className="h-4 w-4" />} label="Adicionar etiqueta" />
            </div>
          </div>

          {/* Adicionar nota */}
          <div className="rounded-md border border-border bg-surface p-5">
            <h2 className="mb-3 text-base font-semibold">Adicionar nota sobre {c.name}</h2>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-[110px] w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-link focus:ring-2 focus:ring-link/20"
              placeholder="Escreve uma nota…"
            />
            <div className="mt-3 flex items-center justify-between">
              <button className="text-sm text-link hover:underline">Mais opções</button>
              <button
                onClick={addNote}
                className="rounded-md bg-link px-4 py-2 text-sm font-medium text-white hover:bg-link-dark"
              >
                Adicionar nota
              </button>
            </div>

            {/* Feed de notas */}
            {notes.length > 0 && (
              <div className="mt-5 divide-y divide-border border-t border-border">
                {notes.map((n) => (
                  <div key={n.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-semibold">
                          {format(parseISO(n.date), "dd/MM/yyyy", { locale: pt })}
                        </span>{" "}
                        <span className="text-link">Nota por {n.author}</span>
                      </div>
                      <div className="flex gap-1 text-muted">
                        <button className="rounded border border-border p-1 hover:bg-surface-2"><Pencil className="h-3.5 w-3.5" /></button>
                        <button
                          onClick={() => setNotes((x) => x.filter((y) => y.id !== n.id))}
                          className="rounded border border-border p-1 hover:bg-surface-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{n.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---------------- Barra lateral ---------------- */}
        <div className="space-y-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface py-2.5 text-sm font-medium hover:bg-surface-2">
            <CheckSquare className="h-4 w-4" /> Adicionar tarefa
          </button>

          <div className="overflow-hidden rounded-md border border-border bg-surface">
            <SideLink icon={<ImageIcon className="h-4 w-4" />} label="Ver página de media" href="/docs" />
            <SideLink icon={<Mail className="h-4 w-4" />} label="Definições de email deste contacto" />
            <SideLink icon={<Send className="h-4 w-4" />} label="Origem: Nenhuma" />
            <SideLink icon={<Info className="h-4 w-4" />} label="Ver mais informação" />
            <SideLink icon={<Send className="h-4 w-4" />} label="Enviar pedido de atualização" last />
          </div>

          {/* Próximos bookings */}
          <div className="overflow-hidden rounded-md border border-border bg-surface">
            <div className="border-b border-border px-4 py-3 text-sm font-semibold">Próximos bookings</div>
            <div className="flex gap-1 border-b border-border px-3 py-2">
              {([["all", "Todos"], ["bookings", "Bookings"], ["contracts", "Contratos"]] as [Tab, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`rounded px-2.5 py-1 text-xs font-medium ${
                      tab === key ? "bg-brand text-white" : "text-muted hover:bg-surface-2"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
            <div className="divide-y divide-border">
              {shown.map((b) => {
                const artist = artistById(b.artistId);
                return (
                  <div key={b.id} className="flex items-center gap-2 px-4 py-2.5">
                    <CalIcon className="h-4 w-4 shrink-0 text-muted" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-muted">
                        {format(parseISO(b.start), "dd/MM/yyyy", { locale: pt })}
                      </div>
                      <Link href={`/bookings/${b.id}`} className="block truncate text-sm text-link hover:underline">
                        {b.name} <span className="text-muted">({artist?.name})</span>
                      </Link>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                );
              })}
              {shown.length === 0 && (
                <div className="px-4 py-8 text-center text-xs text-muted">Sem bookings.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolbarBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-muted hover:bg-surface-2">
      {icon} {label}
    </button>
  );
}

function SideLink({
  icon,
  label,
  href,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  last?: boolean;
}) {
  const cls = `flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-link hover:bg-surface-2 ${
    last ? "" : "border-b border-border"
  }`;
  const inner = (
    <>
      <span className="shrink-0 text-link">{icon}</span>
      {label}
    </>
  );
  return href ? (
    <Link href={href} className={cls}>{inner}</Link>
  ) : (
    <button className={cls}>{inner}</button>
  );
}
