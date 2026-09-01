import api from "@/lib/api";

export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

export const verifyEmail = async (verificationData) => {
  const response = await api.post("/api/auth/verify-email", verificationData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/api/auth/login", userData);
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/api/auth/refresh-token");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/api/auth/logout");
  return response.data;
};

export const logoutAll = async () => {
  const response = await api.post("/api/auth/logoutAll");
  return response.data;
};
