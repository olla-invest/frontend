import MarketSummary from "./myWatch/marketView/MarketSummary";
import MarketTypeCard from "./myWatch/marketView/MarketTypeCard";

export function MarketView() {
  return (
    <div className="min-w-5xl max-w-312 px-6 flex flex-col gap-8">
      <MarketSummary />
      <MarketTypeCard />
    </div>
  );
}
