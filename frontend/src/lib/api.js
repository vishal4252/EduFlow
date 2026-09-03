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
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Only try refresh when access token has expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // Get a new access token using refresh token cookie
        await refreshClient.post("/api/auth/refresh-token");

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired:", refreshError);

        // Remove locally stored user information
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
