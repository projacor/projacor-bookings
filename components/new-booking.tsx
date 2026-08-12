"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { BOOKING_STATUS_ORDER, STATUS_META, type BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NewBookingButton({
  variant = "solid",
  label = "Adicionar booking",
}: {
  variant?: "solid" | "ghost" | "green";
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
          variant === "solid" && "bg-link text-white hover:bg-link-dark",
          variant === "green" && "bg-green text-white hover:bg-green-dark",
          variant === "ghost" &&
            "border border-border bg-surface text-foreground hover:bg-surface-2"
        )}
      >
        <Plus className="h-4 w-4" strokeWidth={2.2} />
        {label}
      </button>
      {open && <Dialog onClose={() => setOpen(false)} />}
    </>
  );
}

function Dialog({ onClose }: { onClose: () => void }) {
  const { artists, contacts, addBooking } = useStore();
  const promoters = contacts.filter((c) => c.tags.includes("Promotor"));
  const venues = contacts.filter((c) => c.tags.includes("Sala") || c.tags.includes("Câmara"));

  const [form, setForm] = useState({
    name: "",
    artistId: artists[0]?.id ?? "",
    promoterId: promoters[0]?.id ?? "",
    venueId: venues[0]?.id ?? "",
    start: "",
    end: "",
    city: "",
    venue: "",
    fee: "",
    status: "enquiry" as BookingStatus,
    agent: "Ben Jones",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.start) return;
    const fee = Number(form.fee) || 0;
    addBooking({
      name: form.name,
      artistId: form.artistId,
      promoterId: form.promoterId,
      venueId: form.venueId,
      start: form.start,
      end: form.end || undefined,
      city: form.city,
      venue: form.venue,
      fee,
      commission: Math.round(fee * 0.1),
      status: form.status,
      agent: form.agent,
    });
    onClose();
  };

  const field =
    "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-link focus:ring-2 focus:ring-link/20";
  const label = "mb-1 block text-xs font-medium text-muted";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[5vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-base font-semibold">Adicionar booking</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface-2">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 px-5 py-5">
          <div>
            <label className={label}>Nome do booking</label>
            <input
              autoFocus
              className={field}
              placeholder="Ex.: Razzmatazz, Barcelona"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Artista</label>
              <select className={field} value={form.artistId} onChange={(e) => set("artistId", e.target.value)}>
                {artists.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Estado</label>
              <select className={field} value={form.status} onChange={(e) => set("status", e.target.value)}>
                {BOOKING_STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{STATUS_META[s].label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Promotor</label>
              <select className={field} value={form.promoterId} onChange={(e) => set("promoterId", e.target.value)}>
                {promoters.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Sala</label>
              <select className={field} value={form.venueId} onChange={(e) => set("venueId", e.target.value)}>
                {venues.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Data (início)</label>
              <input type="date" className={field} value={form.start} onChange={(e) => set("start", e.target.value)} />
            </div>
            <div>
              <label className={label}>Data (fim, opcional)</label>
              <input type="date" className={field} value={form.end} onChange={(e) => set("end", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={label}>Cidade</label>
              <input className={field} placeholder="Ex.: Barcelona" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <label className={label}>Local</label>
              <input className={field} placeholder="Ex.: Razzmatazz" value={form.venue} onChange={(e) => set("venue", e.target.value)} />
            </div>
            <div>
              <label className={label}>Cachet (€)</label>
              <input type="number" className={field} placeholder="0" value={form.fee} onChange={(e) => set("fee", e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface-2">
              Cancelar
            </button>
            <button type="submit" className="rounded-md bg-link px-4 py-2 text-sm font-medium text-white hover:bg-link-dark">
              Criar booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
