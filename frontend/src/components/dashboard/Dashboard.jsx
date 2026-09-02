"use client";

import { useEffect, useState } from "react";
import { BookOpen, ClipboardList, BarChart3, Award } from "lucide-react";

import DashboardLayout from "./DashboardLayout";
import StatsCard from "./StatsCard";
import RecentCourses from "./RecentCourses";
import LearningProgress from "./LearningProgress";

import { getMyCourses } from "@/services/course.service";
import { getCourseAssignments } from "@/services/assignment.service";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  const [courseError, setCourseError] = useState("");
  const [assignmentError, setAssignmentError] = useState("");

  // Get enrolled courses
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoadingCourses(true);
        setCourseError("");

        const data = await getMyCourses();

        setCourses(data.enrolledCourses || []);
      } catch (error) {
        console.error(error);

        setCourseError(
          error.response?.data?.message || "Failed to fetch courses",
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchMyCourses();
  }, []);

  // Get assignments for enrolled courses
  useEffect(() => {
    const fetchAssignments = async () => {
      if (courses.length === 0) {
        setAssignments([]);
        setLoadingAssignments(false);
        return;
      }

      try {
        setLoadingAssignments(true);
        setAssignmentError("");

        const responses = await Promise.all(
          courses.map((course) => getCourseAssignments(course._id)),
        );

        const allAssignments = responses.flatMap(
          (response) => response.assignments || [],
        );

        setAssignments(allAssignments);
      } catch (error) {
        console.error(error);

        setAssignmentError(
          error.response?.data?.message || "Failed to fetch assignments",
        );
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, [courses]);

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* Welcome */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome back 👋
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Here's what's happening with your learning today.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Enrolled Courses"
              value={loadingCourses ? "--" : courses.length}
              icon={BookOpen}
            />

            <StatsCard
              title="Assignments"
              value={loadingAssignments ? "--" : assignments.length}
              icon={ClipboardList}
            />

            <StatsCard title="Learning Progress" icon={BarChart3} />

            <StatsCard title="Certificates" icon={Award} />
          </div>

          {/* Courses + Progress */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentCourses
              courses={courses}
              loading={loadingCourses}
              error={courseError}
            />

            <LearningProgress />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
