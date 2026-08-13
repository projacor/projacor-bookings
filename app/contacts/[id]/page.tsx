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
  Trash2,
  Image as ImageIcon,
  Mail,
  Info,
  Send,
  CheckSquare,
  Check,
  Calendar as CalIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { initials } from "@/lib/utils";
import { ALL_TAGS, tagColor } from "@/lib/types";
import type { Contact } from "@/lib/types";
import { Avatar, StatusBadge } from "@/components/ui";

type Note = { id: string; date: string; author: string; text: string };
type Tab = "all" | "bookings" | "contracts";

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { contactById, bookings, artistById, tasks, updateContact, addTask, toggleTask } = useStore();
  const c = contactById(id);

  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState<Note[]>([
    { id: "n1", date: "2026-07-02", author: "Ben Jones", text: "Sugeriu o Big Band para o festival de verão." },
  ]);
  const [tab, setTab] = useState<Tab>("all");
  const [showTags, setShowTags] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);

  if (!c) {
    return (
      <div className="py-20 text-center text-sm text-muted">
        Contacto não encontrado.{" "}
        <Link href="/contacts" className="text-link hover:underline">Voltar aos contactos</Link>
      </div>
    );
  }

  const related = bookings
    .filter((b) => b.promoterId === c.id || b.venueId === c.id)
    .sort((a, b) => a.start.localeCompare(b.start));
  const shown = tab === "contracts"
    ? related.filter((b) => ["contract_sent", "contract_signed", "fully_executed"].includes(b.status))
    : related;

  const contactTasks = tasks.filter((t) => t.contactId === c.id);
  const availableTags = ALL_TAGS.filter((t) => !c.tags.includes(t));

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateContact(c.id, { avatar: reader.result as string });
    reader.readAsDataURL(file);
  };
  const addNote = () => {
    if (!draft.trim()) return;
    setNotes((n) => [{ id: `n${n.length + 2}`, date: "2026-08-13", author: "Ben Jones", text: draft.trim() }, ...n]);
    setDraft("");
  };

  return (
    <div>
      <Link href="/contacts" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Contactos
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        {/* ---------------- Coluna principal ---------------- */}
        <div className="space-y-4">
          {/* Cabeçalho */}
          <div className="overflow-hidden rounded-md border border-border bg-surface">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold">{c.name}</h1>
                    <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold text-muted">{initials(c.name)}</span>
                    <CalendarDays className="h-4 w-4 text-muted" />
                  </div>
                  <div className="mt-1 text-sm">
                    {c.role}
                    {c.company && c.kind === "person" && (<> em <span className="text-link">{c.company}</span></>)}
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-semibold">Email:</span>{" "}
                    <a href={`mailto:${c.email}`} className="text-link hover:underline">{c.email}</a>
                  </div>
                  {c.mobile && (
                    <div className="mt-1 text-sm">
                      <span className="font-semibold">Telefone:</span>{" "}
                      <a href={`tel:${c.mobile}`} className="text-link hover:underline">{c.mobile}</a>
                    </div>
                  )}
                  {(c.city || c.region) && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-link">
                      <MapPin className="h-4 w-4" />
                      {[c.city, c.region].filter(Boolean).join(", ")}
                    </div>
                  )}
                  {/* Etiquetas */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {c.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: tagColor(t) }}>
                        {t}
                        <button onClick={() => updateContact(c.id, { tags: c.tags.filter((x) => x !== t) })} className="hover:opacity-70">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {c.tags.length === 0 && <span className="text-xs text-muted">Sem etiquetas</span>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
                    <span>Adicionado 26/04/2026 por <span className="text-link">Ben Jones</span></span>
                    <span>Última atualização 02/07/2026 por <span className="text-link">Ben Jones</span></span>
                  </div>
                </div>
                <Avatar name={c.name} color={c.color} size={72} square avatar={c.avatar} />
              </div>
            </div>

            {/* Barra de ações */}
            <div className="flex divide-x divide-border border-t border-border text-sm">
              <button onClick={() => setEditOpen(true)} className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-muted hover:bg-surface-2">
                <Pencil className="h-4 w-4" /> Editar contacto
              </button>
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 px-3 py-2.5 text-muted hover:bg-surface-2">
                <Upload className="h-4 w-4" /> Carregar avatar
                <input type="file" accept="image/*" onChange={onAvatar} className="hidden" />
              </label>
              <button onClick={() => setShowTags((v) => !v)} className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-muted hover:bg-surface-2">
                <Tag className="h-4 w-4" /> Adicionar etiqueta
              </button>
            </div>

            {/* Seletor de etiquetas */}
            {showTags && (
              <div className="border-t border-border bg-surface-2/40 px-5 py-3">
                {availableTags.length === 0 ? (
                  <span className="text-xs text-muted">Todas as etiquetas já foram adicionadas.</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.map((t) => (
                      <button
                        key={t}
                        onClick={() => updateContact(c.id, { tags: [...c.tags, t] })}
                        className="rounded border px-2 py-1 text-xs font-medium hover:bg-surface"
                        style={{ color: tagColor(t), borderColor: tagColor(t) }}
                      >
                        + {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
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
              <button onClick={addNote} className="rounded-md bg-link px-4 py-2 text-sm font-medium text-white hover:bg-link-dark">
                Adicionar nota
              </button>
            </div>
            {notes.length > 0 && (
              <div className="mt-5 divide-y divide-border border-t border-border">
                {notes.map((n) => (
                  <div key={n.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-semibold">{format(parseISO(n.date), "dd/MM/yyyy", { locale: pt })}</span>{" "}
                        <span className="text-link">Nota por {n.author}</span>
                      </div>
                      <div className="flex gap-1 text-muted">
                        <button className="rounded border border-border p-1 hover:bg-surface-2"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setNotes((x) => x.filter((y) => y.id !== n.id))} className="rounded border border-border p-1 hover:bg-surface-2">
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
          <button onClick={() => setTaskOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface py-2.5 text-sm font-medium hover:bg-surface-2">
            <CheckSquare className="h-4 w-4" /> Adicionar tarefa
          </button>

          {/* Tarefas do contacto */}
          {contactTasks.length > 0 && (
            <div className="overflow-hidden rounded-md border border-border bg-surface">
              <div className="border-b border-border px-4 py-3 text-sm font-semibold">Tarefas</div>
              <div className="divide-y divide-border">
                {contactTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2.5 px-4 py-2.5">
                    <button
                      onClick={() => toggleTask(t.id)}
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${t.done ? "border-green bg-green text-white" : "border-border"}`}
                    >
                      {t.done && <Check className="h-3 w-3" />}
                    </button>
                    <span className={`flex-1 text-sm ${t.done ? "text-muted line-through" : ""}`}>{t.title}</span>
                    <span className="text-[11px] text-muted">{format(parseISO(t.due), "d MMM", { locale: pt })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              {([["all", "Todos"], ["bookings", "Bookings"], ["contracts", "Contratos"]] as [Tab, string][]).map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)} className={`rounded px-2.5 py-1 text-xs font-medium ${tab === key ? "bg-brand text-white" : "text-muted hover:bg-surface-2"}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="divide-y divide-border">
              {shown.map((b) => {
                const artist = artistById(b.artistId);
                return (
                  <div key={b.id} className="flex items-center gap-2 px-4 py-2.5">
                    <CalIcon className="h-4 w-4 shrink-0 text-muted" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-muted">{format(parseISO(b.start), "dd/MM/yyyy", { locale: pt })}</div>
                      <Link href={`/bookings/${b.id}`} className="block truncate text-sm text-link hover:underline">
                        {b.name} <span className="text-muted">({artist?.name})</span>
                      </Link>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                );
              })}
              {shown.length === 0 && <div className="px-4 py-8 text-center text-xs text-muted">Sem bookings.</div>}
            </div>
          </div>
        </div>
      </div>

      {editOpen && <EditModal contact={c} onSave={(patch) => { updateContact(c.id, patch); setEditOpen(false); }} onClose={() => setEditOpen(false)} />}
      {taskOpen && <TaskModal name={c.name} onSave={(t) => { addTask({ ...t, contactId: c.id, done: false, assignee: "Ben Jones" }); setTaskOpen(false); }} onClose={() => setTaskOpen(false)} />}
    </div>
  );
}

function SideLink({ icon, label, href, last }: { icon: React.ReactNode; label: string; href?: string; last?: boolean }) {
  const cls = `flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-link hover:bg-surface-2 ${last ? "" : "border-b border-border"}`;
  const inner = (<><span className="shrink-0 text-link">{icon}</span>{label}</>);
  return href ? <Link href={href} className={cls}>{inner}</Link> : <button className={cls}>{inner}</button>;
}

const field = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-link focus:ring-2 focus:ring-link/20";
const flabel = "mb-1 block text-xs font-medium text-muted";

function EditModal({ contact, onSave, onClose }: { contact: Contact; onSave: (p: Partial<Contact>) => void; onClose: () => void }) {
  const [f, setF] = useState({
    name: contact.name,
    role: contact.role ?? "",
    company: contact.company ?? "",
    email: contact.email,
    mobile: contact.mobile ?? "",
    city: contact.city ?? "",
    region: contact.region ?? "",
  });
  const set = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }));
  return (
    <Modal title="Editar contacto" onClose={onClose}>
      <div className="space-y-3">
        <div><label className={flabel}>Nome</label><input className={field} value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={flabel}>Empresa</label><input className={field} value={f.company} onChange={(e) => set("company", e.target.value)} /></div>
          <div><label className={flabel}>Cargo</label><input className={field} value={f.role} onChange={(e) => set("role", e.target.value)} /></div>
        </div>
        <div><label className={flabel}>Email</label><input className={field} value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div><label className={flabel}>Telefone</label><input className={field} value={f.mobile} onChange={(e) => set("mobile", e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={flabel}>Localidade</label><input className={field} value={f.city} onChange={(e) => set("city", e.target.value)} /></div>
          <div><label className={flabel}>Região</label><input className={field} value={f.region} onChange={(e) => set("region", e.target.value)} /></div>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface-2">Cancelar</button>
        <button
          onClick={() => onSave({ name: f.name.trim() || contact.name, role: f.role || undefined, company: f.company || undefined, email: f.email, mobile: f.mobile || undefined, city: f.city || undefined, region: f.region || undefined })}
          className="rounded-md bg-link px-4 py-2 text-sm font-medium text-white hover:bg-link-dark"
        >
          Guardar
        </button>
      </div>
    </Modal>
  );
}

function TaskModal({ name, onSave, onClose }: { name: string; onSave: (t: { title: string; due: string; priority: "baixa" | "media" | "alta" }) => void; onClose: () => void }) {
  const [title, setTitle] = useState(`Contactar ${name}`);
  const [due, setDue] = useState("2026-08-20");
  const [priority, setPriority] = useState<"baixa" | "media" | "alta">("media");
  return (
    <Modal title="Adicionar tarefa" onClose={onClose}>
      <div className="space-y-3">
        <div><label className={flabel}>Tarefa</label><input autoFocus className={field} value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={flabel}>Prazo</label><input type="date" className={field} value={due} onChange={(e) => setDue(e.target.value)} /></div>
          <div>
            <label className={flabel}>Prioridade</label>
            <select className={field} value={priority} onChange={(e) => setPriority(e.target.value as "baixa" | "media" | "alta")}>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface-2">Cancelar</button>
        <button onClick={() => title.trim() && onSave({ title: title.trim(), due, priority })} className="rounded-md bg-link px-4 py-2 text-sm font-medium text-white hover:bg-link-dark">
          Adicionar
        </button>
      </div>
    </Modal>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[8vh]" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg border border-border bg-surface shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface-2"><X className="h-4 w-4" /></button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
