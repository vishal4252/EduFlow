"use client";

import { useEffect, useState } from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AssignmentList from "@/components/assignments/AssignmentList";
import { getCourseById } from "@/services/course.service";
import { getCourseAssignments } from "@/services/assignment.service";

export default function CourseDetails() {
  const { courseId } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [assignmentError, setAssignmentError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCourseById(courseId);

        setCourse(data.course);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoadingAssignments(true);
        setAssignmentError("");

        const data = await getCourseAssignments(courseId);

        setAssignments(data.assignments || []);
      } catch (error) {
        console.error(error);

        setAssignmentError(
          error.response?.data?.message || "Failed to fetch assignments",
        );
      } finally {
        setLoadingAssignments(false);
      }
    };

    if (courseId) {
      fetchAssignments();
    }
  }, [courseId]);

  return (
    <DashboardLayout title="Course Details">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-5xl">
          {/* Back */}
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-slate-500">Loading course...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Course */}
          {!loading && !error && course && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Course Header */}
              <div className="flex h-52 items-center justify-center bg-slate-100">
                <BookOpen size={56} className="text-slate-400" />
              </div>

              {/* Course Information */}
              <div className="p-6 sm:p-8">
                <p className="text-sm font-medium text-slate-500">
                  {course.category}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {course.title}
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {course.description}
                </p>

                {/* Instructor */}
                {course.instructor && (
                  <div className="mt-8 border-t border-slate-200 pt-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Instructor
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {course.instructor.username}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {course.instructor.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Assignments */}
        <div className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="mb-5 text-lg font-semibold text-slate-900">
            Assignments
          </h3>

          <AssignmentList
            assignments={assignments}
            loading={loadingAssignments}
            error={assignmentError}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
