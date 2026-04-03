import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const userId = params.get("userId");

    if (token) {
      sessionStorage.setItem("accessToken", token);
      sessionStorage.setItem("socialUserId", userId ?? "");

      navigate("/social-signup", { replace: true });
    } else {
      alert("로그인에 실패했습니다.");
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  return null;
}
