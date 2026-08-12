"use client";

import { Inbox, Send, Star, Search, PenSquare } from "lucide-react";
import { Avatar, Card, PageHeader } from "@/components/ui";

const MESSAGES = [
  { from: "Taylor Promotions", subject: "Confirmação — Razzmatazz, Barcelona", preview: "Bom dia, seguem em anexo os detalhes técnicos para o evento…", time: "09:14", unread: true, color: "#e0533d" },
  { from: "Câmara Municipal de Sintra", subject: "Concerto de Verão — logística", preview: "Enviamos as informações sobre o palco e o horário de montagem…", time: "Ontem", unread: true, color: "#3d7de0" },
  { from: "Elbphilharmonie", subject: "Rider técnico recebido", preview: "Confirmamos a receção do rider. Ficamos a aguardar o contrato…", time: "Ontem", unread: false, color: "#8e44ad" },
  { from: "Isaac Rivers", subject: "Re: DJ Rhythm @ La Riviera", preview: "Perfeito, podemos avançar com as datas propostas para setembro…", time: "Seg", unread: false, color: "#2f9e6f" },
  { from: "Positive Promotions", subject: "Proposta de tour — outono 2026", preview: "Gostaríamos de discutir uma possível digressão pela península…", time: "Seg", unread: false, color: "#16a0a0" },
];

const FOLDERS = [
  { label: "Caixa de entrada", icon: Inbox, count: 2, active: true },
  { label: "Enviados", icon: Send },
  { label: "Com estrela", icon: Star },
];

export default function MailPage() {
  return (
    <div>
      <PageHeader
        title="Mail"
        subtitle="Comunicação com promotores, salas e clientes."
        action={
          <button className="inline-flex items-center gap-1.5 rounded-md bg-link px-3.5 py-2 text-sm font-medium text-white hover:bg-link-dark">
            <PenSquare className="h-4 w-4" /> Escrever
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr]">
        <Card className="h-fit p-2">
          {FOLDERS.map((f) => (
            <button
              key={f.label}
              className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm ${f.active ? "bg-brand/10 font-medium text-brand" : "text-foreground hover:bg-surface-2"}`}
            >
              <f.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{f.label}</span>
              {f.count && <span className="rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white">{f.count}</span>}
            </button>
          ))}
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-link focus:ring-2 focus:ring-link/20"
                placeholder="Procurar no email…"
              />
            </div>
          </div>
          <div className="divide-y divide-border">
            {MESSAGES.map((m, i) => (
              <div key={i} className={`flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-surface-2/50 ${m.unread ? "bg-link/[0.03]" : ""}`}>
                <Avatar name={m.from} color={m.color} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`truncate text-sm ${m.unread ? "font-semibold" : "font-medium"}`}>{m.from}</span>
                    {m.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-link" />}
                  </div>
                  <div className={`truncate text-sm ${m.unread ? "font-medium" : "text-muted"}`}>{m.subject}</div>
                  <div className="truncate text-xs text-muted">{m.preview}</div>
                </div>
                <span className="shrink-0 text-xs text-muted">{m.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
