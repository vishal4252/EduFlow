import { BookOpen } from "lucide-react";

export default function RecentCourses({
  courses = [],
  loading = false,
  error = "",
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="font-semibold text-slate-900">Recent Courses</h3>

          <p className="mt-1 text-xs text-slate-500">
            Continue learning from your enrolled courses
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          View all
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center px-5 py-12">
          <p className="text-sm text-slate-500">Loading courses...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center justify-center px-5 py-12">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Courses */}
      {!loading && !error && courses.length > 0 && (
        <div className="divide-y divide-slate-100">
          {courses.map((course) => (
            <div
              key={course._id}
              className="flex min-w-0 items-center gap-4 px-5 py-4"
            >
              {/* Course Icon */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <BookOpen size={22} />
              </div>

              {/* Course Info */}
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-slate-900">
                  {course.title}
                </h4>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {course.category}
                </p>

                {course.instructor && (
                  <p className="mt-1 truncate text-xs text-slate-400">
                    Instructor: {course.instructor.username}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <BookOpen size={24} className="text-slate-400" />
          </div>

          <h4 className="mt-4 text-sm font-semibold text-slate-900">
            No courses yet
          </h4>

          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Your enrolled courses will appear here once you enroll in a course.
          </p>
        </div>
      )}
    </section>
  );
}
