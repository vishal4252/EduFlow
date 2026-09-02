import api from "@/lib/api";

// courses/my-courses for fetching all enrolled courses for student only
export const getMyCourses = async () => {
  const response = await api.get("courses/my-courses");
  return response.data;
};

// api/courses/:courseId for fetching course details by ID for student only
export const getCourseById = async (courseId) => {
  const response = await api.get(`api/courses/${courseId}`);
  return response.data;
};
