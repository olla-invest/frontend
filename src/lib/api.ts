import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키 인증 쓰면 유지
});

export default api;
