import axios from "axios";

const api = axios.create({
  baseURL: "https://asmprn-1.onrender.com/api",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
