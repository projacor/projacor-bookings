"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  artists as seedArtists,
  bookings as seedBookings,
  contacts as seedContacts,
  docs as seedDocs,
  tasks as seedTasks,
} from "./data";
import type {
  Artist,
  Booking,
  BookingStatus,
  Contact,
  Doc,
  Note,
  Task,
} from "./types";

interface Store {
  artists: Artist[];
  contacts: Contact[];
  bookings: Booking[];
  tasks: Task[];
  docs: Doc[];
  notes: Note[];
  persistent: boolean;
  addBooking: (b: Omit<Booking, "id">) => void;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  addContact: (c: Omit<Contact, "id">) => void;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  deleteContacts: (ids: string[]) => void;
  addTask: (t: Omit<Task, "id">) => void;
  toggleTask: (id: string) => void;
  addNote: (contactId: string, text: string) => void;
  deleteNote: (id: string) => void;
  artistById: (id: string) => Artist | undefined;
  contactById: (id?: string) => Contact | undefined;
  bookingById: (id: string) => Booking | undefined;
}

const StoreContext = createContext<Store | null>(null);

const genId = (p: string) => p + Math.random().toString(36).slice(2, 9);
const post = (url: string, body: unknown) =>
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => {});
const patchReq = (url: string, body: unknown) =>
  fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => {});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>(seedArtists);
  const [contacts, setContacts] = useState<Contact[]>(seedContacts);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [docs, setDocs] = useState<Doc[]>(seedDocs);
  const [notes, setNotes] = useState<Note[]>([]);
  const [persistent, setPersistent] = useState(false);

  useEffect(() => {
    fetch("/api/bootstrap")
      .then((r) => r.json())
      .then((d) => {
        if (d.artists) setArtists(d.artists);
        if (d.docs) setDocs(d.docs);
        if (d.contacts) setContacts(d.contacts);
        if (d.bookings) setBookings(d.bookings);
        if (d.tasks) setTasks(d.tasks);
        if (d.notes) setNotes(d.notes);
        setPersistent(!!d.persistent);
      })
      .catch(() => {});
  }, []);

  const value = useMemo<Store>(
    () => ({
      artists,
      contacts,
      bookings,
      tasks,
      docs,
      notes,
      persistent,
      addBooking: (b) => {
        const full = { ...b, id: genId("") } as Booking;
        setBookings((prev) => [full, ...prev]);
        post("/api/bookings", full);
      },
      setBookingStatus: (id, status) => {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
        patchReq(`/api/bookings/${id}`, { status });
      },
      addContact: (c) => {
        const full = { ...c, id: genId("p") } as Contact;
        setContacts((prev) => [full, ...prev]);
        post("/api/contacts", full);
      },
      updateContact: (id, patch) => {
        setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
        patchReq(`/api/contacts/${id}`, patch);
      },
      deleteContacts: (ids) => {
        setContacts((prev) => prev.filter((c) => !ids.includes(c.id)));
        ids.forEach((id) =>
          fetch(`/api/contacts/${id}`, { method: "DELETE" }).catch(() => {})
        );
      },
      addTask: (t) => {
        const full = { ...t, id: genId("t") } as Task;
        setTasks((prev) => [full, ...prev]);
        post("/api/tasks", full);
      },
      toggleTask: (id) => {
        const current = tasks.find((t) => t.id === id);
        const done = current ? !current.done : true;
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done } : t)));
        patchReq(`/api/tasks/${id}`, { done });
      },
      addNote: (contactId, text) => {
        const note: Note = {
          id: genId("n"),
          contactId,
          date: new Date().toISOString().slice(0, 10),
          author: "Ben Jones",
          text,
        };
        setNotes((prev) => [note, ...prev]);
        post("/api/notes", note);
      },
      deleteNote: (id) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        fetch(`/api/notes/${id}`, { method: "DELETE" }).catch(() => {});
      },
      artistById: (id) => artists.find((a) => a.id === id),
      contactById: (id) => (id ? contacts.find((c) => c.id === id) : undefined),
      bookingById: (id) => bookings.find((b) => b.id === id),
    }),
    [artists, contacts, bookings, tasks, docs, notes, persistent]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return ctx;
}
