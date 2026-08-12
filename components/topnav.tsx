"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, PanelRightOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Painel" },
  { href: "/contacts", label: "Contactos" },
  { href: "/tasks", label: "Tarefas" },
  { href: "/bookings", label: "Bookings" },
  { href: "/docs", label: "Docs" },
];

const mail = [
  { href: "/mail", label: "Caixa de entrada" },
  { href: "/mail?tab=sent", label: "Enviados" },
  { href: "/mail?tab=campaigns", label: "Campanhas" },
];

const reports = [
  { href: "/reports", label: "Filtrar por contacto" },
  { href: "/reports?type=bookings", label: "Exportar bookings" },
];

export function TopNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="bg-nav text-white/90">
      <div className="flex h-11 items-stretch px-2 lg:px-4">
        <div className="flex items-stretch">
          {nav.map((n) => (
            <NavLink key={n.href} href={n.href} active={isActive(n.href)}>
              {n.label}
            </NavLink>
          ))}
          <Dropdown label="Mail" items={mail} active={isActive("/mail")} />
          <NavLink href="/calendar" active={isActive("/calendar")}>
            Calendário
          </NavLink>
          <Dropdown label="Relatórios" items={reports} active={isActive("/reports")} />
        </div>

        <div className="ml-auto flex items-stretch">
          <Dropdown
            label="Páginas recentes"
            items={[
              { href: "/bookings", label: "Bookings" },
              { href: "/calendar", label: "Calendário" },
              { href: "/contacts", label: "Contactos" },
            ]}
            active={false}
          />
          <button className="my-1.5 ml-1 flex items-center rounded bg-white px-2 text-foreground">
            <PanelRightOpen className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3.5 text-sm transition-colors",
        active
          ? "bg-brand font-semibold text-white"
          : "text-white/90 hover:bg-nav-hover hover:text-white"
      )}
    >
      {children}
    </Link>
  );
}

function Dropdown({
  label,
  items,
  active,
}: {
  label: string;
  items: { href: string; label: string }[];
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative flex items-stretch"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={cn(
          "flex items-center gap-1 px-3.5 text-sm transition-colors",
          active
            ? "bg-white font-semibold text-nav"
            : "text-white/90 hover:bg-nav-hover hover:text-white"
        )}
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-40 min-w-48 overflow-hidden rounded-b-md border border-border bg-surface py-1 text-foreground shadow-lg">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="block px-4 py-2 text-sm hover:bg-surface-2"
            >
              {it.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
