import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken } from "@/src/lib/utils";

// ⚠️ Không hard-code localhost
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// ===== Axios instances =====

// Public API (no auth)
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Private API (auth required)
export const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== Request interceptor (private only) =====
privateApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userData = getToken();

    if (userData) {
      config.headers["X-User-Id"] = userData.id;
      config.headers["X-User-Role"] = userData.role;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ===== Response interceptors =====

// Success handler
const responseInterceptor = (response: AxiosResponse) => {
  return response.data;
};


const errorInterceptor = (error: AxiosError) => {
  if (error.response) {
    return Promise.reject(error.response.data);
  }

  if (error.request) {
    return Promise.reject({
      message:
        "Không thể kết nối đến server. Vui lòng kiểm tra JSON server đang chạy.",
    });
  }

  return Promise.reject({
    message: error.message || "Request failed",
  });
};

// Private API error handler (xử lý thêm 401)
const privateErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return errorInterceptor(error);
};

// ===== Apply interceptors =====
publicApi.interceptors.response.use(
  responseInterceptor,
  errorInterceptor
);

privateApi.interceptors.response.use(
  responseInterceptor,
  privateErrorInterceptor
);
