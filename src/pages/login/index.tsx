import React, { useState } from "react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import LogoImg from "@/assets/images/olla-logo.svg";
import KakaoImg from "@/assets/images/kakao-login-icon.png";
import NaverImg from "@/assets/images/naver-login-icon.png";
import { useNavigate } from "react-router-dom";
import FindIdModal from "./components/FindIdModal";
import FindPwModal from "./components/FindPwModal";
import { postLogin, type LoginParams } from "@/api/auth";

import axios from "axios";
import { toast } from "sonner";

// 상태 관리
import { useAuthStore } from "@/store/useAuthStore";
import type { AuthErrorResponse } from "@/types/api/auth";
import { useWatchStockListStore, useWatchThemeStore } from "@/store/WatchListStore";

// API
import { getWatchStockList, getWatchThemeList } from "@/api/watchList";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"username" | "password", string>>>({});
  const [saveId, setSaveId] = useState(!!localStorage.getItem("saveId"));
  const [modal, setModal] = useState<"findId" | "findPw" | null>(null);

  const [loginData, setLoginData] = useState<LoginParams>({
    username: localStorage.getItem("saveId") || "",
    password: "",
  });

  const login = useAuthStore((state) => state.login);

  const handleLoginData = <K extends keyof LoginParams>(key: K, value: LoginParams[K]) => {
    setLoginData((prev) => ({
      ...prev,
      [key]: value,
    }));

    // 에러 제거
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key as "username" | "password"];
      return newErrors;
    });
  };

  const handleLogin = async () => {
    setErrorMsg("");

    const newErrors: Partial<Record<"username" | "password", string>> = {};

    if (!loginData.username) newErrors.username = "아이디를 입력해 주세요";
    if (!loginData.password) newErrors.password = "비밀번호를 입력해주세요.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await postLogin(loginData);

      // ID 저장 처리
      if (saveId) {
        localStorage.setItem("saveId", loginData.username);
      } else {
        localStorage.removeItem("saveId");
      }

      // 로그인 상태 저장
      login({
        accessToken: res.accessToken,
        username: res.username,
      });

      // 관심종목 + 테마 병렬 조회
      const [watchList, themeList] = await Promise.all([getWatchStockList(), getWatchThemeList()]);

      // store 반영
      useWatchStockListStore.getState().setWatchStockList(watchList.stocks);
      useWatchThemeStore.getState().setWatchThemeList(themeList.themes);

      toast.success("로그인에 성공했습니다", { position: "top-center" });
      navigate("/home");
    } catch (error) {
      if (axios.isAxiosError<AuthErrorResponse>(error)) {
        const message = error.response?.data?.message ?? "로그인 실패";
        setErrorMsg(message);
      } else {
        setErrorMsg("잠시 후 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="w-full max-w-[320px] mx-auto my-0">
      <div className="py-14">
        {/* 로고 */}
        <div className="flex justify-center mb-10 cursor-pointer">
          <img src={LogoImg} alt="olla" className="w-22 aspect-auto" onClick={() => navigate("/home")} />
        </div>

        <form className="pb-6">
          <div className="flex flex-col gap-4 mb-6">
            {/* 아이디 */}
            <Field className="gap-1">
              <FieldLabel htmlFor="input-id" className="sr-only">
                id
              </FieldLabel>
              <Input id="input-id" type="text" placeholder="ID" value={loginData.username} onChange={(e) => handleLoginData("username", e.target.value)} aria-invalid={!!errors.username} />
              {errors.username && <FieldDescription className="text-red-500 text-xs">{errors.username}</FieldDescription>}
            </Field>

            {/* 비밀번호 */}
            <Field className="gap-1">
              <FieldLabel htmlFor="input-pw" className="sr-only">
                비밀번호
              </FieldLabel>

              <InputGroup>
                <InputGroupInput
                  id="input-pw"
                  type={showPw ? "text" : "password"}
                  placeholder="비밀번호"
                  value={loginData.password}
                  onChange={(e) => handleLoginData("password", e.target.value)}
                  aria-invalid={!!errors.password}
                />

                <InputGroupAddon align="inline-end" className="mr-0!">
                  <button type="button" onClick={() => setShowPw((prev) => !prev)} className="cursor-pointer">
                    {showPw ? <EyeIcon strokeWidth={1} size={20} /> : <EyeOffIcon strokeWidth={1} size={20} />}
                  </button>
                </InputGroupAddon>
              </InputGroup>
              {errors.password && <FieldDescription className="text-red-500 text-xs">{errors.password}</FieldDescription>}
            </Field>

            {/* ID 저장 */}
            <div className="flex gap-2">
              <Checkbox id="save-id" checked={saveId} onCheckedChange={(checked) => setSaveId(!!checked)} />
              <Label htmlFor="save-id" className="text-slate-800 font-normal">
                ID 저장
              </Label>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button type="button" className="bg-[#1E1B4B] text-white text-sm w-full h-10 rounded-md" onClick={handleLogin}>
            로그인
          </button>

          {/* 에러 메시지 */}
          {errorMsg && <p className="mt-2 text-[#DC2626] text-center text-xs">{errorMsg}</p>}

          {/* 하단 링크 */}
          <div className="flex gap-2 items-center justify-center mt-4 text-sm text-muted-foreground">
            <a onClick={() => setModal("findId")} className="cursor-pointer">
              ID 찾기
            </a>

            <div className="bg-[#E2E8F0] w-px h-3" />

            <a onClick={() => setModal("findPw")} className="cursor-pointer">
              비밀번호 찾기
            </a>

            <div className="bg-[#E2E8F0] w-px h-3" />

            <a onClick={() => navigate("/signup")} className="cursor-pointer">
              회원가입
            </a>

            <FindIdModal open={modal === "findId"} onClose={() => setModal(null)} onOpenFindPw={() => setModal("findPw")} />

            <FindPwModal open={modal === "findPw"} onClose={() => setModal(null)} />
          </div>
        </form>

        {/* SNS 로그인 */}
        <div className="pt-6 border-t text-center">
          <span className="block text-xs text-muted-foreground mb-4">SNS로 로그인/회원가입</span>

          <div className="flex items-center justify-center gap-4">
            <a className="size-12" onClick={() => navigate("/social-signup")}>
              <img src={NaverImg} alt="네이버 로그인" />
            </a>
            <a className="size-12" onClick={() => navigate("/social-signup")}>
              <img src={KakaoImg} alt="카카오 로그인" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
