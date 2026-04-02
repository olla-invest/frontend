import { Badge } from "@/components/ui/badge";
import { CircleCheckIcon } from "lucide-react";
import type { StockEventType, WatchListStock, WatchListTheme } from "@/types/api/watchList";

interface ThemeFocusProps {
  theme: WatchListTheme;
}

interface StockFocusProps {
  stock: WatchListStock;
}

type EventMeta = {
  label: string;
  icon?: React.ReactNode;
};

const EVENT_META: Record<StockEventType, EventMeta> = {
  NEW_HIGH: {
    label: "신고가",
    icon: <CircleCheckIcon className="text-red-400" />,
  },
  VOLATILITY_CONTRACTION: {
    label: "변동성 축소",
  },
  PRICE_COMPRESSION: {
    label: "가격 압축",
  },
  TREND_TEMPLATE: {
    label: "트렌드템플레이트",
  },
  RANK_UP: {
    label: "순위 상승",
  },
  RANK_DOWN: {
    label: "순위 하락",
  },
};

export function ThemeFocus({ theme }: ThemeFocusProps) {
  const rankStatus = theme.prevRank === theme.rank ? "same" : theme.prevRank > theme.rank ? "up" : "down";
  const diff = Math.abs(theme.prevRank - theme.rank);

  const RANK_META = {
    same: {
      text: "유지",
      color: "text-gray-500",
      icon: null,
    },
    up: {
      text: "상승",
      color: "text-rose-500",
      icon: <i className="icon icon-arrow-up" />,
    },
    down: {
      text: "하락",
      color: "text-blue-500",
      icon: <i className="icon icon-arrow-down" />,
    },
  } as const;

  const rankMeta = RANK_META[rankStatus];

  return (
    <div className="bg-slate-50 rounded-md p-4 flex-1">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex flex-col gap-1">
            <div className="size-16 rounded-md bg-[#d9d9d9] shrink-0 overflow-hidden">
              {theme.imageUrl && <img src={theme.imageUrl} alt={theme.themeName} className="w-full h-full object-cover" />}
            </div>

            <span className="text-slate-800 font-semibold">{theme.themeName}</span>
          </div>

          {/* 순위 변화 */}
          <div className="text-slate-700 text-sm flex gap-1 pr-2 flex-wrap items-center">
            <span>테마 순위가</span>

            <span className="font-semibold">
              {theme.prevRank || "-"} → {theme.rank || "-"}
            </span>

            <span>으로 {rankMeta.text}했어요.</span>

            {rankStatus !== "same" && (
              <span className={`${rankMeta.color} flex items-center gap-0.5`}>
                {rankMeta.icon}
                {diff}
              </span>
            )}
          </div>
        </div>
        <div className="h-px w-full border-t" />
        <div className="flex gap-2 text-slate-700 text-sm items-center flex-wrap">
          <span>{theme.totalCount || "-"}개 중</span>
          <span>
            <span className="text-rose-500">{theme.upCount || "-"}</span>
            상승
          </span>
          <span>
            <span className="text-muted-foreground">{theme.flatCount || "-"}</span>
            보합
          </span>
          <span>
            <span className="text-blue-500">{theme.downCount || "-"}</span>
            하락
          </span>
        </div>
      </div>
    </div>
  );
}

export function StockFocus({ stock }: StockFocusProps) {
  const rankStatus = stock.prevRank === stock.rank ? "same" : stock.prevRank > stock.rank ? "up" : "down";
  const diff = Math.abs(stock.prevRank - stock.rank);

  const RANK_META = {
    same: {
      text: "유지",
      color: "text-gray-500",
      icon: null,
    },
    up: {
      text: "상승",
      color: "text-rose-500",
      icon: <i className="icon icon-arrow-up" />,
    },
    down: {
      text: "하락",
      color: "text-blue-500",
      icon: <i className="icon icon-arrow-down" />,
    },
  } as const;

  const rankMeta = RANK_META[rankStatus];

  return (
    <div className="border-b bg-white px-2 py-3 flex gap-2">
      <div className="size-12 rounded-full bg-[#d9d9d9] shrink-0"></div>
      <div className="flex flex-col gap-1">
        <span className="text-slate-800 font-semibold">{stock.companyName}</span>
        <div className="flex gap-1 items-center flex-wrap">
          {/* 순위 변화 */}
          <div className="text-slate-700 text-sm flex gap-1 pr-2 items-center">
            <span>종목 순위가</span>
            <span className="font-semibold">
              {stock.prevRank} → {stock.rank}
            </span>
            <span>으로 {rankMeta.text}했어요.</span>
            {rankStatus !== "same" && (
              <span className={`${rankMeta.color} flex items-center gap-0.5`}>
                {rankMeta.icon}
                {diff}
              </span>
            )}
          </div>

          {/* 이벤트 배지 */}
          <div className="flex flex-wrap gap-1 text-slate-700 text-sm items-center">
            {stock.events.map((event) => {
              const meta = EVENT_META[event];

              return (
                <Badge key={event} variant="outline">
                  {meta.icon}
                  {meta.label}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
