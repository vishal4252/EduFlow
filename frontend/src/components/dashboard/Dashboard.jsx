"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  GraduationCap,
  ArrowRight,
  ClipboardList,
  CalendarDays,
} from "lucide-react";

import StatsCard from "./StatsCard";
import RecentCourses from "./RecentCourses";

import { getMyCourses, getAllCourses } from "@/services/course.service";

import { getAllTeachers, getAllStudents } from "@/services/user.service";

import { getCourseAssignments } from "@/services/assignment.service";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  const [courseError, setCourseError] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [studentError, setStudentError] = useState("");
  const [assignmentError, setAssignmentError] = useState("");

  // =====================================
  // GET LOGGED-IN USER
  // =====================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
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
        setCourseError(
          error.response?.data?.message || "Failed to fetch courses",
        );
      } finally {
        setLoadingCourses(false);
      }

      // -------------------------------
      // Assignments
      // -------------------------------

      try {
        setLoadingAssignments(true);
        setAssignmentError("");

        // Fetch assignments for every course.
        // GET /courses/:courseId/assignments returns assignments for one course.
        const allCourses = data.courses || [];

        if (allCourses.length === 0) {
          setAssignments([]);
        } else {
          const responses = await Promise.all(
            allCourses.map((course) => getCourseAssignments(course._id)),
          );

          const allAssignments = responses.flatMap(
            (response) => response.assignments || [],
          );

          setAssignments(allAssignments);
        }
      } catch (error) {
        setAssignments([]);
        setAssignmentError(
          error.response?.data?.message || "Failed to fetch assignments",
        );
      } finally {
        setLoadingAssignments(false);
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
  // ADMIN ALL ASSIGNMENTS
  // =====================================

  useEffect(() => {
    if (user?.role !== "admin") {
      return;
    }

    const fetchAdminAssignments = async () => {
      if (courses.length === 0) {
        setAssignments([]);
        setLoadingAssignments(false);
        setAssignmentError("");
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
        setAssignments([]);
        setAssignmentError(
          error.response?.data?.message || "Failed to fetch assignments",
        );
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAdminAssignments();
  }, [user, courses]);

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
  // STUDENT ALL ASSIGNMENTS
  // =====================================

  useEffect(() => {
    if (user?.role !== "student") {
      return;
    }

    const fetchStudentAssignments = async () => {
      // If student has no enrolled courses,
      // there cannot be any course assignments.
      if (courses.length === 0) {
        setAssignments([]);
        setLoadingAssignments(false);
        setAssignmentError("");
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
        setAssignmentError(
          error.response?.data?.message || "Failed to fetch assignments",
        );
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchStudentAssignments();
  }, [user, courses]);

  // =====================================
  // TEACHER DATA
  // =====================================

  useEffect(() => {
    if (user?.role !== "teacher") {
      return;
    }

    const fetchTeacherData = async () => {
      try {
        setLoadingCourses(true);
        setLoadingAssignments(true);

        setCourseError("");
        setAssignmentError("");

        // Get all courses
        const data = await getAllCourses();

        const allCourses = data.courses || [];

        const teacherId = user.id || user._id;

        // Only courses assigned to logged-in teacher
        const assignedCourses = allCourses.filter((course) => {
          const instructorId =
            typeof course.instructor === "string"
              ? course.instructor
              : course.instructor?._id;

          return instructorId === teacherId;
        });

        setCourses(assignedCourses);

        // --------------------------------
        // Get assignments for teacher courses
        // --------------------------------

        if (assignedCourses.length === 0) {
          setAssignments([]);
          setLoadingAssignments(false);
          return;
        }

        const responses = await Promise.all(
          assignedCourses.map((course) => getCourseAssignments(course._id)),
        );

        const allAssignments = responses.flatMap(
          (response) => response.assignments || [],
        );

        setAssignments(allAssignments);
      } catch (error) {
        setCourseError(
          error.response?.data?.message || "Failed to fetch teacher data",
        );

        setAssignmentError(
          error.response?.data?.message || "Failed to fetch assignments",
        );
      } finally {
        setLoadingCourses(false);
        setLoadingAssignments(false);
      }
    };

    fetchTeacherData();
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Courses"
              value={loadingCourses ? "--" : courses.length}
              icon={BookOpen}
            />

            <StatsCard
              title="Total Assignments"
              value={loadingAssignments ? "--" : assignments.length}
              icon={ClipboardList}
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
          {(courseError || teacherError || studentError || assignmentError) && (
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

              {assignmentError && (
                <p className="text-sm text-red-500">{assignmentError}</p>
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
  // TEACHER DASHBOARD
  // =====================================

  if (user.role === "teacher") {
    return (
      <div className="overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back 👋
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Manage your assigned courses and assignments.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            <StatsCard
              title="Assigned Courses"
              value={loadingCourses ? "--" : courses.length}
              icon={BookOpen}
            />

            <StatsCard
              title="Assignments"
              value={loadingAssignments ? "--" : assignments.length}
              icon={ClipboardList}
            />
          </div>

          {/* Error */}
          {(courseError || assignmentError) && (
            <div className="mt-6 space-y-2">
              {courseError && (
                <p className="text-sm text-red-500">{courseError}</p>
              )}

              {assignmentError && (
                <p className="text-sm text-red-500">{assignmentError}</p>
              )}
            </div>
          )}

          {/* Teacher Sections */}
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {/* Assigned Courses */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    My Assigned Courses
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Courses assigned to you
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/teacher/assignments")}
                  className="text-sm font-medium text-slate-700 hover:underline"
                >
                  Assignments
                </button>
              </div>

              {loadingCourses ? (
                <div className="divide-y divide-slate-100">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-4 p-5">
                      <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />

                      <div className="flex-1">
                        <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
                        <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="px-5 py-14 text-center">
                  <BookOpen size={30} className="mx-auto text-slate-400" />

                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    No assigned courses
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    No courses have been assigned to you yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {courses.slice(0, 3).map((course) => (
                    <button
                      key={course._id}
                      type="button"
                      onClick={() => router.push(`/courses/${course._id}`)}
                      className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <BookOpen size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {course.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {course.category || "--"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Assignments */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Recent Assignments
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Assignments from your courses
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/teacher/assignments")}
                  className="text-sm font-medium text-slate-700 hover:underline"
                >
                  View all
                </button>
              </div>

              {loadingAssignments ? (
                <div className="divide-y divide-slate-100">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-4 p-5">
                      <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />

                      <div className="flex-1">
                        <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
                        <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : assignments.length === 0 ? (
                <div className="px-5 py-14 text-center">
                  <ClipboardList size={30} className="mx-auto text-slate-400" />

                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    No assignments
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    You haven&lsquo;t created any assignments yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {assignments.slice(0, 3).map((assignment) => (
                    <div
                      key={assignment._id}
                      className="flex items-center gap-4 p-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <ClipboardList size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {assignment.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {assignment.course?.title || "--"}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays size={14} />

                        {assignment.dueDate
                          ? new Date(assignment.dueDate).toLocaleDateString()
                          : "--"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

          <StatsCard
            title="Assignments"
            value={loadingAssignments ? "--" : assignments.length}
            icon={ClipboardList}
          />

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
