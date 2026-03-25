import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { postSignUp, type SignUpParams } from "@/api/auth";
import type { ErrorField } from "..";
import { toast } from "sonner";
import axios from "axios";
import type { AuthErrorResponse } from "@/types/api/auth";

interface Props {
  setSignUpStep: (step: number) => void;
  userData: SignUpParams;
  handleUserData: <K extends keyof SignUpParams>(key: K, value: SignUpParams[K]) => void;
  errors: Partial<Record<ErrorField, string>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<ErrorField, string>>>>;
}

export default function SignUpStep2({ setSignUpStep, userData, handleUserData, errors, setErrors }: Props) {
  const allChecked = userData.agreeService && userData.agreePrivacy && userData.agreeMarketing;

  // 전체 선택
  const handleAllChange = (checked: boolean) => {
    handleUserData("agreeService", checked);
    handleUserData("agreePrivacy", checked);
    handleUserData("agreeMarketing", checked);
  };

  // 개별 선택
  const handleChange = (key: "agreeService" | "agreePrivacy" | "agreeMarketing", checked: boolean) => {
    handleUserData(key, checked);
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<ErrorField, string>> = {};

    // 이름
    if (!userData.name || userData.name.trim() === "") {
      newErrors.name = "이름을 입력해주세요.";
    }

    // 휴대폰
    if (!userData.phone || userData.phone.trim() === "") {
      newErrors.phone = "휴대폰번호를 입력해주세요.";
    }

    // 약관
    if (!userData.agreeService || !userData.agreePrivacy) {
      newErrors.agreeService = "필수 약관에 동의해 주세요.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = validateStep2();
    if (!isValid) return;

    try {
      await postSignUp(userData);
      setSignUpStep(3);
    } catch (error) {
      if (axios.isAxiosError<AuthErrorResponse>(error)) {
        const message = error.response?.data?.message ?? "회원가입에 실패했습니다.";

        toast.error(message, { position: "top-center" });
        console.error("회원가입 실패:", error);
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
        console.error("예상치 못한 에러:", error);
      }
    }
  };

  return (
    <form className="pb-6">
      <div className="flex flex-col gap-4 mb-6">
        <Field className="gap-2">
          <FieldLabel htmlFor="input-sign-up-name" className="mb-1">
            이름
          </FieldLabel>
          <Input id="input-sign-up-name" placeholder="이름" value={userData.name} onChange={(e) => handleUserData("name", e.target.value)} aria-invalid={!!errors.name} maxLength={100} />

          {errors.name && <FieldDescription className="text-red-500 text-xs">{errors.name}</FieldDescription>}
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="input-sign-up-phone" className="mb-1">
            휴대폰번호
          </FieldLabel>
          <Input id="input-sign-up-phone" placeholder="휴대폰번호" value={userData.phone} onChange={(e) => handleUserData("phone", e.target.value)} aria-invalid={!!errors.phone} maxLength={20} />

          {errors.phone && <FieldDescription className="text-red-500 text-xs">{errors.phone}</FieldDescription>}
        </Field>
        <div className="mt-2">
          <div className={`${errors.agreeService && "border-red-500 ring-3 ring-red-100"} p-3 border rounded-md`}>
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
                <Checkbox id="termsOfServiceAgreed" checked={userData.agreeService} onCheckedChange={(checked) => handleChange("agreeService", !!checked)} />
                <Label htmlFor="termsOfServiceAgreed" className="font-normal">
                  (필수) 서비스 이용약관 동의
                </Label>
              </div>

              <div className="flex gap-2 text-sm">
                <Checkbox id="privacyPolicyAgreed" checked={userData.agreePrivacy} onCheckedChange={(checked) => handleChange("agreePrivacy", !!checked)} />
                <Label htmlFor="privacyPolicyAgreed" className="font-normal">
                  (필수) 개인정보 수집·이용 동의
                </Label>
              </div>

              <div className="flex gap-2 text-sm">
                <Checkbox id="marketingConsentAgreed" checked={userData.agreeMarketing} onCheckedChange={(checked) => handleChange("agreeMarketing", !!checked)} />
                <Label htmlFor="marketingConsentAgreed" className="font-normal">
                  (선택) 마케팅 정보 수신 동의
                </Label>
              </div>
            </div>
          </div>
          {errors.agreeService && <span className="text-red-500 text-xs">{errors.agreeService}</span>}
        </div>
      </div>
      <button type="button" className="bg-[#1E1B4B] text-white text-sm w-full h-10 rounded-md" onClick={() => handleSubmit()}>
        가입하기
      </button>
    </form>
  );
}
