import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useWatchStockListStore, useWatchThemeStore } from "@/store/WatchListStore";

interface User {
  username: string;
  name?: string;
  email?: string;
  userId?: string;
  pw?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;

  login: (data: { accessToken: string; username: string; name: string; email: string; userId: string; pw: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,

      login: ({ accessToken, username, name, email, userId, pw }) => {
        set({
          accessToken,
          user: { username, name, email, userId, pw },
          isLoggedIn: true,
        });
      },

      logout: () => {
        useWatchStockListStore.getState().clearWatchStockList();
        useWatchThemeStore.getState().clearWatchThemeList();
        set({
          accessToken: null,
          user: null,
          isLoggedIn: false,
        });
        localStorage.removeItem("auth-storage");
        window.location.reload();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
