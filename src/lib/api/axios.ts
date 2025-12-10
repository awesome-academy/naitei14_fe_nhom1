import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getToken } from "@/src/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;
console.log("API Base URL:", BASE_URL);

// Create public axios instance (no auth required)
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create private axios instance (auth required)
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

// Add response interceptor to both instances
const responseInterceptor = (response: AxiosResponse) => {
  // Return the actual data from the response
  return response.data;
};

const errorInterceptor = (error: AxiosError) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Response Error:", error.response.data);
    return Promise.reject(error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Request Error:", error.request);
    return Promise.reject({ message: "No response from server" });
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error:", error.message);
    return Promise.reject({ message: "Request failed" });
  }
};

// Enhanced error interceptor for private API to handle auth errors
const privateErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // Redirect to login page if unauthorized
    window.location.href = "/login";
  }

  // Use the same error handling as the general interceptor
  if (error.response) {
    console.error("Response Error:", error.response.data);
    return Promise.reject(error.response.data);
  } else if (error.request) {
    console.error("Request Error:", error.request);
    return Promise.reject({ message: "No response from server" });
  } else {
    console.error("Error:", error.message);
    return Promise.reject({ message: "Request failed" });
  }
};

publicApi.interceptors.response.use(responseInterceptor, errorInterceptor);
privateApi.interceptors.response.use(
  responseInterceptor,
  privateErrorInterceptor
);
