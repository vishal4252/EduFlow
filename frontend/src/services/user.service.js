import api from "@/lib/api";

export async function getAllTeachers() {
  const response = await api.get("users/teachers");
  return response.data;
}

export async function getAllStudents() {
  const response = await api.get("users/students");
  return response.data;
}

export async function updateUserRole(userId, role) {
  const response = await api.put(`users/${userId}`, { role });
  return response.data;
}

export async function deleteUser(userId) {
  const response = await api.delete(`users/${userId}`);
  return response.data;
}
