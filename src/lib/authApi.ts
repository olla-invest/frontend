import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
//로그인이 필요한 api 설정
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

authApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default authApi;
