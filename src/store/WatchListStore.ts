import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WatchListStock, WatchListTheme } from "@/types/api/watchList";

interface WatchStockListStore {
  stockList: WatchListStock[] | null;
  setWatchStockList: (data: WatchListStock[]) => void;
  clearWatchStockList: () => void;
}

interface WatchThemeListStore {
  themeList: WatchListTheme[] | null;
  setWatchThemeList: (data: WatchListTheme[]) => void;
  clearWatchThemeList: () => void;
}

export const useWatchStockListStore = create<WatchStockListStore>()(
  persist(
    (set) => ({
      stockList: null,

      setWatchStockList: (data) => {
        set({ stockList: data });
      },

      clearWatchStockList: () => {
        set({ stockList: [] });
      },
    }),
    {
      name: "watchStockList",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export const useWatchThemeStore = create<WatchThemeListStore>()(
  persist(
    (set) => ({
      themeList: null,

      setWatchThemeList: (data) => {
        set({ themeList: data });
      },

      clearWatchThemeList: () => {
        set({ themeList: [] });
      },
    }),
    {
      name: "watchThemeList",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
