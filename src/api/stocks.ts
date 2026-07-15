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
  search?: string;
  sortBy?: string | "rs" | "changeRate" | "tradingValue" | "rankChange";
  sortOrder?: "desc" | "asc";
  suggest?: boolean;
}

export interface StockSuggestItem {
  stockCode: string;
  companyName: string;
  rank: number;
  relativeStrengthScore: number;
  inRanking: boolean; // 현재 필터 결과(랭킹) 내 포함 여부
}
export interface StockSuggestResponse {
  search: string | null;
  totalCount: number;
  inRankingCount: number;
  count: number;
  suggestions: StockSuggestItem[];
}

export const getRealTimeChart = (body: GetRealTimeChartRequest) => api.post<StockRankingApiResponse>("/real-time-chart/stocks", body);
export const getStockSuggestions = (body: GetRealTimeChartRequest) => api.post<StockSuggestResponse>("/real-time-chart/stocks", body);
export const getRealTimeChartStatus = () => api.get("real-time-chart/status");
