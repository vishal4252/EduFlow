"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AssignmentList from "./AssignmentList";
import { useEffect, useState } from "react";

import { getMyCourses } from "@/services/course.service";
import { getCourseAssignments } from "@/services/assignment.service";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError("");

        // Get student's enrolled courses
        const courseData = await getMyCourses();

        const courses = courseData.enrolledCourses || [];

        if (courses.length === 0) {
          setAssignments([]);
          return;
        }

        // Get assignments for every enrolled course
        const responses = await Promise.all(
          courses.map((course) => getCourseAssignments(course._id)),
        );

        // Combine all assignment arrays
        const allAssignments = responses.flatMap(
          (response) => response.assignments || [],
        );

        setAssignments(allAssignments);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message || "Failed to fetch assignments",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <DashboardLayout title="Assignments">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Assignments
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View assignments from your enrolled courses.
            </p>
          </div>

          <div className="mt-8">
            <AssignmentList
              assignments={assignments}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
