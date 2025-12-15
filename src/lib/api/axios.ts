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

// Add request interceptor to private instance to handle auth
privateApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const userData = getToken();

  console.log("1. Checking LocalStorage...");
  console.log("2. Raw userData returned from getToken():", userData);

  if (userData) {
    config.headers["X-User-Id"] = userData.id;

    const token = (userData as any).accessToken || (userData as any).token;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log("3. Token extracted:", token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.error("❌ CÓ USER NHƯNG KHÔNG CÓ TOKEN!");
    }
  } else {
    console.error("❌ KHÔNG TÌM THẤY USER DATA TỪ getToken()");
  }
  return config;
}),
  (error: AxiosError) => {
    return Promise.reject(error);
  };

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
