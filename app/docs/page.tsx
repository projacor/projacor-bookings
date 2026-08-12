"use client";

import Link from "next/link";
import { FileText, Eye, EyeOff, Plus, Image as ImageIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, PageHeader } from "@/components/ui";

export default function DocsPage() {
  const { docs, artistById } = useStore();

  return (
    <div>
      <PageHeader
        title="Docs"
        subtitle="Páginas públicas e internas de artistas — bio, media e materiais."
        action={
          <button className="inline-flex items-center gap-1.5 rounded-md bg-link px-3.5 py-2 text-sm font-medium text-white hover:bg-link-dark">
            <Plus className="h-4 w-4" /> Criar nova página
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((d) => {
          const artist = artistById(d.artistId ?? "");
          return (
            <Link key={d.id} href={`/docs/${d.id}`}>
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                <div className="flex h-28 items-center justify-center text-white" style={{ backgroundColor: artist?.color ?? "#8891a3" }}>
                  <ImageIcon className="h-8 w-8 opacity-70" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium">
                      <FileText className="h-4 w-4 text-muted" /> {d.title}
                    </div>
                    {d.visible ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-[11px] font-semibold text-green">
                        <Eye className="h-3 w-3" /> Visível
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                        <EyeOff className="h-3 w-3" /> Oculto
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted">{d.bio}</p>
                  <div className="mt-3 text-xs text-muted">{d.media.length} itens de media</div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
