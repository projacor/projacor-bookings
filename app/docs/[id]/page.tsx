"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Upload,
  Plus,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Video,
  Music,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui";
import type { MediaItem } from "@/lib/types";

export default function DocDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { docs, artistById } = useStore();
  const doc = docs.find((d) => d.id === id);

  if (!doc) {
    return (
      <div className="py-20 text-center text-sm text-muted">
        Página não encontrada.{" "}
        <Link href="/docs" className="text-link hover:underline">Voltar aos docs</Link>
      </div>
    );
  }
  const artist = artistById(doc.artistId ?? "");

  return (
    <div>
      <Link href="/docs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Docs
      </Link>

      {/* Barra de ações da página */}
      <Card className="mb-4 flex flex-wrap items-center gap-2 px-4 py-3">
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-2">
          <Pencil className="h-4 w-4" /> Editar página
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-2">
          <Upload className="h-4 w-4" /> Carregar conteúdo
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-2">
          <Plus className="h-4 w-4" /> Nova página
        </button>
        <span className="ml-auto">
          {doc.visible ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-green px-3 py-1.5 text-sm font-medium text-white">
              <Eye className="h-4 w-4" /> Visível
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white">
              <EyeOff className="h-4 w-4" /> Oculto
            </span>
          )}
        </span>
      </Card>

      <Card className="overflow-hidden">
        <div className="h-40 w-full" style={{ background: `linear-gradient(120deg, ${artist?.color ?? "#555"}, #1b1c21)` }} />
        <div className="p-6">
          <h1 className="text-2xl font-semibold tracking-tight">{doc.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{doc.bio}</p>

          <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Media</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doc.media.map((m, i) => (
              <MediaCard key={i} item={m} color={artist?.color ?? "#555"} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function MediaCard({ item, color }: { item: MediaItem; color: string }) {
  const icon =
    item.kind === "youtube" ? (
      <Video className="h-8 w-8" />
    ) : item.kind === "audio" ? (
      <Music className="h-8 w-8" />
    ) : (
      <ImageIcon className="h-8 w-8" />
    );
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex h-32 items-center justify-center text-white/80" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="px-3 py-2">
        <div className="truncate text-sm font-medium">{item.caption}</div>
        <div className="text-xs text-muted">{item.meta}</div>
      </div>
    </div>
  );
}
