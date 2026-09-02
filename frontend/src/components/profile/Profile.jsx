"use client";

import { useState } from "react";
import { User, Mail, ShieldCheck, BadgeCheck } from "lucide-react";

export default function Profile() {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            User information not available.
          </p>
        </div>
      </div>
    );
  }

  const initial = user.username?.charAt(0).toUpperCase();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-900 text-3xl font-bold text-white">
              {initial}
            </div>

            {/* User Name */}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900">
                {user.username}
              </h2>

              <p className="mt-1 text-sm capitalize text-slate-500">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Account Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">Your account details</p>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Username */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <User size={19} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Username
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user.username}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Mail size={19} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Role
                </p>

                <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                  {user.role}
                </p>
              </div>
            </div>

            {/* Verification */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <BadgeCheck size={19} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email Verification
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user.verified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
