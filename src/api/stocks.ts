import api from "@/lib/api";
import type { StockRankingApiResponse } from "@/types/api/stocks";
export interface GetRealTimeChartParams {
  page: number;
  pageSize: number;
  marketType?: string;
}
export const getRealTimeChart = (params: GetRealTimeChartParams) => api.get<StockRankingApiResponse>("/real-time-chart/stocks", { params });
export const getRealTimeChartStatus = () => api.get("real-time-chart/status");
