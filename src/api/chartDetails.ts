import api from "@/lib/api";
import type { UTCTimestamp } from "lightweight-charts";

import type { ChartResponse, TableDetail, GraphDetail, MarketStrengthGraph } from "@/types/api/chartDetails";

interface GetChartDetailParams {
  stockCode: string;
  candleType?: "minute" | "day" | "week" | "month" | "year" | null;
  startDate: string;
  endDate: string;
}

interface ChartGraphParams {
  stockCode: string;
  chartType?: "minute" | "day" | "week" | "month" | "year" | null;
  interval?: string;
  startDate?: string;
  endDate?: string;
}

interface MarketStrengthGraphParams {
  stockCode: string;
  startDate: string;
  endDate?: string;
  rsFilters?: {
    rsStartDate: string;
    rsEndDate: string;
    strength: number;
  }[];
}

// 테이블 변환
const transformChartResponse = (response: ChartResponse): TableDetail => {
  return {
    stockCode: response.stockCode,
    candleType: response.candleType,
    candles: response.candles.map((c) => ({
      time: c.time.toString().slice(0, 10),
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
      volume: Number(c.volume),
      tradingValue: c.tradingValue ? Number(c.tradingValue) : "-",
      changeRate: c.changeRate || "-",
    })),
  };
};

// 그래프 변환
const transformGraphResponse = (response: ChartResponse): GraphDetail => {
  return {
    stockCode: response.stockCode,
    candleType: response.candleType,
    candles: response.candles.map((c) => ({
      time: typeof c.time === "string" ? (Math.floor(new Date(c.time).getTime() / 1000) as UTCTimestamp) : c.time,

      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
      volume: Number(c.volume),
      tradingValue: c.tradingValue ? Number(c.tradingValue) : null,
      changeRate: c.changeRate,
    })),
  };
};

//종목 상세 - 기본 정보
export const getStockBasicData = async (stockCode: string) => {
  return api.get(`/real-time-chart/summary/${stockCode}`);
};

// 차트,시세 - 테이블
export const getChartTableDetailData = async ({ stockCode, candleType = "day", startDate, endDate }: GetChartDetailParams): Promise<TableDetail> => {
  const res = await api.get<ChartResponse>(`/real-time-chart/stored/${stockCode}`, {
    params: {
      candleType,
      startDate,
      endDate,
    },
  });

  return transformChartResponse(res.data);
};

// 차트,시세 - 그래프
export const getChartGraphDetailData = async ({ stockCode, ...params }: ChartGraphParams): Promise<GraphDetail> => {
  const res = await api.get<ChartResponse>(`/real-time-chart/stored/${stockCode}`, {
    params,
  });

  return transformGraphResponse(res.data);
};

//시장 강도 분석 - 그래프
export const postMarketStrengthGraphData = async ({ stockCode, ...params }: MarketStrengthGraphParams): Promise<MarketStrengthGraph> => {
  const res = await api.post<MarketStrengthGraph>(`/real-time-chart/detail/rs-history/${stockCode}`, params);

  return res.data;
};

//종목 정보
export const getDetailStockInfo = async (stockCode: string, year: string) => {
  return api.get(`/real-time-chart/detail/stock-info/${stockCode}`, {
    params: {
      year: year,
    },
  });
};
