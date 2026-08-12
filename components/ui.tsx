import { cn, initials } from "@/lib/utils";
import { STATUS_META, type BookingStatus } from "@/lib/types";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Hex → rgba com alpha, para badges de fundo suave. */
function tint(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
      style={{
        color: meta.color,
        borderColor: tint(meta.color, 0.4),
        backgroundColor: tint(meta.color, 0.1),
      }}
    >
      {meta.label}
    </span>
  );
}

export function Dot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-[3px]"
      style={{ backgroundColor: color }}
    />
  );
}

export function Avatar({
  name,
  color,
  size = 36,
  square = false,
}: {
  name: string;
  color?: string;
  size?: number;
  square?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center text-xs font-semibold text-white",
        square ? "rounded-md" : "rounded-full"
      )}
      style={{ width: size, height: size, backgroundColor: color ?? "#8891a3" }}
    >
      {initials(name)}
    </div>
  );
}

export function TagChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-muted">
      {label}
    </span>
  );
}
