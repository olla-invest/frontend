import api from "@/lib/api";
import type { StockRankingApiResponse } from "@/types/api/stocks";
export interface GetRealTimeChartRequest {
  marketType?: string;
  page: number;
  pageSize: number;
  filters?: {
    isHighPrice?: boolean;
    theme?: number[];
    minTradingValue?: number;
  };
  rsFilters?: {
    rsStartDate: string;
    rsEndDate: string;
    strength: number;
  }[];
}
export const getRealTimeChart = (body: GetRealTimeChartRequest) => api.post<StockRankingApiResponse>("/real-time-chart/stocks", body);
export const getRealTimeChartStatus = () => api.get("real-time-chart/status");
