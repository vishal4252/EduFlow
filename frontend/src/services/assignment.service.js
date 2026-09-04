import api from "@/lib/api";

export const getCourseAssignments = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/assignments`);
  return response.data;
};

export const createAssignment = async (courseId, assignmentData) => {
  const response = await api.post(
    `/courses/${courseId}/assignment`,
    assignmentData,
  );
  return response.data;
};

export const getAllAssignments = async (courses) => {
  const responses = await Promise.all(
    courses.map((course) => getCourseAssignments(course._id)),
  );

  return responses.flatMap((response) => response.assignments || []);
};
