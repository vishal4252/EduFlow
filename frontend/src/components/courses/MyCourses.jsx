"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getMyCourses } from "@/services/course.service";

export default function MyCourses() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyCourses();

        setCourses(data.enrolledCourses || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <DashboardLayout title="My Courses">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* Page Header */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              My Courses
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View the courses you are currently enrolled in.
            </p>
          </div>

          {/* Content */}
          <div className="mt-8">
            {/* Loading */}
            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-sm text-slate-500">Loading courses...</p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && courses.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-20 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <BookOpen size={28} className="text-slate-400" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  No courses found
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  You haven&lsquo;t enrolled in any courses yet.
                </p>
              </div>
            )}

            {/* Courses */}
            {!loading && !error && courses.length > 0 && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => router.push(`/courses/${course._id}`)}
                    className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Course Icon */}
                    <div className="flex h-36 items-center justify-center bg-slate-100">
                      <BookOpen size={42} className="text-slate-400" />
                    </div>

                    {/* Course Details */}
                    <div className="p-5">
                      <p className="text-xs font-medium text-slate-500">
                        {course.category}
                      </p>

                      <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-900">
                        {course.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {course.description}
                      </p>

                      {course.instructor && (
                        <div className="mt-4 border-t border-slate-100 pt-4">
                          <p className="text-xs text-slate-400">Instructor</p>

                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {course.instructor.username}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
