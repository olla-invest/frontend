import api from "@/lib/api";
import type { StockRankingApiResponse } from "@/types/api/stocks";
export interface GetRealTimeChartParams {
  marketType?: string;
  page?: number;
  pageSize?: number;
  isHighPrice?: boolean | undefined;
  theme?: string[];
  minTradingValue?: number | undefined;
}
export type GetRealTimeChartBody = {
  rsStartDate: string;
  rsEndDate: string;
  strength: number;
}[];
export const getRealTimeChart = (params: GetRealTimeChartParams, body?: GetRealTimeChartBody) =>
  api.post<StockRankingApiResponse>("/real-time-chart/stocks", body ?? null, {
    params,
    paramsSerializer: {
      indexes: null,
    },
  });
export const getRealTimeChartStatus = () => api.get("real-time-chart/status");
