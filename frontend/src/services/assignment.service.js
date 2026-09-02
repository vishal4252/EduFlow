import api from "@/lib/api";

export const getCourseAssignments = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/assignments`);
  return response.data;
};
