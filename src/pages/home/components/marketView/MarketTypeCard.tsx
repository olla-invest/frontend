import LineAreaChart from "./LineAreaChart";
import MarketTypeCardDetail from "./MarketTypeCardDetail";
import type { MarketData, MartketChart, IndexCandle } from "@/types/api/marketView";

function getChangeTextColorClass(change: number | undefined) {
  if (change === undefined) return "text-slate-500";
  if (change > 0) return "text-rose-500";
  if (change < 0) return "text-blue-500";
  return "text-slate-500";
}

const CardUi = ({ marketInfo, marketName, chartData }: { marketInfo: MarketData; marketName: string; chartData: IndexCandle[] }) => {
  const { index, investorFlow } = marketInfo;

  return (
    <div className="flex gap-6 flex-col md:flex-row">
      <div className="flex flex-col gap-4 w-full pr-0 pb-0 border-r-0 shrink-0 md:pr-6 md:pb-6 md:border-r md:w-82">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-xl text-slate-800">{marketName}</span>
          <div className="flex items-center gap-1">
            <span className="font-medium text-xl text-slate-800">{index.close.toLocaleString()}</span>
            <p className={`font-medium text-xs ${getChangeTextColorClass(index.change)}`}>
              <i className={`icon ${index.change >= 0 ? "icon-arrow-up" : "icon-arrow-down"}`} />
              {Math.abs(index.change).toLocaleString()}({index.changeRate > 0 ? "+" : ""}
              {index.changeRate}%)
            </p>
          </div>
        </div>
        <LineAreaChart colorType={index.change > 0 ? "red" : index.change < 0 ? "blue" : "gray"} data={chartData} />
        <div className="flex items-center gap-4 text-xs justify-between md:justify-start">
          <div className="flex gap-1">
            <span className="text-muted-foreground shrink-0">외인</span>
            <span className={`font-medium ${getChangeTextColorClass(investorFlow.foreign)}`}>
              {investorFlow.foreign.toLocaleString()}
              {investorFlow.unit}
            </span>
          </div>
          <div className="flex gap-1">
            <span className="text-muted-foreground shrink-0">기관</span>
            <span className={`font-medium ${getChangeTextColorClass(investorFlow.institution)}`}>
              {investorFlow.institution.toLocaleString()}
              {investorFlow.unit}
            </span>
          </div>
          <div className="flex gap-1">
            <span className="text-muted-foreground shrink-0">개인</span>
            <span className={`font-medium ${getChangeTextColorClass(investorFlow.individual)}`}>
              {investorFlow.individual.toLocaleString()}
              {investorFlow.unit}
            </span>
          </div>
        </div>
      </div>
      <MarketTypeCardDetail marketName={marketName} info={marketInfo} />
    </div>
  );
};

export default function MarketTypeCard({ kospi, kosdaq, chartData }: { kospi: MarketData | undefined; kosdaq: MarketData | undefined; chartData: MartketChart | undefined }) {
  console.log(chartData);
  return (
    <section className="pt-8 border-t">
      <h3 className="sr-only">시장별 카드</h3>
      <div className="flex flex-col gap-10 md:gap-6">
        {kospi && <CardUi marketInfo={kospi} marketName="코스피" chartData={chartData?.kospi ?? []} />}
        {kosdaq && <CardUi marketInfo={kosdaq} marketName="코스닥" chartData={chartData?.kosdaq ?? []} />}
      </div>
    </section>
  );
}
