import { useState } from "react";
import MyWatchlist from "./myWatch/MyWatchlist";
import RelatedStocksThemes from "./myWatch/RelatedStocksThemes";
import WatchlistStatus from "./myWatch/WatchlistStatus";
import { StockFocus, ThemeFocus } from "./myWatch/WatchlistFocusToday";

export default function MyWatch() {
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});

  const demoData = [
    {
      id: 1,
      type: "stock",
      name: "삼성전자",
      rankInfo: "NN → NN",
      rank: 1,
      rankType: "up",
      current: "8,854,300",
      currentChange: "+33.3%",
      bookmarks: true,
    },
    {
      id: 2,
      type: "stock",
      name: "한국타이어앤테크놀로지",
      rankInfo: "NN → NN",
      rank: 2,
      rankType: "up",
      current: "8,854,300",
      currentChange: "+33.3%",
      bookmarks: true,
    },
    {
      id: 3,
      type: "stock",
      name: "미래에셋벤처투자",
      rankInfo: "NN → NN",
      rank: 4,
      rankType: "down",
      current: "8,854,300",
      currentChange: "+33.3%",
      bookmarks: true,
    },
    {
      id: 4,
      type: "theme",
      name: "테마명",
      rankInfo: "NN → NN",
      rank: 4,
      rankType: "down",
      current: "8,854,300",
      currentChange: "+33.3%",
      bookmarks: true,
    },
  ];

  return (
    <div className="flex h-full xl:flex-row overflow-y-auto flex-col">
      <div className="pr-6 xl:border-r xl:border-b-0 xl:overflow-y-auto pt-4 flex flex-col gap-6">
        {/* 오늘 주목해야 할 내 관심항목  */}
        <div className="flex flex-col gap-4 py-2">
          <h4 className="text-xl text-foreground font-semibold">오늘 주목해야 할 내 관심항목</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-4 w-full">
              <ThemeFocus />
              <ThemeFocus />
            </div>
            <div className="flex flex-col">
              <StockFocus />
              <StockFocus />
              <StockFocus />
            </div>
          </div>
        </div>
        {/* 내 관심 현황  */}
        <div className="flex flex-col gap-4 py-2">
          <h4 className="text-xl text-foreground font-semibold">내 관심 현황</h4>
          <WatchlistStatus />
        </div>
        {/* 함께 보면 좋을 만한 종목·테마 */}
        <div className="flex flex-col gap-4 py-2">
          <h4 className="text-xl text-foreground font-semibold">함께 보면 좋을 만한 종목·테마</h4>
          <RelatedStocksThemes />
        </div>
      </div>
      {/* 내관심 */}
      <div className="xl:pl-6 xl:min-w-66 xl:max-w-86 py-4 w-full">
        <div className="flex flex-col gap-4 py-2 h-full">
          <h4 className="text-xl text-foreground font-semibold">내관심</h4>
          <ul className="flex flex-col w-full overflow-y-auto">
            {demoData.map((item, i) => {
              return <MyWatchlist key={i} item={item} setBookmarks={setBookmarks} bookmarks={bookmarks} />;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
