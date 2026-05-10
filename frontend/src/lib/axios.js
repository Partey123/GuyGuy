import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  console.log("API Request:", config.method?.toUpperCase(), config.url, config.data);
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("guyguy.token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    let errorMsg = "Unknown error";
    
    if (error.response) {
      const { status, data } = error.response;
      
      if (typeof data === 'object' && data !== null) {
        errorMsg = data.error || data.message || JSON.stringify(data);
      } else if (typeof data === 'string') {
        errorMsg = data;
      }
      
      console.error(`[API ${status}] ${errorMsg}`, data);
    } else if (error.request) {
      errorMsg = "No response from server";
      console.error("[API] No response:", error.request);
    } else {
      errorMsg = error.message;
      console.error("[API] Request error:", error.message);
    }
    
    error.message = errorMsg;
    return Promise.reject(error);
  }
);

export default api;
