export type BookingStatus =
  | "enquiry"
  | "pencilled"
  | "pending"
  | "awaiting"
  | "confirmed"
  | "contract_sent"
  | "contract_signed"
  | "fully_executed"
  | "rescheduled"
  | "cancelled";

export interface StatusMeta {
  label: string;
  color: string; // hex
}

export const STATUS_META: Record<BookingStatus, StatusMeta> = {
  enquiry: { label: "Pedido de informação", color: "#e63946" },
  pencilled: { label: "Pré-reserva", color: "#17b0a8" },
  pending: { label: "Pendente", color: "#f0932b" },
  awaiting: { label: "A aguardar confirmação", color: "#f5c518" },
  confirmed: { label: "Confirmado", color: "#1e7a34" },
  contract_sent: { label: "Contrato enviado", color: "#3b3b8f" },
  contract_signed: { label: "Contrato assinado", color: "#4caf50" },
  fully_executed: { label: "Totalmente executado", color: "#ec5f8f" },
  rescheduled: { label: "Reagendado", color: "#a5d76e" },
  cancelled: { label: "Cancelado", color: "#9aa0a6" },
};

export const BOOKING_STATUS_ORDER: BookingStatus[] = [
  "enquiry",
  "pencilled",
  "pending",
  "awaiting",
  "confirmed",
  "contract_sent",
  "contract_signed",
  "fully_executed",
  "rescheduled",
  "cancelled",
];

export type ContactKind = "person" | "company";

export interface Contact {
  id: string;
  kind: ContactKind;
  name: string;
  company?: string;
  role?: string;
  email: string;
  mobile?: string;
  city?: string;
  region?: string;
  tags: string[];
  color: string;
  avatar?: string; // data URL da imagem
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  city: string;
  color: string;
}

export interface Booking {
  id: string;
  name: string;
  artistId: string;
  promoterId?: string;
  venueId?: string;
  start: string; // ISO yyyy-mm-dd
  end?: string;
  city: string;
  venue: string;
  fee: number;
  commission: number;
  status: BookingStatus;
  agent: string;
  assistant?: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  due: string;
  done: boolean;
  assignee: string;
  bookingId?: string;
  contactId?: string;
  priority: "baixa" | "media" | "alta";
}

export type MediaKind = "image" | "youtube" | "audio";

export interface MediaItem {
  kind: MediaKind;
  caption: string;
  meta?: string;
}

export interface Doc {
  id: string;
  title: string;
  artistId?: string;
  visible: boolean;
  bio: string;
  media: MediaItem[];
}

export const ALL_TAGS = [
  "Artista",
  "Promotor",
  "Sala",
  "Câmara",
  "Agente",
  "Banda",
  "Gestão",
  "Técnico",
  "Cliente",
];

export const TAG_COLORS: Record<string, string> = {
  Artista: "#e0533d",
  Promotor: "#2f6fb0",
  Sala: "#8e44ad",
  Câmara: "#2f9e6f",
  Agente: "#c0392b",
  Banda: "#e08b2f",
  Gestão: "#111827",
  Técnico: "#0f766e",
  Cliente: "#d6492f",
};

export function tagColor(t: string) {
  return TAG_COLORS[t] ?? "#6b7280";
}
