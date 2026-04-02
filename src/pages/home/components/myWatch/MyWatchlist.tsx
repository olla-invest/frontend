import type { WatchListStock, WatchListTheme } from "@/types/api/watchList";
import { toggleWatchThemeList, toggleWatchStockList } from "@/hooks/useToggleWatchList";

type SumWatchItem = (WatchListStock & { type: "stock" }) | (WatchListTheme & { type: "theme" });
interface Props {
  item: SumWatchItem;
  bookmarks: Record<string, boolean>;
}

export default function MyWatchlist({ item, bookmarks }: Props) {
  return (
    <li className="py-1 flex items-center justify-between gap-1">
      {item.type === "stock" ? (
        <div className="flex justify-between gap-4 flex-1">
          <div className="flex gap-2 items-center w-32 flex-1">
            <div className="size-8 rounded-full bg-[#D9D9D9] shrink-0" />
            <span className="truncate">{item.companyName}</span>
          </div>
          <div className="flex flex-col text-sm items-end py-1">
            <span className="text-slate-800 font-semibold">{item.closePrice}원</span>
            <span className={`text-xs ${item.priceChange1d > 0 ? "text-rose-500" : "text-blue-500"}`}>
              {item.priceChange1d > 0 ? "+" + item.priceChange1d : item.priceChange1d}원 {item.priceChangeRate1d.toFixed(1)}%
            </span>
          </div>
        </div>
      ) : (
        <div className="flex justify-between gap-4 flex-1">
          <div className="flex gap-2 items-center w-32 flex-1">
            <div className="size-8 rounded-md bg-[#D9D9D9] shrink-0" />
            <span className="truncate">{item.themeName}</span>
          </div>
          <div className="flex gap-2 text-slate-700 text-sm items-center">
            <span>{item.totalCount}개 중</span>
            <span>
              <span className="text-rose-500">{item.upCount}</span>
              상승
            </span>
          </div>
        </div>
      )}
      <button
        className="w-8 shrink-0"
        onClick={(e) => {
          e.stopPropagation();

          if (item.type === "stock") {
            toggleWatchStockList(item.stockCode);
          } else {
            toggleWatchThemeList(item.themeCode);
          }
        }}
      >
        <i className={`icon ${bookmarks[item.type === "stock" ? item.stockCode : `theme-${item.themeCode}`] ? "icon-star-fill" : "icon-star"}`} />
      </button>
    </li>
  );
}
