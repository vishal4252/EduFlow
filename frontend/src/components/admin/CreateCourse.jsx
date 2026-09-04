"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowLeft, BookOpen, User, FileText, Tag } from "lucide-react";

import { createCourse } from "@/services/course.service";
import { getAllTeachers } from "@/services/user.service";

export default function CreateCourse() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    instructor: "",
  });

  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [creating, setCreating] = useState(false);

  // Get logged-in user
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

  // Get teachers
  useEffect(() => {
    if (user?.role !== "admin") {
      return;
    }

    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);

        const data = await getAllTeachers();

        setTeachers(data.data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch teachers.",
        );
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);

      const data = await createCourse(formData);

      toast.success(data.message || "Course created successfully");

      setFormData({
        title: "",
        description: "",
        category: "",
        instructor: "",
      });

      router.push("/allcourses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course.");
    } finally {
      setCreating(false);
    }
  };

  // Wait until user is loaded
  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  // Only admin can access this page
  if (user.role !== "admin") {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-700">Access Denied</h2>

          <p className="mt-2 text-sm text-red-600">
            Only administrators can create courses.
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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
            <BookOpen size={22} />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Create Course
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create a new course and assign an instructor.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Course Title
              </label>

              <div className="relative">
                <BookOpen
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description"
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <div className="relative">
                <Tag
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Web Development"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            {/* Instructor */}
            <div>
              <label
                htmlFor="instructor"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Instructor
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  disabled={loadingTeachers}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="">
                    {loadingTeachers
                      ? "Loading instructors..."
                      : "Select instructor"}
                  </option>

                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.username} — {teacher.email}
                    </option>
                  ))}
                </select>
              </div>

              {!loadingTeachers && teachers.length === 0 && (
                <p className="mt-2 text-xs text-red-500">
                  No teachers are available.
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={creating || loadingTeachers || teachers.length === 0}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "Creating Course..." : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
