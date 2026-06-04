import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LogoImg from "@/assets/images/olla-logo.svg";
import AgreementSection from "./components/AgreementSection";

import { useAuthStore } from "@/store/useAuthStore";
import { patchSnsSignUp } from "@/api/auth";

const SocialSignUp: React.FC = () => {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const storeUserInfo = useAuthStore((state) => state.userInfo);

  const [agreements, setAgreements] = useState({
    agreeService: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: storeUserInfo?.email || "",
    phone: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  // 전체 선택
  const handleAllChange = (checked: boolean) => {
    setAgreements({
      agreeService: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
    });
  };

  // 개별 선택
  const handleChange = (key: keyof typeof agreements, checked: boolean) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!userInfo.name) {
      setError("이름을 입력해주세요.");
      setErrorType("name");
      return;
    }

    if (!userInfo.phone) {
      setError("휴대폰번호를 입력해주세요.");
      setErrorType("phone");
      return;
    }

    if (!userInfo.email) {
      setError("이메일을 입력해주세요.");
      setErrorType("email");
      return;
    }

    // 필수 약관 체크
    if (!agreements.agreeService || !agreements.agreePrivacy) {
      setError("필수 약관에 동의해주세요.");
      setErrorType("agreements");
      return;
    }

    try {
      // accessToken 체크
      if (!storeUserInfo?.accessToken) {
        throw new Error("인증 정보가 없습니다.");
      }

      // SNS 회원가입 API
      await patchSnsSignUp({
        // username: storeUserInfo.username || "",
        name: userInfo.name,
        phone: userInfo.phone,
        email: userInfo.email,
        agreeService: agreements.agreeService,
        agreePrivacy: agreements.agreePrivacy,
        agreeMarketing: agreements.agreeMarketing,
      });

      // 회원가입 완료 후 최종 로그인 처리
      login({
        accessToken: storeUserInfo.accessToken,
        username: storeUserInfo.username,
        name: userInfo.name,
        email: userInfo.email,
        userId: storeUserInfo.userId,
      });

      // 홈 이동
      navigate("/home", {
        replace: true,
      });
    } catch (e: unknown) {
      console.error(e);

      if (isAxiosError(e) && e.response?.data?.message?.includes("이미 해당 이메일")) {
        setError("이미 해당 이메일로 가입된 계정이 있습니다. 일반 로그인을 이용해주세요.");
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="w-full max-w-[320px] mx-auto my-0">
      <div className="py-14">
        <div className="flex justify-center mb-10">
          <img src={LogoImg} alt="olla" className="w-22 aspect-auto" />
        </div>

        <form
          className="pb-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4 mb-6">
            <Field className="gap-2">
              <FieldLabel htmlFor="input-sign-up-name" className="mb-1">
                이름
              </FieldLabel>

              <Input
                id="input-sign-up-name"
                type="text"
                placeholder="이름"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              {errorType === "name" && <FieldDescription className="text-red-500">{error}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel htmlFor="input-sign-up-phone">휴대폰번호</FieldLabel>

              <Input
                id="input-sign-up-phone"
                type="text"
                placeholder="휴대폰번호"
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
              {errorType === "phone" && <FieldDescription className="text-red-500">{error}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel htmlFor="input-sign-up-email">이메일</FieldLabel>

              <Input
                id="input-sign-up-email"
                type="text"
                placeholder="이메일"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
              {errorType === "email" && <FieldDescription className="text-red-500">{error}</FieldDescription>}
            </Field>

            <AgreementSection
              agreeService={!!agreements.agreeService}
              agreePrivacy={!!agreements.agreePrivacy}
              agreeMarketing={!!agreements.agreeMarketing}
              error={error || ""}
              errorType={errorType || ""}
              onAllChange={handleAllChange}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="bg-[#1E1B4B] text-white text-sm w-full h-10 rounded-md">
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SocialSignUp;
