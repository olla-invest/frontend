export interface IssueTheme {
  themeCode: number;
  themeName: string;
  rank: number;
  rankChange: number | null;
  totalCount: number;
  risingCount: number;
  risingRatio: number;
  avgChangeRate: number;
}
export interface IssueThemeApiResponse {
  updatedAt: string;
  total: number;
  page: number;
  display: number;
  themes: IssueTheme[];
}

//이슈 상세
export interface IssueThemeStock {
  rank: number;
  stockCode: string;
  companyName: string;
  currentPrice: number;
  changeRate: number;
  rsScore: number;
  tradingValueRatio: string; // "3.1배" 같은 문자열이라 string 유지
}

export interface IssueThemeDetailApiResponse {
  themeCode: number;
  themeName: string;
  rank: number;
  rankChange: number | null;
  risingCount: number;
  totalCount: number;
  insights: string[];
  stocks: IssueThemeStock[];
  updatedAt: string;
}
