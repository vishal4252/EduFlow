"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  GraduationCap,
  ArrowRight,
  UserPlus,
} from "lucide-react";

import StatsCard from "./StatsCard";
import RecentCourses from "./RecentCourses";

import { getMyCourses, getAllCourses } from "@/services/course.service";
import { getAllTeachers, getAllStudents } from "@/services/user.service";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [courseError, setCourseError] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [studentError, setStudentError] = useState("");

  // =====================================
  // GET LOGGED-IN USER
  // =====================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
      }
    }
  }, []);

  // =====================================
  // ADMIN DATA
  // =====================================

  useEffect(() => {
    if (user?.role !== "admin") {
      return;
    }

    const fetchAdminData = async () => {
      // -------------------------------
      // Courses
      // -------------------------------

      try {
        setLoadingCourses(true);
        setCourseError("");

        const data = await getAllCourses();

        setCourses(data.courses || []);
      } catch (error) {
        console.error(error);

        setCourseError(
          error.response?.data?.message || "Failed to fetch courses",
        );
      } finally {
        setLoadingCourses(false);
      }

      // -------------------------------
      // Teachers
      // -------------------------------

      try {
        setLoadingTeachers(true);
        setTeacherError("");

        const data = await getAllTeachers();

        setTeachers(data.data || []);
      } catch (error) {
        setTeacherError(
          error.response?.data?.message || "Failed to fetch teachers",
        );
      } finally {
        setLoadingTeachers(false);
      }

      // -------------------------------
      // Students
      // -------------------------------

      try {
        setLoadingStudents(true);
        setStudentError("");

        const data = await getAllStudents();

        setStudents(data.data || []);
      } catch (error) {
        setStudentError(
          error.response?.data?.message || "Failed to fetch students",
        );
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchAdminData();
  }, [user]);

  // =====================================
  // STUDENT DATA
  // =====================================

  useEffect(() => {
    if (user?.role !== "student") {
      return;
    }

    const fetchStudentCourses = async () => {
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

    fetchStudentCourses();
  }, [user]);

  // =====================================
  // LOADING USER
  // =====================================

  if (!user) {
    return (
      <div className="p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  // =====================================
  // ADMIN DASHBOARD
  // =====================================

  if (user.role === "admin") {
    return (
      <div className="overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back 👋
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Here&lsquo;s what&lsquo;s happening with your LMS today.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Total Courses"
              value={loadingCourses ? "--" : courses.length}
              icon={BookOpen}
            />

            <StatsCard
              title="Total Teachers"
              value={loadingTeachers ? "--" : teachers.length}
              icon={Users}
            />

            <StatsCard
              title="Total Students"
              value={loadingStudents ? "--" : students.length}
              icon={GraduationCap}
            />
          </div>

          {/* Errors */}
          {(courseError || teacherError || studentError) && (
            <div className="mt-6 space-y-2">
              {courseError && (
                <p className="text-sm text-red-500">{courseError}</p>
              )}

              {teacherError && (
                <p className="text-sm text-red-500">{teacherError}</p>
              )}

              {studentError && (
                <p className="text-sm text-red-500">{studentError}</p>
              )}
            </div>
          )}

          {/* Bottom Section */}
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {/* Recent Courses */}
            <RecentCourses
              courses={courses}
              loading={loadingCourses}
              error={courseError}
            />

            {/* Management */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Management
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your LMS resources
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Courses */}
                <button
                  type="button"
                  onClick={() => router.push("/allcourses")}
                  className="flex w-full items-center justify-between px-5 py-5 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <BookOpen size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        All Courses
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Manage courses
                      </p>
                    </div>
                  </div>

                  <ArrowRight size={18} className="text-slate-400" />
                </button>

                {/* Teachers */}
                <button
                  type="button"
                  onClick={() => router.push("/allteachers")}
                  className="flex w-full items-center justify-between px-5 py-5 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Users size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        All Teachers
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Manage teachers
                      </p>
                    </div>
                  </div>

                  <ArrowRight size={18} className="text-slate-400" />
                </button>

                {/* Students */}
                <button
                  type="button"
                  onClick={() => router.push("/allstudents")}
                  className="flex w-full items-center justify-between px-5 py-5 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <GraduationCap size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        All Students
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Manage students
                      </p>
                    </div>
                  </div>

                  <ArrowRight size={18} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================
  // STUDENT DASHBOARD
  // =====================================

  return (
    <div className="overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back 👋
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Here&lsquo;s what&lsquo;s happening with your learning today.
          </p>
        </div>

        {/* Student Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Enrolled Courses"
            value={loadingCourses ? "--" : courses.length}
            icon={BookOpen}
          />

          <StatsCard title="Assignments" value="--" icon={Users} />

          <StatsCard
            title="Learning Progress"
            value="--"
            icon={GraduationCap}
          />

          <StatsCard title="Certificates" value="--" icon={GraduationCap} />
        </div>

        <div className="mt-6">
          <RecentCourses
            courses={courses}
            loading={loadingCourses}
            error={courseError}
          />
        </div>
      </div>
    </div>
  );
}
