"use client";

import { useState } from "react";
import { Menu, Bell, User } from "lucide-react";

import Sidebar from "./Sidebar";

export default function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="min-h-screen lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <h1 className="truncate text-lg font-semibold text-slate-900">
              {title}
            </h1>
          </div>

          {/* Header actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              <Bell size={20} />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <User size={19} />
            </button>
          </div>
        </header>

        {/* Page */}
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}