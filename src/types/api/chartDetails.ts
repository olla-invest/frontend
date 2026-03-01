// API 응답 원본
export interface CandleResponse {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface ChartResponse {
  stockCode: string;
  candleType: string;
  candles: CandleResponse[];
}

// 프론트에서 사용할 타입
export interface TableDetailItem {
  time: string; // timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TableDetail {
  stockCode: string;
  candleType: string;
  candles: TableDetailItem[];
}
