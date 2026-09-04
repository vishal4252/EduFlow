import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const isLoginRequest = originalRequest?.url?.includes("/auth/login");
    const isRefreshRequest = originalRequest?.url?.includes(
      "/auth/refresh-token",
    );
    const isLogoutRequest = originalRequest?.url?.includes("/auth/logout");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest &&
      !isRefreshRequest &&
      !isLogoutRequest
    ) {
      originalRequest._retry = true;

      try {
        await refreshClient.post("/api/auth/refresh-token");

        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
