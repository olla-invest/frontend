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

//시장 강도 분석
export interface MarketStrengthGraph {
  startDate: string;
  endDate: string;
  data: [{ date: string; rsRaw: number }];
}

//종목 상세
export interface QuarterlyValue {
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
}
export interface StockDetailResponse {
  stockCode: string;
  overview: Overview;
  income: Income;
  cashFlow: CashFlow;
  indicators: Indicators;
}

export interface Overview {
  corpName: string;
  corpNameEng: string;
  ceoName: string;
  corpClass: "Y" | "K" | "N"; // Y:유가, K:코스닥, N:코넥스
  industryCode: string;
  establishedDate: string; // YYYYMMDD
  settlementMonth: string; // MM
  address: string;
  homepage: string;
  phone: string;
}

export interface Income {
  stockCode: string;
  year: string;
  fsDiv: "CFS" | "OFS";
  revenue: QuarterlyValue;
  operatingIncome: QuarterlyValue;
  netIncome: QuarterlyValue;
}

export interface FinancialValue {
  current: number;
  previous: number;
  twoYearsAgo: number;
}

export interface CashFlow {
  stockCode: string;
  year: string;
  operatingCashFlow: QuarterlyValue;
  investingCashFlow: QuarterlyValue;
  financingCashFlow: QuarterlyValue;
}

export type Quarter = "q1" | "q2" | "q3" | "q4";

export interface IndicatorDetail {
  profitability: Record<string, number | null>;
  stability: Record<string, number | null>;
  activity: Record<string, number | null>;
}

export type Indicators = {
  stockCode: string;
  year: string;
} & Record<Quarter, IndicatorDetail>;
