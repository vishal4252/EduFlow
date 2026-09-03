"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Search,
  Users,
  Mail,
  CheckCircle2,
  Trash2,
  X,
} from "lucide-react";

import { getAllStudents, deleteUser } from "@/services/user.service";

export default function AllStudents() {
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [deletingStudent, setDeletingStudent] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllStudents();

        setStudents(data.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return students;
    }

    return students.filter(
      (student) =>
        student.username?.toLowerCase().includes(value) ||
        student.email?.toLowerCase().includes(value),
    );
  }, [students, search]);

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;

    try {
      setDeletingId(deletingStudent._id);

      const data = await deleteUser(deletingStudent._id);

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== deletingStudent._id),
      );

      setDeletingStudent(null);

      toast.success(data.message || "Student deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete student.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  All Students
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  View and manage all registered students.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 self-start rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                <Users size={17} />
                <span>{students.length} Students</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by username or email..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0"
                >
                  <div className="h-11 w-11 rounded-full bg-slate-100" />

                  <div className="flex-1">
                    <div className="h-4 w-40 rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-56 rounded bg-slate-100" />
                  </div>

                  <div className="h-8 w-8 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* Empty after search */}
          {!loading && !error && filteredStudents.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-20 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Users size={28} className="text-slate-400" />
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-900">
                {search ? "No students found" : "No students available"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {search
                  ? "Try a different username or email."
                  : "There are no students available."}
              </p>
            </div>
          )}

          {/* Students */}
          {!loading && !error && filteredStudents.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Desktop Header */}
              <div className="hidden grid-cols-[1.5fr_2fr_1fr_70px] border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                <span>Student</span>
                <span>Email</span>
                <span>Status</span>
                <span />
              </div>

              <div className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const isDeleting = deletingId === student.id;

                  return (
                    <div
                      key={student.id}
                      className="grid gap-4 px-5 py-5 md:grid-cols-[1.5fr_2fr_1fr_70px] md:items-center"
                    >
                      {/* Student */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                          {student.username?.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {student.username}
                          </p>

                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {student.role}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
                        <Mail size={16} className="shrink-0" />

                        <span className="truncate">{student.email}</span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={16}
                          className={
                            student.verified
                              ? "text-green-600"
                              : "text-slate-400"
                          }
                        />

                        <span
                          className={
                            student.verified
                              ? "text-sm font-medium text-green-600"
                              : "text-sm text-slate-500"
                          }
                        >
                          {student.verified ? "Verified" : "Not Verified"}
                        </span>
                      </div>

                      {/* Delete */}
                      <div>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => setDeletingStudent(student)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete student"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {deletingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                <Trash2 size={21} className="text-red-600" />
              </div>

              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                disabled={deletingId !== null}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              Delete Student
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {deletingStudent.username}
              </span>
              ? The account will no longer be able to log in.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                disabled={deletingId !== null}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteStudent}
                disabled={deletingId !== null}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId !== null ? "Deleting..." : "Delete Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
