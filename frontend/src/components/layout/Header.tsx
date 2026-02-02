"use client";

export default function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950 flex items-center px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="p-2 rounded hover:bg-slate-800 transition"
        >
          ☰
        </button>
        <div className="font-semibold tracking-wide">consave AI Chat</div>
      </div>
    </header>
  );
}
