import axios, { AxiosError, AxiosInstance } from "axios";

let token: string | null = null;

export const setAuthToken = (newToken: string | null) => {
  token = newToken;
};

const createHttpClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      const data = error.response?.data;
      const message =
        (data as any)?.message || error.message || "Request failed";
      return Promise.reject({ message, status, data });
    }
  );

  return instance;
};

export const httpClient = createHttpClient();

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
