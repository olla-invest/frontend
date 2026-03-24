import { create } from "zustand";

interface User {
  username: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;

  login: (data: { accessToken: string; username: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoggedIn: false,

  login: ({ accessToken, username }) => {
    // sessionStorage 저장
    sessionStorage.setItem("token", accessToken);
    sessionStorage.setItem("username", username);

    set({
      accessToken,
      user: { username },
      isLoggedIn: true,
    });
  },

  logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");

    set({
      accessToken: null,
      user: null,
      isLoggedIn: false,
    });
  },
}));
