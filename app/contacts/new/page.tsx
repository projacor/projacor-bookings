"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HelpCircle, User, Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import { ALL_TAGS, tagColor } from "@/lib/types";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

const COLORS = ["#e0533d", "#2f9e6f", "#3d7de0", "#9b59b6", "#e08b2f", "#16a0a0"];

export default function NewPersonPage() {
  const router = useRouter();
  const { addContact } = useStore();
  const [form, setForm] = useState({
    first: "",
    surname: "",
    company: "",
    role: "",
    email: "",
    phone: "",
    city: "",
    region: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string>("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTag = (t: string) =>
    setTags((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]));

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    const name = `${form.first} ${form.surname}`.trim();
    if (!name) return;
    addContact({
      kind: "person",
      name,
      company: form.company || undefined,
      role: form.role || undefined,
      email: form.email || `${form.first.toLowerCase()}@email.pt`,
      mobile: form.phone || undefined,
      city: form.city || undefined,
      region: form.region || undefined,
      tags,
      color: COLORS[name.length % COLORS.length],
      avatar: avatar || undefined,
    });
    router.push("/contacts");
  };

  const field =
    "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-link focus:ring-2 focus:ring-link/20";

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 bg-surface-2/70 px-6 py-5">
          <label
            title="Carregar avatar"
            className="group relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-border bg-surface text-muted hover:border-link"
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-8 w-8" />
            )}
            <span className="absolute inset-0 hidden items-center justify-center bg-black/40 text-[10px] font-medium text-white group-hover:flex">
              <Upload className="h-4 w-4" />
            </span>
            <input type="file" accept="image/*" onChange={onAvatar} className="hidden" />
          </label>
          <div>
            <h1 className="text-xl font-semibold">Adicionar nova pessoa</h1>
            <p className="text-xs text-muted">Clica na imagem para carregar um avatar.</p>
          </div>
        </div>

        {/* Nome */}
        <div className="grid grid-cols-1 gap-4 border-b border-border bg-surface-2/40 px-6 py-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold">Primeiro nome</label>
            <input className={field} value={form.first} onChange={(e) => set("first", e.target.value)} placeholder="Mark" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Apelido</label>
            <input className={field} value={form.surname} onChange={(e) => set("surname", e.target.value)} placeholder="Smith" />
          </div>
        </div>

        {/* Alias */}
        <Row label={<span className="inline-flex items-center gap-1.5">Alias <HelpCircle className="h-4 w-4 text-muted" /></span>}>
          <button className="text-sm text-link hover:underline">Adicionar um alias</button>
        </Row>

        {/* Empresa + Cargo */}
        <Row label="Empresa">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input className={field} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Adicionar uma empresa" />
            <input className={field} value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Cargo (ex.: Promotor)" />
          </div>
        </Row>

        {/* Email */}
        <Row label="Email">
          <input type="email" className={`${field} max-w-md`} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="nome@email.pt" />
        </Row>

        {/* Telefone */}
        <Row label="Telefone">
          <input className={`${field} max-w-xs`} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+351 912 000 000" />
        </Row>

        {/* Localidade + Região */}
        <Row label="Localidade">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input className={field} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Localidade (ex.: Sintra)" />
            <input className={field} value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="Região (ex.: Lisboa)" />
          </div>
        </Row>

        {/* Etiquetas */}
        <Row label="Etiquetas">
          <div className="flex flex-wrap gap-1.5">
            {ALL_TAGS.map((t) => {
              const color = tagColor(t);
              const on = tags.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  className={cn(
                    "rounded border px-2 py-1 text-xs font-medium transition-colors",
                    on ? "text-white" : "bg-surface hover:bg-surface-2"
                  )}
                  style={on ? { backgroundColor: color, borderColor: color } : { color, borderColor: color }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Row>

        {/* Ações */}
        <div className="flex justify-end gap-2 px-6 py-4">
          <Link href="/contacts" className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface-2">
            Cancelar
          </Link>
          <button onClick={save} className="rounded-md bg-link px-4 py-2 text-sm font-medium text-white hover:bg-link-dark">
            Guardar pessoa
          </button>
        </div>
      </Card>
    </div>
  );
}

function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border px-6 py-5 sm:flex-row sm:gap-6">
      <div className="w-28 shrink-0 pt-2 text-sm font-semibold">{label}:</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
