import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: false, // 쿠키 인증 쓰면 유지
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;
