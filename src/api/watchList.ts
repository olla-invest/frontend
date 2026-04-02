import authApi from "@/lib/authApi";
import type { WatchListApiResponse, RecommendationResponse } from "@/types/api/watchList";

export const getWatchStockList = async (): Promise<WatchListApiResponse> => {
  const res = await authApi.get<WatchListApiResponse>("/watchlist/stocks");
  return res.data;
};

export const postWatchList = async (stockCode: string): Promise<WatchListApiResponse> => {
  const res = await authApi.post<WatchListApiResponse>("/watchlist/stocks", { stockCode });
  return res.data;
};

export const deleteWatchList = async (stockCode: string): Promise<WatchListApiResponse> => {
  const res = await authApi.delete<WatchListApiResponse>(`/watchlist/stocks/${stockCode}`);
  return res.data;
};

export const getWatchThemeList = async () => {
  const res = await authApi.get("/watchlist/themes");
  return res.data;
};

export const postWatchThemeList = async (themeCode: number): Promise<WatchListApiResponse> => {
  const res = await authApi.post<WatchListApiResponse>("/watchlist/themes", { themeCode });
  return res.data;
};

export const deleteWatchThemeList = async (themeCode: number): Promise<WatchListApiResponse> => {
  const res = await authApi.delete<WatchListApiResponse>(`/watchlist/themes/${themeCode}`);
  return res.data;
};

export const getRecommend = async (): Promise<RecommendationResponse> => {
  const res = await authApi.get<RecommendationResponse>("/watchlist/recommendations");
  return res.data;
};
