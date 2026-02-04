import api from "@/lib/api";
import type { StockRankingApiResponse } from "@/types/api/stocks";

export const getRealTimeChart = () => api.get<StockRankingApiResponse>("/real-time-chart/stocks");
