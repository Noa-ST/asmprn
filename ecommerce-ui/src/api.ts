import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7022/api",
  withCredentials: false,
});

// Gắn token vào header nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
