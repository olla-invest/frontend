export interface PriceUpdatedPayload {
  stockCode: string;
  price: string;
  changeRate: string;
  prevDayCompare: string;
}

export interface MetricsUpdatedPayload {
  tradeDate: string;
  filteredCount: number;
}
export interface TickPayload {
  stockCode: string;
  time: string;
  price: string;
  prevDayCompare: string;
  changeRate: string;
  open: string;
  high: string;
  low: string;
  accVolume: string;
}
export type SnapshotPayload = TickPayload & {
  price: number;
  changeRate: number;
  prevDayCompare: number;
  open: number;
  high: number;
  low: number;
  accVolume: number;
};
