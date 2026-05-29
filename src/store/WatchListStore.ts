import { create } from "zustand";
import type { WatchListStock, WatchListTheme } from "@/types/api/watchList";
import { getWatchStockList, getWatchThemeList } from "@/api/watchList";

interface WatchStockListStore {
  stockList: WatchListStock[] | null;
  fetchWatchStockList: () => void;
  setWatchStockList: (data: WatchListStock[]) => void;
  clearWatchStockList: () => void;
}

interface WatchThemeListStore {
  themeList: WatchListTheme[] | null;
  fetchWatchThemeList: () => void;
  setWatchThemeList: (data: WatchListTheme[]) => void;
  clearWatchThemeList: () => void;
}

export const useWatchStockListStore = create<WatchStockListStore>()((set) => ({
  stockList: null,

  fetchWatchStockList: () => {
    getWatchStockList().then((data) => set({ stockList: data.stocks ?? data }));
  },

  setWatchStockList: (data) => {
    set({ stockList: data });
  },

  clearWatchStockList: () => {
    set({ stockList: [] });
  },
}));

export const useWatchThemeStore = create<WatchThemeListStore>()((set) => ({
  themeList: null,
  fetchWatchThemeList: () => {
    getWatchThemeList().then((data) => set({ themeList: data.themes ?? data }));
  },

  setWatchThemeList: (data) => {
    set({ themeList: data });
  },

  clearWatchThemeList: () => {
    set({ themeList: [] });
  },
}));
