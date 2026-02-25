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
