"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  LibraryBig,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  X,
  ChevronUp,
  Users,
  GraduationCap,
} from "lucide-react";

import { logoutUser, logoutAll } from "@/services/auth.service";

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loggingOut, setLoggingOut] = useState(false);
  const [loggingOutAll, setLoggingOutAll] = useState(false);
  const [logoutMenuOpen, setLogoutMenuOpen] = useState(false);
  const [error, setError] = useState("");

  // =====================================
  // ADMIN MENU
  // =====================================

  const adminMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "All Courses",
      icon: LibraryBig,
      path: "/allcourses",
    },
    {
      name: "All Teachers",
      icon: Users,
      path: "/allteachers",
    },
    {
      name: "All Students",
      icon: GraduationCap,
      path: "/allstudents",
    },
    {
      name: "All Assignments",
      icon: ClipboardList,
      path: "/allassignments",
    },
  ];

  // =====================================
  // TEACHER MENU
  // =====================================

  const teacherMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Assignments",
      icon: ClipboardList,
      path: "/teacher/assignments",
    },
  ];

  // =====================================
  // STUDENT MENU
  // =====================================

  const studentMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "All Courses",
      icon: LibraryBig,
      path: "/allcourses",
    },
    {
      name: "My Courses",
      icon: BookOpen,
      path: "/courses",
    },
    {
      name: "Assignments",
      icon: ClipboardList,
      path: "/assignments",
    },
    // {
    //   name: "Progress",
    //   icon: BarChart3,
    //   path: "/progress",
    // },
  ];

  // =====================================
  // SELECT MENU BASED ON USER ROLE
  // =====================================

  const menuItems =
    user?.role === "admin"
      ? adminMenuItems
      : user?.role === "teacher"
        ? teacherMenuItems
        : studentMenuItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 min-w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:fixed lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">
              E
            </div>

            <span className="text-lg font-bold text-slate-900">EduFlow</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col px-3 py-5">
          {/* Top Menu */}
          <div>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Menu
            </p>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      router.push(item.path);
                      onClose();
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      pathname === item.path
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={19} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Other
            </p>

            {/* Settings */}
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Settings size={19} />
              <span>Settings</span>
            </button>

            {/* Logout */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLogoutMenuOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={19} />
                  <span>Logout</span>
                </div>

                <ChevronUp
                  size={17}
                  className={`transition-transform ${
                    logoutMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Logout Options */}
              {logoutMenuOpen && (
                <div className="mt-1 rounded-lg border border-slate-200 bg-white p-1 shadow-md">
                  {/* Logout Current Device */}
                  <button
                    type="button"
                    disabled={loggingOut}
                    onClick={async () => {
                      try {
                        setLoggingOut(true);
                        setError("");

                        await logoutUser();

                        localStorage.removeItem("user");

                        router.replace("/login");
                      } catch (error) {
                        setError(
                          error.response?.data?.message || "Failed to logout",
                        );
                        setLoggingOut(false);
                      }
                    }}
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>

                  {/* Logout All Devices */}
                  <button
                    type="button"
                    disabled={loggingOutAll}
                    onClick={async () => {
                      try {
                        setLoggingOutAll(true);
                        setError("");

                        await logoutAll();

                        localStorage.removeItem("user");

                        router.replace("/login");
                      } catch (error) {
                        setError(
                          error.response?.data?.message || "Failed to logout",
                        );
                        setLoggingOutAll(false);
                      }
                    }}
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {loggingOutAll ? "Logging out..." : "Logout All Devices"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
