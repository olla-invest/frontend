import MarketSummary from "./marketView/MarketSummary";
import MarketTabCard from "./marketView/MarketTabCard";
import MarketTypeCard from "./marketView/MarketTypeCard";

export function MarketView() {
  return (
    <div className="max-w-244 flex flex-col md:gap-8 overflow-hidden gap-10">
      <MarketSummary />
      <MarketTypeCard />
      <MarketTabCard />
    </div>
  );
}
