// import { Badge } from "@/components/ui/badge";
// import { CircleCheckIcon } from "lucide-react";
import type { RecommendationResponse } from "@/types/api/watchList";
// import type { StockEventType } from "@/types/api/watchList";

interface RelatedStocksThemesProps {
  recommendData: RecommendationResponse;
}

// type EventMeta = {
//   label: string;
//   icon?: React.ReactNode;
// };

// const EVENT_META: Record<StockEventType, EventMeta> = {
//   NEW_HIGH: {
//     label: "신고가",
//     icon: <CircleCheckIcon className="text-red-400" />,
//   },
//   VOLATILITY_CONTRACTION: {
//     label: "변동성 축소",
//   },
//   PRICE_COMPRESSION: {
//     label: "가격 압축",
//   },
//   TREND_TEMPLATE: {
//     label: "트렌드템플레이트",
//   },
//   RANK_UP: {
//     label: "순위 상승",
//   },
//   RANK_DOWN: {
//     label: "순위 하락",
//   },
// };

export default function RelatedStocksThemes({ recommendData }: RelatedStocksThemesProps) {
  //const themeRankStatus = recommendData.recommendedTheme.prevRank === recommendData.recommendedTheme.rank ? "same" : recommendData.recommendedTheme.prevRank > recommendData.recommendedTheme.rank ? "up" : "down";
  //const diff = Math.abs(recommendData.recommendedTheme.prevRank - recommendData.recommendedTheme.rank);

  // const RANK_META = {
  //   same: {
  //     text: "유지",
  //     color: "text-gray-500",
  //     icon: null,
  //   },
  //   up: {
  //     text: "상승",
  //     color: "text-rose-500",
  //     icon: <i className="icon icon-arrow-up" />,
  //   },
  //   down: {
  //     text: "하락",
  //     color: "text-blue-500",
  //     icon: <i className="icon icon-arrow-down" />,
  //   },
  // } as const;

  //const rankMeta = RANK_META[rankStatus];
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      <div className="border rounded-lg bg-white p-4 flex gap-2 items-center">
        <div className="size-12 rounded-md bg-[#d9d9d9] shrink-0"></div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-800 font-semibold">{recommendData.recommendedTheme.themeName}</span>
          <div className="flex gap-1 items-center flex-wrap">
            <div className="text-slate-700 text-sm flex gap-1 pr-2">
              <span>태마 순위가</span>
              <span className="font-semibold">NN → NN</span>
              <span>으로 상승했어요.</span>
              <span className="text-rose-500 flex items-center">
                <i className="icon icon-arrow-up" />2
              </span>
            </div>
            <div className="flex gap-2 text-slate-700 text-sm items-center">
              <span>{recommendData.recommendedTheme.totalCount}개 중</span>
              <span>
                <span className="text-rose-500">{recommendData.recommendedTheme.risingCount}</span>
                상승
              </span>
              <span>
                <span className="text-muted-foreground">2</span>
                보합
              </span>
              <span>
                <span className="text-blue-500">4</span>
                하락
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="border rounded-lg bg-white p-4 flex gap-2 items-center">
        <div className="size-12 rounded-full bg-[#d9d9d9] shrink-0"></div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-800 font-semibold">{recommendData.recommendedStock.companyName}</span>
          <div className="flex gap-1 items-center flex-wrap">
            <div className="text-slate-700 text-sm flex gap-1 pr-2">
              <span>종목 순위가</span>
              <span className="font-semibold">NN → NN</span>
              <span>으로 상승했어요.</span>
              <span className="text-rose-500 flex items-center">
                <i className="icon icon-arrow-up" />2
              </span>
            </div>
            {/* 이벤트 배지 */}
            {/* <div className="flex flex-wrap gap-1 text-slate-700 text-sm items-center">
              {recommendData.recommendedStock.events.map((event) => {
                const meta = EVENT_META[event];

                return (
                  <Badge key={event} variant="outline">
                    {meta.icon}
                    {meta.label}
                  </Badge>
                );
              })}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
