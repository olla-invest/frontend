import React, { useState } from "react";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import LogoImg from "@/assets/images/olla-logo.svg";
import { useNavigate } from "react-router-dom";

const SocialSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    marketing: false,
  });

  const allChecked = agreements.termsOfService && agreements.privacyPolicy && agreements.marketing;

  // 전체 선택
  const handleAllChange = (checked: boolean) => {
    setAgreements({
      termsOfService: checked,
      privacyPolicy: checked,
      marketing: checked,
    });
  };

  // 개별 선택
  const handleChange = (key: keyof typeof agreements, checked: boolean) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  return (
    <div className="w-full max-w-[320px] mx-auto my-0">
      <div className="py-14">
        <div className="flex justify-center mb-10">
          <img src={LogoImg} alt="olla" className="w-22 aspect-auto" />
        </div>
        <form className="pb-6">
          <div className="flex flex-col gap-4 mb-6">
            <Field className="gap-2">
              <FieldLabel htmlFor="input-sign-up-name" className="mb-1">
                이름
              </FieldLabel>
              <Input id="input-sign-up-name" type="text" placeholder="이름" aria-invalid />
              <FieldDescription className="text-[#DC2626] text-xs">이름을 입력해주세요.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="input-sign-up-phone">휴대폰번호</FieldLabel>
              <Input id="input-sign-up-phone" type="text" placeholder="휴대폰번호" />
            </Field>
            <Field>
              <FieldLabel htmlFor="input-sign-up-phone">이메일</FieldLabel>
              <Input id="input-sign-up-phone" type="text" placeholder="이메일" />
            </Field>
            <div className="p-3 border rounded-md mt-2">
              {/* 전체 선택 */}
              <div className="pb-2.5 mb-2.5 border-b">
                <div className="flex gap-2">
                  <Checkbox id="allAgreed" checked={allChecked} onCheckedChange={(checked) => handleAllChange(!!checked)} />
                  <Label htmlFor="allAgreed" className="text-sm font-medium">
                    약관에 모두 동의
                  </Label>
                </div>
              </div>

              {/* 개별 항목 */}
              <div className="flex flex-col gap-2.5">
                <div className="flex gap-2 text-sm">
                  <Checkbox id="termsOfServiceAgreed" checked={agreements.termsOfService} onCheckedChange={(checked) => handleChange("termsOfService", !!checked)} />
                  <Label htmlFor="termsOfServiceAgreed" className="font-normal">
                    (필수) 서비스 이용약관 동의
                  </Label>
                </div>

                <div className="flex gap-2 text-sm">
                  <Checkbox id="privacyPolicyAgreed" checked={agreements.privacyPolicy} onCheckedChange={(checked) => handleChange("privacyPolicy", !!checked)} />
                  <Label htmlFor="privacyPolicyAgreed" className="font-normal">
                    (필수) 개인정보 수집·이용 동의
                  </Label>
                </div>

                <div className="flex gap-2 text-sm">
                  <Checkbox id="marketingConsentAgreed" checked={agreements.marketing} onCheckedChange={(checked) => handleChange("marketing", !!checked)} />
                  <Label htmlFor="marketingConsentAgreed" className="font-normal">
                    (선택) 마케팅 정보 수신 동의
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <button type="button" className="bg-[#1E1B4B] text-white text-sm w-full h-10 rounded-md">
            가입하기
          </button>
        </form>
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

export default SocialSignUp;
