"use client";

import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-950 text-gray-100 overflow-hidden">
      <Header onMenu={() => setOpen(v => !v)} />

      <div className="relative flex-1">
        <Sidebar open={open} onClose={() => setOpen(false)} />

        <main className="absolute inset-0 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}

