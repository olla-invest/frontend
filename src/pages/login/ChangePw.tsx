import { useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { patchChangePw } from "@/api/auth";
import { useNavigate } from "react-router-dom";

interface PwData {
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePw() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showCheckPw, setShowCheckPw] = useState(false);

  const [pwData, setPwData] = useState<PwData>({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PwData, string>>>({});

  /** 값 변경 */
  const handlePwData = <K extends keyof PwData>(key: K, value: PwData[K]) => {
    setPwData((prev) => ({
      ...prev,
      [key]: value,
    }));

    // 에러 제거
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  /** 유효성 검사 */
  const validatePwData = () => {
    const newErrors: Partial<Record<keyof PwData, string>> = {};

    // 비밀번호
    if (!pwData.newPassword) {
      newErrors.newPassword = "비밀번호를 입력해주세요.";
    } else if (pwData.newPassword.length < 8) {
      newErrors.newPassword = "비밀번호는 8자 이상이어야 합니다.";
    }

    // 비밀번호 확인
    if (!pwData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (pwData.newPassword !== pwData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /** 제출 */
  const handleSubmit = async () => {
    const isValid = validatePwData();
    if (!isValid) return;

    //여기에 비밀번호 변경 API 연결
    try {
      await patchChangePw(pwData);
      navigate("/home");
    } catch (err) {
      console.error("비밀번호 변경 실패", err);
    }
  };

  return (
    <div className="w-full max-w-[320px] mx-auto my-0">
      <div className="py-14">
        <div className="flex flex-col gap-2 items-center justify-center mb-10">
          <h3 className="text-foreground text-2xl font-semibold">비밀번호 변경</h3>
          <p className="text-muted-foreground text-sm text-center">
            임시 비밀번호로 로그인하셨습니다.
            <br /> 개인정보 보호를 위해 비밀번호를 변경해 주세요
          </p>
        </div>
        <form
          className="pb-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4 mb-6">
            {/* 비밀번호 */}
            <Field className="gap-1">
              <FieldLabel htmlFor="change-input-pw" className="font-medium text-sm text-foreground mb-2">
                새 비밀번호
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="change-input-pw"
                  type={showPw ? "text" : "password"}
                  placeholder="새 비밀번호 8자 이상"
                  value={pwData.newPassword}
                  onChange={(e) => handlePwData("newPassword", e.target.value)}
                  aria-invalid={!!errors.newPassword}
                />

                <InputGroupAddon align="inline-end" className="mr-0!">
                  <button type="button" onClick={() => setShowPw((prev) => !prev)} className="cursor-pointer">
                    {showPw ? <EyeIcon strokeWidth={1} size={20} /> : <EyeOffIcon strokeWidth={1} size={20} />}
                  </button>
                </InputGroupAddon>
              </InputGroup>

              {errors.newPassword && <FieldDescription className="text-red-500 text-xs">{errors.newPassword}</FieldDescription>}
            </Field>

            {/* 비밀번호 확인 */}
            <Field className="gap-1">
              <FieldLabel htmlFor="change-input-pw-check" className="font-medium text-sm text-foreground mb-2">
                새 비밀번호 재확인
              </FieldLabel>

              <InputGroup>
                <InputGroupInput
                  id="change-input-pw-check"
                  type={showCheckPw ? "text" : "password"}
                  placeholder="새 비밀번호 재확인"
                  value={pwData.confirmPassword}
                  onChange={(e) => handlePwData("confirmPassword", e.target.value)}
                  aria-invalid={!!errors.confirmPassword}
                />

                <InputGroupAddon align="inline-end" className="mr-0!">
                  <button type="button" onClick={() => setShowCheckPw((prev) => !prev)} className="cursor-pointer">
                    {showCheckPw ? <EyeIcon strokeWidth={1} size={20} /> : <EyeOffIcon strokeWidth={1} size={20} />}
                  </button>
                </InputGroupAddon>
              </InputGroup>

              {errors.confirmPassword && <FieldDescription className="text-red-500 text-xs">{errors.confirmPassword}</FieldDescription>}
            </Field>
          </div>
          <button type="button" className="bg-[#1E1B4B] text-white text-sm w-full h-10 rounded-md" onClick={handleSubmit}>
            비밀번호 변경
          </button>
        </form>
      </div>
    </div>
  );
}
