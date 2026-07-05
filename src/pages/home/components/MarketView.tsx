import MarketSummary from "./marketView/MarketSummary";
import MarketTabCard from "./marketView/MarketTabCard";
import MarketTypeCard from "./marketView/MarketTypeCard";

export function MarketView() {
  return (
    <div className="max-w-312 w-full flex flex-col md:gap-8 overflow-hidden gap-10 mx-auto">
      <MarketSummary />
      <MarketTypeCard />
      <MarketTabCard />
    </div>
  );
}
