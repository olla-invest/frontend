import api from "@/lib/api";

export const realTimeChart = () => api.get("/real-time-chart");
