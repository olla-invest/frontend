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
import { openStockDetailInNewTab } from "./liveChart/stockDetailTypes";

export interface StockdetailInfo {
  id: string;
  companyName: string;
  investmentIndicators: string;
  currentPrice: number;
}

export default function MyWatch() {
  const rawStockList = useWatchStockListStore((state) => state.stockList);
  const rawThemeList = useWatchThemeStore((state) => state.themeList);

  const stockList = useMemo(() => rawStockList ?? [], [rawStockList]);
  const themeList = useMemo(() => rawThemeList ?? [], [rawThemeList]);

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
    openStockDetailInNewTab(stockItem.stockCode);
    setSelectStock({
      id: stockItem.stockCode,
      companyName: stockItem.companyName,
      investmentIndicators: "",
      currentPrice: stockItem.closePrice,
    });
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
    const getRecommendData = async () => {
      setIsLoading(true);
      try {
        const res = await getRecommend();
        setRecommend(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const getMyWatchListData = () => {
      useWatchStockListStore.getState().fetchWatchStockList();
      useWatchThemeStore.getState().fetchWatchThemeList();
    };
    getMyWatchListData();
    getRecommendData();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingUi boxStyle="min-h-[300px] h-full flex items-center justify-center" />
      ) : (
        <div className="flex h-full xl:flex-row overflow-y-auto flex-col">
          {/* 왼쪽 영역 */}
          <div className="pr-6 xl:border-r xl:border-b-0 pt-4 flex flex-col gap-6 flex-1">
            {/* 오늘 주목_종목 또는 테마가 1개리도 있어야 UI표시 */}
            {(themeList.length > 0 || stockList.length > 0) && (
              <div className="flex flex-col gap-4 py-2">
                <h4 className="text-xl text-foreground font-semibold">오늘 주목해야 할 내 관심항목</h4>

                <div className="grid grid-cols-2 gap-4">
                  {/* 테마 */}
                  <div className="flex gap-4 w-full">
                    {themeList?.slice(0, 2).map((theme) => (
                      <ThemeFocus key={theme.themeCode} theme={theme} handleThemeModal={handleThemeModal} />
                    ))}
                    {themeList?.length === 0 && (
                      <div className="border rounded-md flex justify-center items-center w-full h-full min-h-20.5">
                        <span className="text-sm text-muted-foreground">오늘 주목해야 할 내 관심 테마가 없어요.</span>
                      </div>
                    )}
                  </div>

                  {/* 종목 */}
                  <div className="flex flex-col">
                    {stockList?.slice(0, 3).map((stock) => (
                      <StockFocus key={stock.stockCode} stock={stock} handleStockModal={handleStockModal} />
                    ))}
                    {stockList?.length === 0 && (
                      <div className="border rounded-md flex justify-center items-center w-full h-full min-h-52">
                        <span className="text-sm text-muted-foreground">오늘 주목해야 할 내 관심 종목이 없어요.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

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
              <h4 className="text-xl text-foreground font-semibold">내 관심</h4>

              <ul className="flex flex-col w-full overflow-y-auto">
                {sumWatchList && sumWatchList.length > 0 ? (
                  sumWatchList.map((item, i) => <MyWatchlist key={i} item={item} bookmarks={bookmarks} handleStockModal={handleStockModal} handleThemeModal={handleThemeModal} />)
                ) : (
                  <li className="text-center text-sm text-muted-foreground h-13 flex items-end justify-center">관심 종목이 없어요.</li>
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
