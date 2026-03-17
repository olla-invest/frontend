import React, { useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import LogoImg from "@/assets/images/olla-logo.svg";
import KakaoImg from "@/assets/images/kakao-login-icon.png";
import NaverImg from "@/assets/images/naver-login-icon.png";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <div className="w-full max-w-[320px] mx-auto my-0">
      <div className="py-14">
        <div className="flex justify-center mb-10">
          <img src={LogoImg} alt="olla" className="w-22 aspect-auto" />
        </div>
        <form className="pb-6">
          <div className="flex flex-col gap-4 mb-6">
            <Field>
              <FieldLabel htmlFor="input-id" className="sr-only">
                id
              </FieldLabel>
              <Input id="input-id" type="text" placeholder="ID" />
            </Field>
            <Field>
              <FieldLabel htmlFor="input-pw" className="sr-only">
                비밀번호
              </FieldLabel>

              <InputGroup>
                <InputGroupInput id="input-pw" type={showPw ? "text" : "password"} placeholder="비밀번호" />

                <InputGroupAddon align="inline-end" className="mr-0!">
                  <button type="button" onClick={() => setShowPw((prev) => !prev)} className="cursor-pointer">
                    {showPw ? <EyeIcon strokeWidth={1} size={20} /> : <EyeOffIcon strokeWidth={1} size={20} />}
                  </button>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <div className="flex gap-2">
              <Checkbox id="save-id" />
              <Label htmlFor="save-id" className="text-slate-800 font-normal">
                ID 저장
              </Label>
            </div>
          </div>
          <button
            type="button"
            className="bg-[#1E1B4B] text-white text-sm w-full h-10 rounded-md"
            onClick={() => {
              setErrorMsg((prev) => (prev === "" ? "잠시 후 다시 시도해주세요." : ""));
            }}
          >
            로그인
          </button>
          {errorMsg !== "" ? <p className="mt-2 text-[#DC2626] text-center text-xs">{errorMsg}</p> : null}
          <div className="flex gap-2 items-center justify-center mt-4 text-sm text-muted-foreground">
            <a href="#">ID찾기</a>
            <div className="bg-[#E2E8F0] w-px h-3" />
            <a href="#">비밀번호 찾기</a>
            <div className="bg-[#E2E8F0] w-px h-3" />
            <a href="#" onClick={() => navigate("/signup")}>
              회원가입
            </a>
          </div>
        </form>
        <div className="pt-6 border-t text-center">
          <span className="block text-xs text-muted-foreground mb-4">SNS로 로그인/회원가입</span>
          <div className="flex items-center justify-center gap-4">
            <a
              href="#"
              className="size-12"
              onClick={() => {
                navigate("/social-signup");
              }}
            >
              <img src={NaverImg} alt="네이버 로그인" />
            </a>
            <a
              href="#"
              className="size-12"
              onClick={() => {
                navigate("/social-signup");
              }}
            >
              <img src={KakaoImg} alt="카카오 로그인" />
            </a>
          </div>
        </div>
      </div>
      {/* 로그인 구현 후 삭제 하기 */}
      <div className="bg-gray-100 rounded-md p-3">
        <span className="block mb-2 text-xs text-muted-foreground">*임시 버튼(기능 추가 후 삭제 예정)</span>
        <button className="bg-gray-600 text-white w-full rounded-sm" onClick={() => navigate("/home")}>
          홈이동
        </button>
      </div>
    </div>
  );
};

export default Login;
