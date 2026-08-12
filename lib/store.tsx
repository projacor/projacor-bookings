"use client";

import {
  createContext,
  useContext,
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
  Task,
} from "./types";

interface Store {
  artists: Artist[];
  contacts: Contact[];
  bookings: Booking[];
  tasks: Task[];
  docs: Doc[];
  addBooking: (b: Omit<Booking, "id">) => void;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  addContact: (c: Omit<Contact, "id">) => void;
  toggleTask: (id: string) => void;
  artistById: (id: string) => Artist | undefined;
  contactById: (id?: string) => Contact | undefined;
  bookingById: (id: string) => Booking | undefined;
}

const StoreContext = createContext<Store | null>(null);

let counter = 500;
const nextId = (p: string) => `${p}${counter++}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [artists] = useState<Artist[]>(seedArtists);
  const [contacts, setContacts] = useState<Contact[]>(seedContacts);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [docs] = useState<Doc[]>(seedDocs);

  const value = useMemo<Store>(
    () => ({
      artists,
      contacts,
      bookings,
      tasks,
      docs,
      addBooking: (b) =>
        setBookings((prev) => [{ ...b, id: nextId("") }, ...prev]),
      setBookingStatus: (id, status) =>
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status } : b))
        ),
      addContact: (c) =>
        setContacts((prev) => [{ ...c, id: nextId("p") }, ...prev]),
      toggleTask: (id) =>
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        ),
      artistById: (id) => artists.find((a) => a.id === id),
      contactById: (id) => (id ? contacts.find((c) => c.id === id) : undefined),
      bookingById: (id) => bookings.find((b) => b.id === id),
    }),
    [artists, contacts, bookings, tasks, docs]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return ctx;
}
