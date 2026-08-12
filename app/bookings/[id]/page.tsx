"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Pencil,
  MapPin,
  Plus,
  UserPlus,
  CheckSquare,
  FileText,
  FileSignature,
  Route,
  Upload,
  FileUp,
  Send,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { eur } from "@/lib/utils";
import { Card, StatusBadge } from "@/components/ui";
import { BOOKING_STATUS_ORDER, STATUS_META, type BookingStatus } from "@/lib/types";

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { bookingById, artistById, contactById, setBookingStatus } = useStore();
  const b = bookingById(id);

  if (!b) {
    return (
      <div className="py-20 text-center text-sm text-muted">
        Booking não encontrado.{" "}
        <Link href="/bookings" className="text-link hover:underline">Voltar aos bookings</Link>
      </div>
    );
  }

  const artist = artistById(b.artistId);
  const promoter = contactById(b.promoterId);
  const venue = contactById(b.venueId);

  return (
    <div>
      <Link href="/bookings" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Bookings
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Coluna principal */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{b.name}</h1>
                <div className="mt-1 text-sm text-muted">
                  {format(parseISO(b.start), "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })}
                  {b.end && b.end !== b.start && ` — ${format(parseISO(b.end), "d MMM yyyy", { locale: pt })}`}
                </div>
              </div>
              <button className="rounded-md border border-border p-1.5 text-muted hover:bg-surface-2">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-border pt-3 text-xs text-muted">
              <span>Adicionado a 26/04/2026 por {b.agent}</span>
              <span>ID: <span className="font-mono">{b.id}</span></span>
              <span>Última alteração: N/D</span>
            </div>
          </Card>

          <Section title="Promotor">
            {promoter ? (
              <ContactLine name={promoter.name} org={promoter.company} email={promoter.email} />
            ) : (
              <SelectLink />
            )}
          </Section>

          <Section title="Sala">
            {venue ? (
              <div>
                <div className="font-medium text-link">{venue.name}</div>
                <div className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                  <MapPin className="h-3.5 w-3.5" /> {b.venue}, {b.city}
                </div>
              </div>
            ) : (
              <SelectLink />
            )}
          </Section>

          <Section
            title="Artista"
            titleExtra={
              <span className="ml-1 inline-flex gap-1">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-green/15 text-green"><UserPlus className="h-3 w-3" /></span>
                <span className="flex h-5 w-5 items-center justify-center rounded bg-green/15 text-green"><Check className="h-3 w-3" /></span>
              </span>
            }
          >
            {artist ? (
              <div>
                <div className="font-medium text-link">{artist.name}</div>
                <div className="text-sm text-muted">{artist.genre} · {artist.city}</div>
              </div>
            ) : (
              <SelectLink />
            )}
          </Section>

          <Section title="Outros contactos">
            <SelectLink />
          </Section>
        </div>

        {/* Barra lateral direita */}
        <div className="space-y-4">
          <Card className="p-4">
            <label className="mb-1 block text-xs font-medium text-muted">Estado do booking</label>
            <div className="mb-3 flex items-center gap-2">
              <select
                value={b.status}
                onChange={(e) => setBookingStatus(b.id, e.target.value as BookingStatus)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-link"
              >
                {BOOKING_STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{STATUS_META[s].label}</option>
                ))}
              </select>
            </div>
            <div className="mb-3"><StatusBadge status={b.status} /></div>

            <div className="grid grid-cols-2 gap-2 border-t border-border pt-3 text-sm">
              <div>
                <div className="text-xs text-muted">Agente</div>
                <div className="font-medium">{b.agent}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Cachet</div>
                <div className="font-medium">{eur(b.fee)}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Assistente</div>
                <div className="font-medium">{b.assistant ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Comissão</div>
                <div className="font-medium">{eur(b.commission)}</div>
              </div>
            </div>

            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-green px-3 py-2 text-sm font-medium text-white hover:bg-green-dark">
              <UserPlus className="h-4 w-4" /> Adicionar membro à equipa
            </button>
            <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-surface-2">
              <CheckSquare className="h-4 w-4" /> Adicionar tarefa
            </button>
          </Card>

          <Card className="divide-y divide-border">
            <Action icon={<FileText className="h-4 w-4" />} label="Criar contrato" />
            <Action icon={<Route className="h-4 w-4" />} label="Criar itinerário" />
            <Action icon={<FileSignature className="h-4 w-4" />} label="Criar rider técnico" />
            <Action icon={<Upload className="h-4 w-4" />} label="Carregar contrato" />
            <Action icon={<FileUp className="h-4 w-4" />} label="Carregar ficheiro" />
            <Action icon={<Send className="h-4 w-4" />} label="Pedir informação ao promotor" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  titleExtra,
  children,
}: {
  title: string;
  titleExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-2 flex items-center text-base font-semibold">
        {title}
        {titleExtra}
        <button className="ml-auto rounded p-1 text-muted hover:bg-surface-2">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {children}
    </Card>
  );
}

function ContactLine({ name, org, email }: { name: string; org?: string; email: string }) {
  return (
    <div>
      <div className="font-medium text-link">{name}</div>
      <div className="text-sm text-muted">{org}</div>
      <div className="text-sm text-muted">{email}</div>
    </div>
  );
}

function SelectLink() {
  return (
    <button className="text-sm text-link hover:underline">
      Selecionar dos contactos
    </button>
  );
}

function Action({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-link hover:bg-surface-2">
      <span className="text-muted">{icon}</span>
      {label}
    </button>
  );
}
