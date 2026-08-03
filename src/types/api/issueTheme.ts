export interface StreakBadge {
  direction: "STRONG" | "WEAK" | string;
  days: number;
  label: string;
  tone: "RED" | "BLUE" | string;
}
export interface IssueTheme {
  rank: number;
  previousRank: number;
  rankChange: number | null;
  themeCode: number;
  themeName: string;
  rsScore: number;
  avgRsScore: number;
  shortTermRs: number | null;
  momentum: number | null;
  changeRate: number;
  avgChangeRate: number;
  stockCount: number;
  totalCount: number;
  eligibleStockCount: number;
  risingCount: number;
  newHighCount: number;
  themeScore: number;
  streakBadge: StreakBadge | null;
  isFavorite: boolean;
  topStocks: {
    stockCode: string;
    stockName: string;
  }[];
}

export interface IssueThemeFilterCounts {
  all: number;
  rs80: number;
  momentum: number;
  stockCount5: number;
  changeRate5: number;
  hasNewHigh: number;
}

export interface IssueThemePagination {
  page: number;
  display: number;
  total: number;
  totalPages: number;
}

export interface IssueThemeApiResponse {
  items: IssueTheme[];
  filterCounts: IssueThemeFilterCounts;
  pagination: IssueThemePagination;
  updatedAt: string;
}

//이슈 상세
export interface IssueThemeStock {
  rank: number;
  stockCode: string;
  companyName: string;
  inclusionReason: string;
  currentPrice: number;
  closePrice: number;
  changeRate: number;
  priceChange1d: number;
  priceChangeRate1d: number;
  priceSource: string;
  rsScore: number;
  shortTermRs: number | null;
  tradingValue: string;
  previousTradingValueRatio: number;
  isNewHigh: boolean;
  newHighRate: number;
  tradingValueRatio: string; // "3.1배" 같은 문자열이라 string 유지
  tradingValueChange: string;
  currentAccTradingValue: number;
  prevSameTimeAccTradingValue: number;
}

export interface IssueThemeRelatedTheme {
  themeCode: number;
  themeName: string;
  sharedStockCount: number | null;
  similarity: number;
  rsScore: number;
  changeRate: number;
  signal: "WEAK" | "MEDIUM" | "STRONG" | string;
}

export interface IssueThemeDetailApiResponse {
  themeCode: number;
  themeName: string;
  imageUrl: string | null;
  rank: number;
  rankChange: number | null;
  risingCount: number;
  totalCount: number;
  avgRsScore: number;
  rsScore: number;
  shortTermRs: number | null;
  momentum: number | null;
  changeRate: number | null;
  newHighCount: number;
  streakBadge: StreakBadge | null;
  themeScore: number;
  insights: string[];
  isFavorite: boolean;
  stocks: IssueThemeStock[];
  relatedThemes: IssueThemeRelatedTheme[];
  aiSummary: string | null;
  aiSummaryUpdatedAt: string | null;
  aiSummarySources: string[];
  updatedAt: string;
}
