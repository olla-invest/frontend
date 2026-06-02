import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuthStore } from "@/store/useAuthStore";
import { getMe } from "@/api/auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const socialLogin = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        alert("로그인에 실패했습니다.");
        navigate("/login", {
          replace: true,
        });
        return;
      }

      try {
        const data = await getMe(token);
        // SNS 연동 여부 체크
        if (!data?.snsLinkedYn) {
          useAuthStore.getState().login({
            accessToken: token,
            username: data?.username,
            name: data?.name,
            email: data?.email,
            userId: data?.userId,
          });
          console.log("디버깅:" + JSON.stringify(useAuthStore.getState().userInfo));
          navigate("/social-signup", {
            replace: true,
            state: {
              accessToken: token,
              userInfo: {
                username: data?.username,
                name: data?.name,
                email: data?.email,
                userId: data?.userId,
              },
            },
          });
          return;
        }

        // 3. 로그인 처리
        useAuthStore.getState().login({
          accessToken: token,
          username: data?.username,
          name: data?.name,
          email: data?.email,
          userId: data?.userId,
        });

        // 4. 메인 이동
        navigate("/", {
          replace: true,
        });
      } catch (error) {
        console.error(error);

        alert("로그인에 실패했습니다.");

        navigate("/login", {
          replace: true,
        });
      }
    };

    socialLogin();
  }, [location, navigate]);

  return null;
}
