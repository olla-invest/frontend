import GaugeChart from "./GaugeChart";
import type { OverallSummary } from "@/types/api/marketView";
import moment from "moment";

export default function MarketSummary({ summary, updateTime }: { summary: OverallSummary | undefined; updateTime: string | undefined }) {
  const getSignalColor = (signal: string | undefined) => {
    switch (signal) {
      case "rose":
        return "buy";
      case "slate":
        return "neutral";
      case "blue":
        return "sell";
      default:
        return "none";
    }
  };

  return (
    <section>
      <h3 className="sr-only">요약</h3>
      <div className="w-fit px-2 rounded-full bg-muted ml-auto hidden md:block">
        <span className="text-xs text-muted-foreground">{updateTime ? moment(updateTime).format("YYYY-MM-DD") : "-"} 기준 · 매일 오후 4:30 자동 업데이트</span>
      </div>
      <div className="flex md:gap-6 py-1 px-2 md:flex-row flex-col items-center gap-4 justify-center">
        <div className="flex flex-col gap-2 items-center text-center md:items-start md:text-left">
          <span className="text-slate-800 text-3xl font-semibold">{summary?.headline ?? "-"}</span>
          <span className="text-primary text-3xl font-semibold">{summary?.guide ?? "-"}</span>
          <p className="text-gray-700 font-medium text-center md:text-left md:max-w-105">{summary?.summary ?? "-"}</p>
        </div>
        {/* gauge chart 영역 */}
        <div className="text-center md:text-left">
          {/* signal   "sell" | "neutral" | "buy"  */}
          <GaugeChart label="단기" signal={getSignalColor(summary?.signalMeta?.short?.inactiveColorClass)} />
          <GaugeChart label="장기" signal={getSignalColor(summary?.signalMeta?.long?.inactiveColorClass)} />
        </div>
      </div>
    </section>
  );
}
