import { useAuthStore } from "./useAuthStore";

export const initAuth = () => {
  const localAuthStore = localStorage.getItem("auth-storage");

  if (!localAuthStore) return;

  const parsed = JSON.parse(localAuthStore);

  const token = parsed?.state?.accessToken;
  const username = parsed?.state?.user?.username;

  if (token && username) {
    useAuthStore.setState({
      accessToken: token,
      user: { username },
      isLoggedIn: true,
    });
  }
};
