"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HelpCircle, Trash2, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui";

const COLORS = ["#e0533d", "#2f9e6f", "#3d7de0", "#9b59b6", "#e08b2f", "#16a0a0"];

export default function NewPersonPage() {
  const router = useRouter();
  const { addContact } = useStore();
  const [first, setFirst] = useState("");
  const [surname, setSurname] = useState("");
  const [group, setGroup] = useState("");
  const [jobtitle, setJobtitle] = useState("");
  const [company, setCompany] = useState("");

  const suggestions = ["Big Band", "Taylor Promotions", "Positive Promotions"].filter(
    (s) => group && s.toLowerCase().startsWith(group.toLowerCase()) && s.toLowerCase() !== group.toLowerCase()
  );

  const save = () => {
    const name = `${first} ${surname}`.trim();
    if (!name) return;
    addContact({
      kind: "person",
      name,
      company: company || undefined,
      role: jobtitle || undefined,
      email: `${first.toLowerCase()}@email.pt`,
      tags: group ? [group] : [],
      color: COLORS[Math.floor(name.length % COLORS.length)],
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
          <div className="flex h-16 w-16 items-center justify-center rounded-md border border-border bg-surface text-muted">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-semibold">Adicionar nova pessoa</h1>
        </div>

        {/* Nome */}
        <div className="grid grid-cols-1 gap-4 border-b border-border bg-surface-2/40 px-6 py-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold">Primeiro nome</label>
            <input className={field} value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Mark" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Apelido</label>
            <input className={field} value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Smith" />
          </div>
        </div>

        {/* Alias */}
        <Row label={<span className="inline-flex items-center gap-1.5">Alias <HelpCircle className="h-4 w-4 text-muted" /></span>}>
          <button className="text-sm text-link hover:underline">Adicionar um alias</button>
        </Row>

        {/* Empresa */}
        <Row label="Empresa">
          <input
            className={`${field} max-w-xs`}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Adicionar uma empresa"
          />
        </Row>

        {/* Grupo + cargo */}
        <Row label="Grupo">
          <div className="flex flex-wrap items-start gap-3">
            <div className="relative w-full max-w-[240px]">
              <input
                className={field}
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Big"
              />
              {suggestions.length > 0 && (
                <div className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-lg">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setGroup(s)}
                      className="block w-full bg-link px-3 py-1.5 text-left text-sm text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                className={`${field} w-56`}
                value={jobtitle}
                onChange={(e) => setJobtitle(e.target.value)}
                placeholder="Adicionar um cargo"
              />
              <button className="rounded-md border border-border p-2 text-muted hover:bg-surface-2">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button className="mt-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-surface-2">
            Adicionar outro
          </button>
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
