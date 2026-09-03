"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  BookOpen,
  User,
  CheckCircle2,
  ArrowRight,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  getAllCourses,
  enrollCourse,
  updateCourse,
  deleteCourse,
} from "@/services/course.service";

export default function AllCourses() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [enrollingId, setEnrollingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Edit course
  const [editingCourse, setEditingCourse] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    instructor: "",
  });

  // Delete confirmation
  const [deletingCourse, setDeletingCourse] = useState(null);

  // ================================
  // GET LOGGED-IN USER
  // ================================

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

  // ================================
  // GET ALL COURSES
  // ================================

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllCourses();

        setCourses(data.courses || []);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ================================
  // CHECK ENROLLMENT
  // ================================

  const isEnrolled = (course) => {
    if (!user) return false;

    return course.students?.some((student) => student._id === user.id);
  };

  // ================================
  // STUDENT - ENROLL
  // ================================

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingId(courseId);
      setError("");

      const data = await enrollCourse(courseId);

      // Update local course state
      setCourses((prevCourses) =>
        prevCourses.map((course) => {
          if (course._id !== courseId) {
            return course;
          }

          return {
            ...course,
            students: [
              ...(course.students || []),
              {
                _id: user.id,
                username: user.username,
                email: user.email,
              },
            ],
          };
        }),
      );

      toast.success(data.message || "Course enrolled successfully");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to enroll in course.",
      );
    } finally {
      setEnrollingId(null);
    }
  };

  // ================================
  // ADMIN - OPEN EDIT MODAL
  // ================================

  const handleEditClick = (course) => {
    setEditingCourse(course);

    setEditForm({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      instructor:
        typeof course.instructor === "string"
          ? course.instructor
          : course.instructor?._id || "",
    });
  };

  // ================================
  // ADMIN - EDIT FORM CHANGE
  // ================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // ADMIN - UPDATE COURSE
  // ================================

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (!editingCourse) return;

    try {
      setUpdating(true);
      setError("");

      const data = await updateCourse(editingCourse._id, editForm);

      const updatedCourse = data.course;

      // Update course in React state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course,
        ),
      );

      setEditingCourse(null);

      toast.success(data.message || "Course updated successfully");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update course.");
    } finally {
      setUpdating(false);
    }
  };

  // ================================
  // ADMIN - OPEN DELETE CONFIRMATION
  // ================================

  const handleDeleteClick = (course) => {
    setDeletingCourse(course);
  };

  // ================================
  // ADMIN - DELETE COURSE
  // ================================

  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;

    try {
      setDeletingId(deletingCourse._id);
      setError("");

      const data = await deleteCourse(deletingCourse._id);

      // Remove course from React state
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== deletingCourse._id),
      );

      setDeletingCourse(null);

      toast.success(data.message || "Course deleted successfully");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              All Courses
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Explore available courses and start learning.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* =====================================
              LOADING
          ====================================== */}

          {loading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          )}

          {/* =====================================
              EMPTY
          ====================================== */}

          {!loading && courses.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-20 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <BookOpen size={28} className="text-slate-400" />
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-900">
                No courses available
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                There are no courses available at the moment.
              </p>
            </div>
          )}

          {/* =====================================
              COURSES
          ====================================== */}

          {!loading && courses.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const enrolled = isEnrolled(course);
                const isEnrolling = enrollingId === course._id;
                const isDeleting = deletingId === course._id;

                return (
                  <div
                    key={course._id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Course Icon */}
                    <div className="flex h-40 items-center justify-center bg-slate-100">
                      <BookOpen
                        size={48}
                        strokeWidth={1.5}
                        className="text-slate-400"
                      />
                    </div>

                    {/* Course Content */}
                    <div className="flex flex-1 flex-col p-5">
                      {/* Category */}
                      <div className="mb-3">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {course.category || "--"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-slate-900">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                        {course.description || "--"}
                      </p>

                      {/* Instructor */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                        <User size={16} />

                        <span>
                          Instructor: {course.instructor?.username || "--"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex gap-2 pt-5">
                        {/* View */}
                        <button
                          type="button"
                          onClick={() => router.push(`/courses/${course._id}`)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          View
                          <ArrowRight size={16} />
                        </button>

                        {/* =========================
                            STUDENT ACTION
                        ========================== */}

                        {user?.role === "student" &&
                          (enrolled ? (
                            <div className="flex items-center justify-center gap-1.5 rounded-xl bg-green-50 px-3 text-sm font-semibold text-green-600">
                              <CheckCircle2 size={16} />
                              Enrolled
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={isEnrolling}
                              onClick={() => handleEnroll(course._id)}
                              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isEnrolling ? "Enrolling..." : "Enroll"}
                            </button>
                          ))}

                        {/* =========================
                            ADMIN ACTIONS
                        ========================== */}

                        {user?.role === "admin" && (
                          <>
                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleEditClick(course)}
                              className="flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2.5 text-white transition hover:bg-slate-800"
                              title="Edit Course"
                            >
                              <Pencil size={17} />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => handleDeleteClick(course)}
                              className="flex items-center justify-center rounded-xl bg-red-50 px-3 py-2.5 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Delete Course"
                            >
                              <Trash2 size={17} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* =====================================
          EDIT COURSE MODAL
      ====================================== */}

      {editingCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Edit Course
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Update course information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateCourse} className="space-y-5 p-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={editForm.description}
                  onChange={handleEditChange}
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={editForm.category}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Instructor */}
              <div>
                <label
                  htmlFor="instructor"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Instructor ID
                </label>

                <input
                  id="instructor"
                  name="instructor"
                  type="text"
                  value={editForm.instructor}
                  onChange={handleEditChange}
                  placeholder="Enter instructor ID"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  disabled={updating}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating ? "Updating..." : "Update Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================
          DELETE CONFIRMATION MODAL
      ====================================== */}

      {deletingCourse && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={22} className="text-red-600" />
            </div>

            {/* Content */}
            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              Delete Course
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {deletingCourse.title}
              </span>
              ? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingCourse(null)}
                disabled={deletingId === deletingCourse._id}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteCourse}
                disabled={deletingId === deletingCourse._id}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId === deletingCourse._id
                  ? "Deleting..."
                  : "Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
