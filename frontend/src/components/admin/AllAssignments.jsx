"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  ClipboardList,
  CalendarDays,
  BookOpen,
  User,
} from "lucide-react";

import { getAllCourses } from "@/services/course.service";
import { getAllAssignments } from "@/services/assignment.service";

export default function AllAssignments() {
  const router = useRouter();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError("");

        const courseData = await getAllCourses();
        const courses = courseData.courses || [];

        if (courses.length === 0) {
          setAssignments([]);
          return;
        }

        const allAssignments = await getAllAssignments(courses);

        setAssignments(allAssignments);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch assignments.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Search assignments
  const filteredAssignments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return assignments;
    }

    return assignments.filter((assignment) => {
      return (
        assignment.title?.toLowerCase().includes(searchValue) ||
        assignment.description?.toLowerCase().includes(searchValue) ||
        assignment.course?.title?.toLowerCase().includes(searchValue) ||
        assignment.instructor?.username?.toLowerCase().includes(searchValue)
      );
    });
  }, [assignments, search]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ================================
            HEADER
        ================================= */}

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
                All Assignments
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                View assignments from all courses.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              <ClipboardList size={17} />
              <span>{assignments.length} Assignments</span>
            </div>
          </div>
        </div>

        {/* ================================
            SEARCH
        ================================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-lg">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assignment, course or instructor..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* ================================
            LOADING
        ================================= */}

        {loading && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0"
              >
                <div className="h-11 w-11 rounded-xl bg-slate-100" />

                <div className="flex-1">
                  <div className="h-4 w-48 rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-72 rounded bg-slate-100" />
                </div>

                <div className="h-8 w-20 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* ================================
            ERROR
        ================================= */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* ================================
            EMPTY
        ================================= */}

        {!loading && !error && filteredAssignments.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-20 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <ClipboardList size={28} className="text-slate-400" />
            </div>

            <h3 className="mt-5 text-base font-semibold text-slate-900">
              {search ? "No assignments found" : "No assignments available"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "There are no assignments available yet."}
            </p>
          </div>
        )}

        {/* ================================
            ASSIGNMENTS TABLE
        ================================= */}

        {!loading && !error && filteredAssignments.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Desktop Header */}
            <div className="hidden grid-cols-[1.5fr_1.4fr_1fr_1fr] border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <span>Assignment</span>
              <span>Course</span>
              <span>Instructor</span>
              <span>Due Date</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="grid gap-4 px-5 py-5 md:grid-cols-[1.5fr_1.4fr_1fr_1fr] md:items-center"
                >
                  {/* Assignment */}
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <ClipboardList size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {assignment.title || "--"}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {assignment.description || "--"}
                      </p>
                    </div>
                  </div>

                  {/* Course */}
                  <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                    <BookOpen size={16} className="shrink-0" />

                    <span className="truncate">
                      {assignment.course?.title || "--"}
                    </span>
                  </div>

                  {/* Instructor */}
                  <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                    <User size={16} className="shrink-0" />

                    <span className="truncate">
                      {assignment.instructor?.username || "--"}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays size={16} className="shrink-0" />

                    <span>
                      {assignment.dueDate
                        ? new Date(assignment.dueDate).toLocaleDateString()
                        : "--"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
