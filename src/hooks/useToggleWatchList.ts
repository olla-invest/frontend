import { useWatchStockListStore, useWatchThemeStore } from "@/store/WatchListStore";
import { postWatchList, deleteWatchList, getWatchStockList, postWatchThemeList, deleteWatchThemeList, getWatchThemeList } from "@/api/watchList";
import type { WatchListStock, WatchListTheme } from "@/types/api/watchList";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

/* =======================종목 토글======================= */
export const toggleWatchStockList = async (stockCode: string): Promise<boolean> => {
  const { stockList, setWatchStockList } = useWatchStockListStore.getState();
  const { accessToken } = useAuthStore.getState();

  if (!accessToken) {
    toast.warning("로그인 후 이용가능한 서비스입니다.", { position: "top-center" });
    return false;
  }

  const exists = stockList?.some((stock) => stock.stockCode === stockCode);

  try {
    if (exists) {
      await deleteWatchList(stockCode);
    } else {
      await postWatchList(stockCode);
    }

    const updated = await getWatchStockList();
    setWatchStockList(updated.stocks);
    toast.success(`관심 종목을 ${exists ? "삭제" : "추가"}했습니다.`, { position: "top-center" });
    return true; //성공
  } catch (error) {
    console.error("watchlist toggle 실패", error);
    toast.error("관심 종목 처리 중 오류가 발생했습니다.");
    return false; //실패
  }
};

/* =======================테마 토글======================= */
export const toggleWatchThemeList = async (themeCode: number) => {
  const { themeList, setWatchThemeList } = useWatchThemeStore.getState();
  const { accessToken } = useAuthStore.getState();

  // 로그인 체크
  if (!accessToken) {
    toast.warning("로그인 후 이용가능한 서비스입니다.", { position: "top-center" });
    return;
  }

  const exists = themeList?.some((theme) => theme.themeCode === themeCode);

  try {
    if (exists) {
      await deleteWatchThemeList(themeCode);
    } else {
      await postWatchThemeList(themeCode);
    }

    // 최신 데이터 다시 조회
    const updated = await getWatchThemeList();
    setWatchThemeList(updated.themes);

    toast.success(`관심테마를 ${exists ? "삭제" : "추가"}했습니다.`, { position: "top-center" });
    return true; //성공
  } catch (error) {
    console.error("watch theme toggle 실패", error);
    toast.error("관심테마 처리 중 오류가 발생했습니다.");
    return false; //실패
  }
};

/* ======================= 유틸 ======================= */
export const isInWatchList = (watchList: WatchListStock[], stockCode: string): boolean => {
  return watchList.some((stock) => stock.stockCode === stockCode);
};

export const isInWatchThemeList = (themeList: WatchListTheme[], themeCode: number): boolean => {
  return themeList.some((theme) => theme.themeCode === themeCode);
};
