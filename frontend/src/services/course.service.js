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

// api/courses for fetching all courses for admin and student only
export const getAllCourses = async () => {
  const response = await api.get("api/courses");
  return response.data;
};

// api/courses is for student only to enroll in a course
export const enrollCourse = async (courseId) => {
  const response = await api.post(`courses/${courseId}/enroll`);
  return response.data;
};

// api/courses is for admin only to create a new course
export const createCourse = async (CourseData) => {
  const response = await api.post("api/courses", CourseData);
  return response.data;
};

// api/courses/:courseId is for admin only to update course details
export const updateCourse = async (courseId, CourseData) => {
  const response = await api.put(`api/courses/${courseId}`, CourseData);
  return response.data;
};

// api/courses/:courseId is for admin only to delete a course
export const deleteCourse = async (courseId) => {
  const response = await api.delete(`api/courses/${courseId}`);
  return response.data;
};
