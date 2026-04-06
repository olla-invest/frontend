import React, { useState } from "react";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LogoImg from "@/assets/images/olla-logo.svg";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import AgreementSection from "./components/AgreementSection";
const SocialSignUp: React.FC = () => {
  const navigate = useNavigate();

  const [agreements, setAgreements] = useState({
    agreeService: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  const [error, setError] = useState<string | null>(null);

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

    // 필수 약관 체크
    if (!agreements.agreeService || !agreements.agreePrivacy) {
      setError("필수 약관에 동의해주세요.");
      return;
    }

    try {
      // 실제 API 붙일 자리
      // await api.socialSignup(...)

      // 현재는 토큰 이미 callback에서 저장된 상태라고 가정
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        throw new Error("인증 정보가 없습니다.");
      }

      // 홈 이동
      navigate("/");
    } catch (e: unknown) {
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
              <Input id="input-sign-up-name" type="text" placeholder="이름" />
              {error && <FieldDescription className="text-[#DC2626] text-xs">{error}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel htmlFor="input-sign-up-phone">휴대폰번호</FieldLabel>
              <Input id="input-sign-up-phone" type="text" placeholder="휴대폰번호" />
            </Field>

            <Field>
              <FieldLabel htmlFor="input-sign-up-email">이메일</FieldLabel>
              <Input id="input-sign-up-email" type="text" placeholder="이메일" />
            </Field>

            <AgreementSection
              agreeService={!!agreements.agreeService}
              agreePrivacy={!!agreements.agreePrivacy}
              agreeMarketing={!!agreements.agreeMarketing}
              error={error || ""}
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
