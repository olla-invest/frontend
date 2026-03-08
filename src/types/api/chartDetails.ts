import { type UTCTimestamp } from "lightweight-charts";

// API 응답 원본
export interface CandleResponse {
  time: string | UTCTimestamp;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  tradingValue: string | null;
  changeRate: string | null;
}

export interface ChartResponse {
  stockCode: string;
  candleType: string;
  candles: CandleResponse[];
}

export interface StockBasicDataResponse {
  changeRate: string;
  currentPrice: number;
  dayHigh: number;
  dayLow: number;
  prevDayCompare: number;
  prevDayCompareSign: string;
  stockCode: string;
  tradingValue: string;
  volume: string;
  week52High: number;
  week52Low: number;
}

// 테이블용
export interface TableDetailItem {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  tradingValue: number | string | null;
  changeRate: string | null;
}

export interface TableDetail {
  stockCode: string;
  candleType: string;
  candles: TableDetailItem[];
}

// 차트용
export interface GraphDetailItem {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  tradingValue?: number | string | null;
  changeRate?: string | null;
}

export interface GraphDetail {
  candles: GraphDetailItem[];
  stockCode: string;
  candleType: string;
}
