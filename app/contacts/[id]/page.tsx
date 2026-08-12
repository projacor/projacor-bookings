"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { ArrowLeft, Pencil, Calendar as CalIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { eur } from "@/lib/utils";
import { Avatar, Card, StatusBadge, TagChip } from "@/components/ui";

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { contactById, bookings, artistById } = useStore();
  const c = contactById(id);

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

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/contacts"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Contactos
      </Link>

      {/* Ficha do contacto — estilo secções */}
      <Card className="overflow-hidden">
        {/* Banda de topo */}
        <div
          className="flex items-center gap-4 border-b border-border px-6 py-5"
          style={{ backgroundColor: "rgba(214,73,47,0.06)" }}
        >
          <Avatar name={c.name} color={c.color} size={56} square={c.kind === "company"} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-semibold">{c.name}</h1>
              {c.kind === "company" && (
                <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">
                  Empresa
                </span>
              )}
            </div>
            {c.role && <div className="text-sm text-muted">{c.role}</div>}
          </div>
          <button className="self-start rounded-md border border-border bg-surface p-1.5 text-muted hover:bg-surface-2">
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        {/* Linhas */}
        <Row label="Email">
          <a href={`mailto:${c.email}`} className="text-sm text-link hover:underline">
            {c.email}
          </a>
        </Row>
        <Row label="Telemóvel">
          {c.mobile ? (
            <span className="text-sm">{c.mobile}</span>
          ) : (
            <button className="text-sm text-link hover:underline">Adicionar um telemóvel</button>
          )}
        </Row>
        <Row label="Empresa">
          {c.company && c.kind === "person" ? (
            <span className="text-sm">{c.company}</span>
          ) : (
            <button className="text-sm text-link hover:underline">Adicionar uma empresa</button>
          )}
        </Row>
        <Row label="Localidade">
          {c.city ? (
            <span className="text-sm">{c.city}</span>
          ) : (
            <button className="text-sm text-link hover:underline">Adicionar localidade</button>
          )}
        </Row>
        <Row label="Etiquetas" last>
          <div className="flex flex-wrap items-center gap-1.5">
            {c.tags.map((t) => (
              <TagChip key={t} label={t} />
            ))}
            <button className="text-sm text-link hover:underline">+ Adicionar etiqueta</button>
          </div>
        </Row>
      </Card>

      {/* Bookings associados */}
      <Card className="mt-4 overflow-hidden">
        <div className="border-b border-border px-6 py-3.5">
          <h2 className="text-sm font-semibold">
            Bookings associados{" "}
            <span className="font-normal text-muted">({related.length})</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2/60 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Booking</th>
                <th className="px-6 py-3">Artista</th>
                <th className="px-6 py-3 text-right">Cachet</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {related.map((b) => {
                const artist = artistById(b.artistId);
                return (
                  <tr key={b.id} className="hover:bg-surface-2/40">
                    <td className="whitespace-nowrap px-6 py-3 text-muted">
                      {format(parseISO(b.start), "dd/MM/yyyy", { locale: pt })}
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/bookings/${b.id}`}
                        className="inline-flex items-center gap-1.5 font-medium text-link hover:underline"
                      >
                        <CalIcon className="h-3.5 w-3.5" /> {b.name}
                      </Link>
                    </td>
                    <td className="px-6 py-3">{artist?.name}</td>
                    <td className="px-6 py-3 text-right font-medium">{eur(b.fee)}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                );
              })}
              {related.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted">
                    Sem bookings associados a este contacto.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Row({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-6 ${
        last ? "" : "border-b border-border"
      }`}
    >
      <div className="w-28 shrink-0 text-sm font-semibold">{label}:</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
