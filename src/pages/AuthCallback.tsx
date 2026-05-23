import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuthStore } from "@/store/useAuthStore";
import { getMe } from "@/api/auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const login = async () => {
      const params = new URLSearchParams(location.search);

      // token만 받음
      const token = params.get("token");

      console.log("현재 URL:", window.location.href);
      console.log("token:", token);

      if (!token) {
        alert("로그인에 실패했습니다.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        // 1. 토큰 저장
        localStorage.setItem("accessToken", token);

        useAuthStore.setState({
          accessToken: token,
        });

        // 2. 유저 정보 조회
        const { data } = await getMe();

        // 3. 로그인 상태 저장
        useAuthStore.getState().login({
          accessToken: token,
          username: data?.username,
          name: data?.name,
          email: data?.email,
          userId: data?.userId,
          pw: "",
        });

        // 4. 이동
        if (!data.username) {
          navigate("/social-signup", { replace: true });
        } else {
          // 회원가입 완료 후 이동
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error(error);

        alert("로그인에 실패했습니다.");

        navigate("/login", { replace: true });
      }
    };

    login();
  }, [location, navigate]);

  return null;
}
