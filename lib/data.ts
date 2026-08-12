import { Artist, Booking, Contact, Doc, Task } from "./types";

// ---------------------------------------------------------------------------
// DADOS DE DEMONSTRAÇÃO — todos os artistas, contactos, valores e eventos são
// fictícios e servem apenas para demonstrar a aplicação.
// ---------------------------------------------------------------------------

export const artists: Artist[] = [
  { id: "a1", name: "Luna Melody", genre: "Folk / Indie", city: "Lisboa", color: "#e0533d" },
  { id: "a2", name: "Big Band", genre: "Jazz / Sopros", city: "Porto", color: "#2f9e6f" },
  { id: "a3", name: "DJ Rhythm", genre: "Eletrónica", city: "Lisboa", color: "#3d7de0" },
  { id: "a4", name: "Mr DJ", genre: "House / Techno", city: "Braga", color: "#9b59b6" },
  { id: "a5", name: "Clara & Cordas", genre: "Clássico contemporâneo", city: "Coimbra", color: "#e08b2f" },
];

export const contacts: Contact[] = [
  { id: "p1", kind: "person", name: "Dan Brooks", company: "Something Company", role: "Engenheiro de som / Bateria", email: "dan@email.pt", mobile: "+351 912 000 001", city: "Manchester", tags: ["Técnico", "Banda"], color: "#3d7de0" },
  { id: "p2", kind: "person", name: "Isaac Rivers", company: "Positive Promotions", role: "Promotor", email: "isaac@email.pt", mobile: "+351 912 000 002", city: "Glastonbury", tags: ["Promotor", "Agente"], color: "#2f9e6f" },
  { id: "p3", kind: "person", name: "Mabel Parish", company: "Chamber Co.", role: "Diretora / Percussão", email: "mabel@email.pt", mobile: "+351 912 000 003", city: "Londres", tags: ["Gestão", "Banda"], color: "#e08b2f" },
  { id: "p4", kind: "person", name: "Stuart Coles", company: "Big Band", role: "Voz", email: "stuart@email.pt", mobile: "+351 912 000 004", city: "Porto", tags: ["Artista", "Banda"], color: "#9b59b6" },
  { id: "p5", kind: "person", name: "Ben Jones", company: "Taylor Promotions", role: "Agente", email: "ben@email.pt", mobile: "+351 912 000 005", city: "Lisboa", tags: ["Agente", "Promotor"], color: "#16a0a0" },
  { id: "c1", kind: "company", name: "Big Band", role: "Banda residente", email: "geral@bigband.pt", city: "Porto", tags: ["Artista", "Banda"], color: "#2f9e6f" },
  { id: "c2", kind: "company", name: "Taylor Promotions", role: "Promotor", email: "bookings@taylorpromotions.pt", city: "Lisboa", tags: ["Promotor"], color: "#e0533d" },
  { id: "c3", kind: "company", name: "Câmara Municipal de Sintra", role: "Câmara municipal", email: "cultura@cm-sintra.pt", city: "Sintra", tags: ["Câmara", "Cliente"], color: "#3d7de0" },
  { id: "c4", kind: "company", name: "Elbphilharmonie", role: "Sala", email: "prog@elbphilharmonie.de", city: "Hamburgo", tags: ["Sala"], color: "#8e44ad" },
  { id: "c5", kind: "company", name: "Razzmatazz", role: "Sala", email: "info@salarazzmatazz.es", city: "Barcelona", tags: ["Sala"], color: "#c0392b" },
];

