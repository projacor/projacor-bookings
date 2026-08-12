"use client";

import { Moon, HelpCircle, User, Bell, Settings, LogOut } from "lucide-react";

export function Header() {
  return (
    <header className="bg-header text-white">
      <div className="flex h-12 items-center px-4 lg:px-6">
        <span className="text-lg font-semibold tracking-tight">
          Projaçor <span className="font-normal text-white/70">Bookings</span>
        </span>
        <div className="ml-auto flex items-center gap-1 text-white/80">
          <IconBtn label="Tema"><Moon className="h-[18px] w-[18px]" /></IconBtn>
          <IconBtn label="Ajuda"><HelpCircle className="h-[18px] w-[18px]" /></IconBtn>
          <IconBtn label="Conta"><User className="h-[18px] w-[18px]" /></IconBtn>
          <IconBtn label="Notificações">
            <span className="relative">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                1
              </span>
            </span>
          </IconBtn>
          <IconBtn label="Definições"><Settings className="h-[18px] w-[18px]" /></IconBtn>
          <IconBtn label="Sair"><LogOut className="h-[18px] w-[18px]" /></IconBtn>
        </div>
      </div>
    </header>
  );
}

function IconBtn({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      title={label}
      aria-label={label}
      className="rounded-md p-2 transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}
