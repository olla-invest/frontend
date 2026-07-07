type Signal = string;

interface SignalMeta {
  action: string;
  actionLabel: string;
  colorClass: string;
  inactiveColorClass: string;
  signalLabel: string;
}

interface SignalStatus {
  signal: Signal;
  label: string;
  signalMeta: SignalMeta;
}

interface MarketIndex {
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  changeRate: number;
  volume: string;
}

export interface MarketBreadth {
  risingCount: number;
  flatCount: number;
  fallingCount: number;
  upperLimitCount: number;
  lowerLimitCount: number;
  adr: number;
  adrStatus: SignalStatus;
}

interface InvestorFlow {
  foreign: number;
  institution: number;
  individual: number;
  unit: string;
}

export interface MovingAverages {
  ma20: number;
  ma50: number;
  ma200: number;
  belowMa20Ratio: number;
  belowMa200Ratio: number;
  belowMa20Status: SignalStatus;
  belowMa200Status: SignalStatus;
}

export interface NewHighLow {
  newHighCount: number;
  newLowCount: number;
  net: number;
  status: SignalStatus;
}

interface DistributionDay {
  tradeDate: string;
  changeRate: number;
  volume: string;
}

interface Distribution {
  isDistributionDay: boolean;
  count: number;
  accelerating: boolean;
  latestDays: DistributionDay[];
}

interface Rally {
  day: number | null;
  startDate: string | null;
  isFollowThroughDay: boolean;
  followThroughDate: string | null;
}

interface RecommendedExposure {
  min: number;
  max: number;
}

type MarketType = "KOSPI" | "KOSDAQ";
type DataStatus = string;

interface signalMetaItem {
  action: string;
  actionLabel: string;
  colorClass: string;
  inactiveColorClass: string;
  signalLabel: string;
}

export interface IndexCandle {
  tradeTime: string;
  indexPrice: number;
}

export interface MartketChart {
  kospi: IndexCandle[];
  kosdaq: IndexCandle[];
}

export interface MarketData {
  marketType: MarketType;
  tradeDate: string;
  index: MarketIndex;
  breadth: MarketBreadth;
  investorFlow: InvestorFlow;
  movingAverages: MovingAverages;
  newHighLow: NewHighLow;
  distribution: Distribution;
  rally: Rally;
  shortSignal: Signal;
  longSignal: Signal;
  marketState: string;
  recommendedExposure: RecommendedExposure;
  alertCode: string;
  alertMessage: string;
  dataStatus: DataStatus;
  delayedMessage: string | null;
  sourceTradeDate: string;
  updatedAt: string;
  signalMeta: {
    short: signalMetaItem;
    long: signalMetaItem;
  };
}

export interface OverallSummary {
  shortSignal: Signal;
  longSignal: Signal;
  headline: string;
  guide: string;
  summary: string;
  signalMeta: {
    short: signalMetaItem;
    long: signalMetaItem;
  };
}

export interface MarketViewSummary {
  tradeDate: string;
  updatedAt: string;
  chart: MartketChart;
  markets: MarketData[];
  overall: OverallSummary;
}
