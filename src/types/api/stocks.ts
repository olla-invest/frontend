export interface StockRankingApiResponse {
  marketType: string;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  count: number;
  stocks: StockRankingApiItem[];
}

export interface StockRankingApiItem {
  id: string;
  rank: number;
  companyName: string;
  stockCode: string;
  currentPrice: number;
  exchange: "KOSPI" | "KOSDAQ";
  relativeStrengthScore: number;
  isHighPrice: boolean;
  investmentIndicators: string;
  investmentIndicatorsDtl: string;
  theme: string;
  upName: string;
  rrankHistory: {
    oneDayAgo: number | null;
    today: number | null;
    twoDaysAgo: number | null;
  };
}

export interface StockRankingApiStatus {
  initialized: boolean;
  lastDataUpdate: string;
}
