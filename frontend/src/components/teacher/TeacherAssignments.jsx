"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  Plus,
  X,
  Calendar,
} from "lucide-react";

import { getAllCourses } from "@/services/course.service";
import {
  getCourseAssignments,
  createAssignment,
} from "@/services/assignment.service";

export default function TeacherAssignments() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [assignments, setAssignments] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  const [courseError, setCourseError] = useState("");
  const [assignmentError, setAssignmentError] = useState("");

  const [creating, setCreating] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

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
  // GET ALL COURSES
  // FILTER ONLY TEACHER'S COURSES
  // =====================================

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      return;
    }

    const fetchAssignedCourses = async () => {
      try {
        setLoadingCourses(true);
        setCourseError("");

        const data = await getAllCourses();

        const allCourses = data.courses || [];

        const teacherId = user.id || user._id;

        const assignedCourses = allCourses.filter((course) => {
          const instructorId =
            typeof course.instructor === "string"
              ? course.instructor
              : course.instructor?._id;

          return instructorId === teacherId;
        });

        setCourses(assignedCourses);

        // Automatically select first assigned course
        if (assignedCourses.length > 0) {
          setSelectedCourse(assignedCourses[0]);
        }
      } catch (error) {
        setCourseError(
          error.response?.data?.message || "Failed to fetch assigned courses.",
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchAssignedCourses();
  }, [user]);

  // =====================================
  // GET ASSIGNMENTS FOR SELECTED COURSE
  // =====================================

  useEffect(() => {
    if (!selectedCourse) {
      setAssignments([]);
      return;
    }

    const fetchAssignments = async () => {
      try {
        setLoadingAssignments(true);
        setAssignmentError("");

        const data = await getCourseAssignments(selectedCourse._id);

        setAssignments(data.assignments || []);
      } catch (error) {
        setAssignmentError(
          error.response?.data?.message || "Failed to fetch assignments.",
        );
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, [selectedCourse]);

  // =====================================
  // FORM CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // CREATE ASSIGNMENT
  // =====================================

  const handleCreateAssignment = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      toast.error("Please select a course.");
      return;
    }

    try {
      setCreating(true);

      const data = await createAssignment(selectedCourse._id, formData);

      // Add the newly created assignment to UI
      setAssignments((prevAssignments) => [...prevAssignments, data.data]);

      setFormData({
        title: "",
        description: "",
        dueDate: "",
      });

      setCreateModalOpen(false);

      toast.success(data.message || "Assignment created successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create assignment.",
      );
    } finally {
      setCreating(false);
    }
  };

  // =====================================
  // ACCESS CHECK
  // =====================================

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (user.role !== "teacher") {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-700">Access Denied</h2>

          <p className="mt-2 text-sm text-red-600">
            Only teachers can manage assignments.
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
                  Assignments
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Manage assignments for your assigned courses.
                </p>
              </div>

              {selectedCourse && (
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Plus size={17} />
                  Create Assignment
                </button>
              )}
            </div>
          </div>

          {/* =====================================
              ASSIGNED COURSES
          ====================================== */}

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Your Assigned Courses
            </h3>

            {loadingCourses && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 w-64 shrink-0 animate-pulse rounded-xl bg-white"
                  />
                ))}
              </div>
            )}

            {!loadingCourses && courseError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-600">{courseError}</p>
              </div>
            )}

            {!loadingCourses && !courseError && courses.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <BookOpen size={30} className="mx-auto text-slate-400" />

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  No assigned courses
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  You don&lsquo;t have any courses assigned to you.
                </p>
              </div>
            )}

            {!loadingCourses && !courseError && courses.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {courses.map((course) => {
                  const active = selectedCourse?._id === course._id;

                  return (
                    <button
                      key={course._id}
                      type="button"
                      onClick={() => setSelectedCourse(course)}
                      className={`min-w-64 shrink-0 rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen size={19} />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {course.title}
                          </p>

                          <p
                            className={`mt-1 truncate text-xs ${
                              active ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            {course.category || "--"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* =====================================
              SELECTED COURSE
          ====================================== */}

          {selectedCourse && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Course Header */}
              <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Selected Course
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                      {selectedCourse.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedCourse.category || "--"}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 self-start rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                    <ClipboardList size={15} />
                    {assignments.length} Assignments
                  </div>
                </div>
              </div>

              {/* Assignment Loading */}
              {loadingAssignments && (
                <div className="divide-y divide-slate-100">
                  {[1, 2].map((item) => (
                    <div key={item} className="animate-pulse p-5">
                      <div className="h-4 w-56 rounded bg-slate-100" />
                      <div className="mt-3 h-3 w-full max-w-lg rounded bg-slate-100" />
                      <div className="mt-2 h-3 w-32 rounded bg-slate-100" />
                    </div>
                  ))}
                </div>
              )}

              {/* Assignment Error */}
              {!loadingAssignments && assignmentError && (
                <div className="p-8 text-center">
                  <p className="text-sm text-red-500">{assignmentError}</p>
                </div>
              )}

              {/* Empty */}
              {!loadingAssignments &&
                !assignmentError &&
                assignments.length === 0 && (
                  <div className="px-5 py-14 text-center">
                    <ClipboardList
                      size={30}
                      className="mx-auto text-slate-400"
                    />

                    <h3 className="mt-4 text-base font-semibold text-slate-900">
                      No assignments yet
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Create the first assignment for this course.
                    </p>
                  </div>
                )}

              {/* Assignments */}
              {!loadingAssignments &&
                !assignmentError &&
                assignments.length > 0 && (
                  <div className="divide-y divide-slate-100">
                    {assignments.map((assignment) => (
                      <div key={assignment._id} className="p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h4 className="text-base font-semibold text-slate-900">
                              {assignment.title}
                            </h4>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                              {assignment.description || "--"}
                            </p>
                          </div>

                          <div className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                            <Calendar size={14} />

                            {assignment.dueDate
                              ? new Date(
                                  assignment.dueDate,
                                ).toLocaleDateString()
                              : "--"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* =====================================
          CREATE ASSIGNMENT MODAL
      ====================================== */}

      {createModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Create Assignment
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedCourse.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                disabled={creating}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateAssignment} className="space-y-5 p-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="assignment-title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Assignment Title
                </label>

                <input
                  id="assignment-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter assignment title"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="assignment-description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="assignment-description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter assignment description"
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Due Date */}
              <div>
                <label
                  htmlFor="assignment-due-date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Due Date
                </label>

                <input
                  id="assignment-due-date"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={creating}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
