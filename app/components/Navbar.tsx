"use client";

import { logout } from "../actions/logout";
import { Factory, LogOut } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl surface-strong flex items-center justify-center">
            <Factory className="h-5 w-5 text-amber-400" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <div className="text-sm text-slate-300">Roma</div>
            <div className="text-lg font-semibold tracking-tight text-slate-100">
              Production System
            </div>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg surface hover:bg-white/10 transition text-slate-100"
        >
          <LogOut className="h-4 w-4 text-slate-200" aria-hidden="true" />
          Logout
        </button>
      </div>
    </nav>
  );
}
