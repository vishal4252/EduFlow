"use client";

import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

export default function RecentCourses({ courses = [], loading, error }) {
  const router = useRouter();

  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Recent Courses
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Continue learning from your enrolled courses
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/courses")}
          className="text-sm font-medium text-slate-700 transition hover:text-slate-900 hover:underline"
        >
          View all
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="divide-y divide-slate-100">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex animate-pulse items-center gap-4 px-5 py-4"
            >
              <div className="h-14 w-14 rounded-xl bg-slate-100" />

              <div className="flex-1">
                <div className="h-4 w-48 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-32 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && recentCourses.length === 0 && (
        <div className="px-5 py-10 text-center">
          <BookOpen size={30} className="mx-auto text-slate-400" />

          <p className="mt-3 text-sm font-medium text-slate-700">
            No courses found
          </p>

          <p className="mt-1 text-xs text-slate-500">
            You haven't enrolled in any courses yet.
          </p>
        </div>
      )}

      {/* Courses */}
      {!loading && !error && recentCourses.length > 0 && (
        <div className="divide-y divide-slate-100">
          {recentCourses.map((course) => (
            <button
              key={course._id}
              type="button"
              onClick={() => router.push(`/courses/${course._id}`)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <BookOpen size={23} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {course.title}
                </h3>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {course.category || "--"}
                </p>

                {course.instructor?.username && (
                  <p className="mt-1 truncate text-xs text-slate-400">
                    Instructor: {course.instructor.username}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
