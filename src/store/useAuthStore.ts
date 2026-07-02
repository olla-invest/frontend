import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { useWatchStockListStore, useWatchThemeStore } from "@/store/WatchListStore";
import { getMe } from "@/api/auth";

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
  isAuthChecked: boolean;
  sessionExpired: boolean; // 추가: 토큰 검증 실패로 로그아웃된 경우 true

  login: (userInfo: UserInfo) => void;
  logout: (navigate: (path: string) => void) => void;
  checkAuth: () => Promise<void>;
  clearSessionExpired: () => void; // 추가: 메시지 소비 후 초기화
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      isLoggedIn: false,
      isAuthChecked: false,
      sessionExpired: false,

      login: (userInfo) => {
        set({
          userInfo,
          isLoggedIn: true,
          isAuthChecked: true,
          sessionExpired: false, // 새로 로그인했으니 초기화
        });
      },

      logout: (navigate: (path: string) => void) => {
        useWatchStockListStore.getState().clearWatchStockList();
        useWatchThemeStore.getState().clearWatchThemeList();
        localStorage.removeItem("auth-storage");
        navigate("/login");
        set({
          userInfo: null,
          isLoggedIn: false,
          sessionExpired: false, // 사용자가 직접 로그아웃한 거라 만료 메시지는 X
        });
      },

      checkAuth: async () => {
        const { userInfo } = get();

        if (!userInfo?.accessToken) {
          // 애초에 로그인 정보가 없던 경우 (만료가 아니라 그냥 비로그인 상태)
          set({ isLoggedIn: false, isAuthChecked: true });
          return;
        }

        try {
          await getMe(userInfo.accessToken);
          set({ isLoggedIn: true, isAuthChecked: true });
        } catch (e) {
          // 토큰이 있었는데 검증 실패 -> 진짜 "세션 만료"
          useWatchStockListStore.getState().clearWatchStockList();
          useWatchThemeStore.getState().clearWatchThemeList();
          console.log("토큰 검증 실패로 로그아웃 처리됨:", e);
          set({
            userInfo: null,
            isLoggedIn: false,
            isAuthChecked: true,
            sessionExpired: true,
          });
        }
      },

      clearSessionExpired: () => set({ sessionExpired: false }),
    }),
    {
      name: "userInfo",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ userInfo: state.userInfo }),
    },
  ),
);