export const bookings: Booking[] = [
  { id: "36700103", name: "Barbican", artistId: "a1", promoterId: "p5", venueId: "c4", start: "2026-08-22", end: "2026-08-24", city: "Londres", venue: "Barbican Centre", fee: 12000, commission: 1200, status: "contract_sent", agent: "Ben Jones", assistant: "Jack Thompson" },
  { id: "36849630", name: "Festival de Verão @ Barbican", artistId: "a2", promoterId: "p2", venueId: "c4", start: "2026-08-22", end: "2026-08-24", city: "Londres", venue: "The Barbican", fee: 9500, commission: 950, status: "contract_sent", agent: "Ben Jones" },
  { id: "37382849", name: "Razzmatazz, Barcelona", artistId: "a3", promoterId: "p2", venueId: "c5", start: "2026-08-26", end: "2026-08-28", city: "Barcelona", venue: "Razzmatazz", fee: 8200, commission: 820, status: "confirmed", agent: "Ben Jones" },
  { id: "36784526", name: "Elbphilharmonie, Hamburgo", artistId: "a5", promoterId: "p5", venueId: "c4", start: "2026-09-02", end: "2026-09-04", city: "Hamburgo", venue: "Elbphilharmonie", fee: 11000, commission: 1100, status: "confirmed", agent: "Ben Jones" },
  { id: "36784878", name: "Pacha, Barcelona", artistId: "a4", promoterId: "p2", venueId: "c5", start: "2026-09-08", city: "Barcelona", venue: "Pacha", fee: 6400, commission: 640, status: "confirmed", agent: "Ben Jones" },
  { id: "36784677", name: "Opéra Garnier, Paris", artistId: "a5", promoterId: "p5", venueId: "c4", start: "2026-09-12", end: "2026-09-14", city: "Paris", venue: "Opéra Garnier", fee: 15000, commission: 1500, status: "fully_executed", agent: "Ben Jones" },
  { id: "36784840", name: "DJ Rhythm @ Warehouse Project", artistId: "a3", promoterId: "p2", venueId: "c5", start: "2026-09-18", city: "Manchester", venue: "The Warehouse Project", fee: 7200, commission: 720, status: "confirmed", agent: "Ben Jones" },
  { id: "36784913", name: "DJ Rhythm @ La Riviera, Madrid", artistId: "a3", promoterId: "p5", venueId: "c5", start: "2026-09-22", city: "Madrid", venue: "La Riviera", fee: 6900, commission: 690, status: "contract_signed", agent: "Ben Jones" },
  { id: "36784852", name: "Teatro alla Scala, Milão", artistId: "a5", promoterId: "p5", venueId: "c4", start: "2026-09-27", end: "2026-09-28", city: "Milão", venue: "Teatro alla Scala", fee: 13500, commission: 1350, status: "contract_sent", agent: "Ben Jones" },
  { id: "36867211", name: "Concerto de Verão", artistId: "a1", promoterId: "p5", venueId: "c3", start: "2026-08-16", city: "Sintra", venue: "Parque da Liberdade", fee: 4200, commission: 420, status: "pending", agent: "Ben Jones" },
  { id: "37382851", name: "Sarau Municipal", artistId: "a2", promoterId: "p2", venueId: "c3", start: "2026-10-04", city: "Sintra", venue: "Centro Cultural Olga Cadaval", fee: 3100, commission: 310, status: "pencilled", agent: "Ben Jones" },
  { id: "32892517", name: "Brighton", artistId: "a4", promoterId: "p2", venueId: "c5", start: "2026-09-08", city: "Brighton", venue: "The Old Market", fee: 5200, commission: 520, status: "pending", agent: "Ben Jones", assistant: "Jack Thompson" },
  { id: "36700900", name: "Noite de Fado", artistId: "a1", promoterId: "p5", venueId: "c3", start: "2026-10-19", city: "Santarém", venue: "Teatro Sá da Bandeira", fee: 3800, commission: 380, status: "enquiry", agent: "Ben Jones" },
];

export const tasks: Task[] = [
  { id: "t1", title: "Enviar contrato — Razzmatazz, Barcelona", due: "2026-08-14", done: false, assignee: "Ben Jones", bookingId: "37382849", priority: "alta" },
  { id: "t2", title: "Confirmar rider técnico — Elbphilharmonie", due: "2026-08-15", done: false, assignee: "Jack Thompson", bookingId: "36784526", priority: "media" },
  { id: "t3", title: "Pedir informação ao promotor — Brighton", due: "2026-08-13", done: false, assignee: "Ben Jones", bookingId: "32892517", priority: "alta" },
  { id: "t4", title: "Atualizar página de docs — Luna Melody", due: "2026-08-18", done: false, assignee: "Ben Jones", priority: "baixa" },
  { id: "t5", title: "Marcar reunião com Taylor Promotions", due: "2026-08-20", done: true, assignee: "Ben Jones", priority: "media" },
  { id: "t6", title: "Reservar alojamento — Teatro alla Scala", due: "2026-09-10", done: false, assignee: "Jack Thompson", bookingId: "36784852", priority: "media" },
];

export const docs: Doc[] = [
  {
    id: "d1",
    title: "Luna Melody",
    artistId: "a1",
    visible: true,
    bio: "Luna Melody é uma cantautora emergente que mistura canções folk com texturas indie-pop modernas. Conhecida pelas suas melodias intimistas e letras poéticas, cria música honesta e cativante, com uma presença de palco calorosa e um catálogo em crescimento.",
    media: [
      { kind: "image", caption: "@ Teatro alla Scala, Milão", meta: "1024×768 · 630kb" },
      { kind: "image", caption: "@ Opéra Garnier, Paris", meta: "1024×768 · 802kb" },
      { kind: "youtube", caption: "TRINX & Matt Fross — sessão ao vivo", meta: "YouTube" },
      { kind: "audio", caption: "Rosa (Que Linda Eres)", meta: "SoundCloud" },
    ],
  },
  {
    id: "d2",
    title: "Big Band: Interno",
    artistId: "a2",
    visible: false,
    bio: "Página interna do Big Band. Aqui estão disponíveis materiais promocionais, rider técnico e informação de hospitalidade da banda. Para acesso a downloads adicionais, contacte a equipa de management.",
    media: [
      { kind: "image", caption: "@ St. Louis Festival", meta: "1600×900 · 1.2mb" },
      { kind: "image", caption: "@ Casa da Música, Porto", meta: "1600×900 · 980kb" },
    ],
  },
];
