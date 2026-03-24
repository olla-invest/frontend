import { useAuthStore } from "./useAuthStore";

export const initAuth = () => {
  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");

  if (token && username) {
    useAuthStore.setState({
      accessToken: token,
      user: { username },
      isLoggedIn: true,
    });
  }
};
