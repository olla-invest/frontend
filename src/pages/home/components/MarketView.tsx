import MarketSummary from "./marketView/MarketSummary";
import MarketTabCard from "./marketView/MarketTabCard";
import MarketTypeCard from "./marketView/MarketTypeCard";

export function MarketView() {
  return (
    <div className="min-w-5xl max-w-312 px-6 flex flex-col gap-8">
      <MarketSummary />
      <MarketTypeCard />
      <MarketTabCard />
    </div>
  );
}
