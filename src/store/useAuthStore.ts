import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { useWatchStockListStore, useWatchThemeStore } from "@/store/WatchListStore";

interface UserInfo {
  accessToken: string;
  username: string;
  name?: string;
  email?: string;
  userId?: string;
}

interface AuthState {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;

  login: (userInfo: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: null,
      isLoggedIn: false,

      login: (userInfo) => {
        set({
          userInfo,
          isLoggedIn: true,
        });
      },

      logout: () => {
        useWatchStockListStore.getState().clearWatchStockList();
        useWatchThemeStore.getState().clearWatchThemeList();
        // 이전ver auth 정보 삭제
        localStorage.removeItem("auth-storage");
        set({
          userInfo: null,
          isLoggedIn: false,
        });
      },
    }),
    {
      name: "userInfo",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
