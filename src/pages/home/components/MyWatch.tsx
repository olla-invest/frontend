import { useEffect, useMemo, useState } from "react";
import MyWatchlist from "./myWatch/MyWatchlist";
import RelatedStocksThemes from "./myWatch/RelatedStocksThemes";
import WatchlistStatus from "./myWatch/WatchlistStatus";
import { StockFocus, ThemeFocus } from "./myWatch/WatchlistFocusToday";
import { useWatchStockListStore, useWatchThemeStore } from "@/store/WatchListStore";
import { LoadingUi } from "@/components/LoadingUi";
import { getRecommend } from "@/api/watchList";
import type { WatchListTheme, WatchListStock, RecommendationResponse, RecommendedStock, RecommendedTheme } from "@/types/api/watchList";
import ThemeDetailModal from "./myWatch/ThemeDetailModal";
import LiveChartDetail from "./liveChart/LiveChartDetail";

export interface StockdetailInfo {
  id: string;
  companyName: string;
  investmentIndicators: string;
  currentPrice: number;
}

export default function MyWatch() {
  //store에서 가져오기
  const stockList = useWatchStockListStore((state) => state.stockList);
  const themeList = useWatchThemeStore((state) => state.themeList);
  const [recommend, setRecommend] = useState<RecommendationResponse>();

  const [isLoading, setIsLoading] = useState(false);

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectStock, setSelectStock] = useState<StockdetailInfo>();
  const [themeModalOpen, setThemeMoadlOpen] = useState(false);
  const [selectTheme, setSelectTheme] = useState<WatchListTheme>();

  const sumWatchList = useMemo(() => {
    const stocks = (stockList ?? []).map((item) => ({
      ...item,
      type: "stock" as const,
    }));

    const themes = (themeList ?? []).map((item) => ({
      ...item,
      type: "theme" as const,
    }));

    return [...stocks, ...themes].sort((a, b) => {
      return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    });
  }, [stockList, themeList]);

  const bookmarks = useMemo(() => {
    const stockMap = (stockList ?? []).reduce(
      (acc, item) => {
        acc[item.stockCode] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    const themeMap = (themeList ?? []).reduce(
      (acc, item) => {
        acc[`theme-${item.themeCode}`] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    return { ...stockMap, ...themeMap };
  }, [stockList, themeList]);

  const handleStockModal = (stockItem: WatchListStock | RecommendedStock) => {
    setSelectStock({
      id: stockItem.stockCode,
      companyName: stockItem.companyName,
      investmentIndicators: "",
      currentPrice: stockItem.closePrice,
    });
    setStockModalOpen(true);
  };

  const handleThemeModal = (themeItem: WatchListTheme | RecommendedTheme) => {
    setSelectTheme({
      themeCode: themeItem.themeCode,
      themeName: themeItem.themeName,
      imageUrl: themeItem.imageUrl,
      addedDate: ("addedDate" in themeItem ? themeItem.addedDate : "") ?? "",
      rank: themeItem.rank,
      prevRank: themeItem.prevRank,
      risingCount: themeItem.risingCount,
      totalCount: themeItem.totalCount,
      event: "event" in themeItem ? themeItem.event : "",
      upCount: themeItem.upCount,
      flatCount: themeItem.flatCount,
      downCount: themeItem.downCount,
    });
    setThemeMoadlOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    const getRecommendData = async () => {
      try {
        const res = await getRecommend();
        setRecommend(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getRecommendData();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingUi />
      ) : (
        <div className="flex h-full xl:flex-row overflow-y-auto flex-col">
          {/* 왼쪽 영역 */}
          <div className="pr-6 xl:border-r xl:border-b-0 xl:overflow-y-auto pt-4 flex flex-col gap-6">
            {/* 오늘 주목 */}
            <div className="flex flex-col gap-4 py-2">
              <h4 className="text-xl text-foreground font-semibold">오늘 주목해야 할 내 관심항목</h4>

              <div className="grid grid-cols-2 gap-4">
                {/* 테마 */}
                <div className="flex gap-4 w-full">
                  {themeList?.slice(0, 2).map((theme) => (
                    <ThemeFocus key={theme.themeCode} theme={theme} handleThemeModal={handleThemeModal} />
                  ))}
                  {themeList?.length === 0 && (
                    <div className="bg-blue-50 text-secondary-foreground w-full h-50 rounded-xl flex justify-center items-center">
                      <span className="text-sm">관심 태마가 없습니다</span>
                    </div>
                  )}
                </div>

                {/* 종목 */}
                <div className="flex flex-col">
                  {stockList?.slice(0, 3).map((stock) => (
                    <StockFocus key={stock.stockCode} stock={stock} handleStockModal={handleStockModal} />
                  ))}
                  {themeList?.length === 0 && (
                    <div className="bg-blue-50 text-secondary-foreground w-full h-50 rounded-xl flex justify-center items-center">
                      <span className="text-sm">관심 종목이 없습니다</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 내 관심 현황 */}
            <div className="flex flex-col gap-4 py-2">
              <h4 className="text-xl text-foreground font-semibold">내 관심 현황</h4>
              <WatchlistStatus themeList={themeList} stockList={stockList} handleThemeModal={handleThemeModal} handleStockModal={handleStockModal} />
            </div>

            {/* 추천 영역 */}
            <div className="flex flex-col gap-4 py-2">
              <h4 className="text-xl text-foreground font-semibold">함께 보면 좋을 만한 종목·테마</h4>
              {recommend && <RelatedStocksThemes recommendData={recommend} handleThemeModal={handleThemeModal} handleStockModal={handleStockModal} />}
            </div>
          </div>

          {/* 오른쪽: 내 관심 리스트 */}
          <div className="xl:pl-6 xl:min-w-66 xl:max-w-86 py-4 w-full">
            <div className="flex flex-col gap-4 py-2 h-full">
              <h4 className="text-xl text-foreground font-semibold">내관심</h4>

              <ul className="flex flex-col w-full overflow-y-auto">
                {sumWatchList && sumWatchList.length > 0 ? (
                  sumWatchList.map((item, i) => <MyWatchlist key={i} item={item} bookmarks={bookmarks} />)
                ) : (
                  <li className="text-center text-sm text-muted-foreground py-10">관심 항목이 없습니다.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
      {selectTheme && themeModalOpen && <ThemeDetailModal onClose={() => setThemeMoadlOpen(false)} selectIssue={selectTheme} />}
      {selectStock && stockModalOpen && <LiveChartDetail onClose={() => setStockModalOpen(false)} detailInfo={selectStock} />}
    </>
  );
}
