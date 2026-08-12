import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/header";
import { TopNav } from "@/components/topnav";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Projaçor Bookings",
  description: "Plataforma de gestão de bookings de artistas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT">
      <body className={`${geist.variable} antialiased`}>
        <StoreProvider>
          <Header />
          <TopNav />
          <main className="mx-auto w-full max-w-[1240px] px-4 py-6 lg:px-6">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
