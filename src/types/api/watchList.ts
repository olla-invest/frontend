export type StockEventType = "NEW_HIGH" | "VOLATILITY_CONTRACTION" | "PRICE_COMPRESSION" | "TREND_TEMPLATE" | "RANK_UP" | "RANK_DOWN";

export interface WatchListStock {
  companyId: string;
  stockCode: string;
  companyName: string;
  marketType: "KOSPI" | "KOSDAQ" | string; // 확장 가능하게
  addedDate: string; // ISO string
  memo: string | null;
  closePrice: number;
  priceChange1d: number;
  priceChangeRate1d: number;
  rank: number;
  prevRank: number;
  relativeStrengthScore: number;
  isNewHigh: boolean;
  events: StockEventType[];
}

export interface WatchListApiResponse {
  tradeDate: string; // ISO string
  stocks: WatchListStock[];
}

export interface WatchListTheme {
  themeCode: number;
  themeName: string;
  imageUrl: string | null;
  addedDate: string; // ISO string
  rank: number;
  prevRank: number;
  risingCount: number;
  totalCount: number;
  event: string;
  upCount?: number;
  flatCount?: number;
  downCount?: number;
}

export interface ThemeResponse {
  themes: WatchListTheme[];
}

export interface RecommendedTheme {
  reason: string;
  type: "THEME";
  themeCode: number;
  themeName: string;
  imageUrl: string | null;
  rank: number;
  prevRank?: number;
  risingCount: number;
  totalCount: number;
}

export interface RecommendedStock {
  reason: string;
  type: "STOCK";
  companyId: string;
  stockCode: string;
  companyName: string;
  marketType: "KOSPI" | "KOSDAQ" | string;
  rank: number;
  closePrice: number;
  priceChangeRate1d: number;
  relativeStrengthScore: number;
}

export interface RecommendationResponse {
  recommendedTheme: RecommendedTheme;
  recommendedStock: RecommendedStock;
}
