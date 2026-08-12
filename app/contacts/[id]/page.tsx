"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Pencil,
  Calendar as CalIcon,
} from "lucide-react";
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
    <div>
      <Link
        href="/contacts"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Contactos
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        {/* Cartão do contacto */}
        <Card className="h-fit p-5">
          <div className="flex items-center gap-3">
            <Avatar name={c.name} color={c.color} size={56} square={c.kind === "company"} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-semibold">{c.name}</h1>
                {c.kind === "company" && (
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted">
                    Empresa
                  </span>
                )}
              </div>
              {c.role && <div className="text-sm text-muted">{c.role}</div>}
            </div>
            <button className="ml-auto self-start rounded-md border border-border p-1.5 text-muted hover:bg-surface-2">
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-link hover:underline">
              <Mail className="h-4 w-4 shrink-0 text-muted" /> {c.email}
            </a>
            {c.mobile && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-muted" /> {c.mobile}
              </div>
            )}
            {c.company && c.kind === "person" && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 shrink-0 text-muted" /> {c.company}
              </div>
            )}
            {c.city && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-muted" /> {c.city}
              </div>
            )}
          </div>

          {c.tags.length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Etiquetas
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <TagChip key={t} label={t} />
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Bookings associados */}
        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold">
              Bookings associados{" "}
              <span className="font-normal text-muted">({related.length})</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2/60 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-5 py-3">Data</th>
                  <th className="px-5 py-3">Booking</th>
                  <th className="px-5 py-3">Artista</th>
                  <th className="px-5 py-3 text-right">Cachet</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {related.map((b) => {
                  const artist = artistById(b.artistId);
                  return (
                    <tr key={b.id} className="hover:bg-surface-2/40">
                      <td className="whitespace-nowrap px-5 py-3 text-muted">
                        {format(parseISO(b.start), "dd/MM/yyyy", { locale: pt })}
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/bookings/${b.id}`}
                          className="inline-flex items-center gap-1.5 font-medium text-link hover:underline"
                        >
                          <CalIcon className="h-3.5 w-3.5" /> {b.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3">{artist?.name}</td>
                      <td className="px-5 py-3 text-right font-medium">{eur(b.fee)}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  );
                })}
                {related.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted">
                      Sem bookings associados a este contacto.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
