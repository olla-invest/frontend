export interface StockRankingApiResponse {
  marketType: string;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  count: number;
  meta: {
    dataDate: string;
    lastUpdatedAt: string;
    isInitialized: boolean;
    queryEndDate: string;
    queryStartDate: string;
  };
  stocks: StockRankingApiItem[];
  themeList?: {
    sourceThemeNo: string;
    themeCode: number;
    themeName: string;
  }[];
  search?: string;
  sortBy?: string | "rs" | "changeRate" | "tradingValue" | "rankChange";
  sortOrder?: "desc" | "asc";
  suggest?: boolean;
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
  themeFull: string;
  upName: string;
  rankHistory: {
    oneDayAgo: number | null;
    today: number | null;
    twoDaysAgo: number | null;
  };
  //투자 중요지표
  isVolatilityContraction: boolean;
  isPriceCompression: boolean;
  strengthContinuationDays: number | null;
}

export interface StockRankingApiStatus {
  initialized: boolean;
  lastDataUpdate: string;
}
