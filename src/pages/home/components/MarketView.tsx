import MarketSummary from "./marketView/MarketSummary";
import MarketTabCard from "./marketView/MarketTabCard";
import MarketTypeCard from "./marketView/MarketTypeCard";
import { useMarketView } from "../context/marketViewContext";
import { LoadingUi } from "@/components/LoadingUi";
import { useIsMobile } from "@/hooks/use-mobile";

export function MarketView() {
  const { marketData, isLoading } = useMarketView();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center md:min-h-112.5">
        <LoadingUi message="마켓뷰 데이터를 불러오는 중입니다..." />
      </div>
    );
  }

  return (
    <div className="max-w-312 w-full flex flex-col md:gap-8 overflow-hidden gap-10 mx-auto">
      <MarketSummary summary={marketData?.overall} updateTime={marketData?.updatedAt} />
      <MarketTypeCard kospi={marketData?.markets?.find((m) => m.marketType === "KOSPI")} kosdaq={marketData?.markets?.find((m) => m.marketType === "KOSDAQ")} chartData={marketData?.chart} />
      <div className="flex md:gap-6 gap-10 flex-col md:flex-row">
        <div className={`border rounded-md ${isMobile ? "w-full max-h-22.5 min-h-40" : "size-75"}`}>광고 영역</div>
        <MarketTabCard kospi={marketData?.markets?.find((m) => m.marketType === "KOSPI")} kosdaq={marketData?.markets?.find((m) => m.marketType === "KOSDAQ")} />
      </div>
    </div>
  );
}
