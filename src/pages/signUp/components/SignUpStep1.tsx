import { useState } from "react";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import type { SignUpParams } from "@/api/auth";
import type { ErrorField } from "..";

interface Props {
  setSignUpStep: (step: number) => void;
  userData: SignUpParams;
  handleUserData: <K extends keyof SignUpParams>(key: K, value: SignUpParams[K]) => void;
  errors: Partial<Record<ErrorField, string>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<ErrorField, string>>>>;
}

export default function SignUpStep1({ setSignUpStep, userData, handleUserData, errors, setErrors }: Props) {
  const [showPw, setShowPw] = useState(false);
  const [showCheckPw, setShowCheckPw] = useState(false);
  const [pwCheck, setPwCheck] = useState("");

  const validateUserData = () => {
    const newErrors: Partial<Record<ErrorField, string>> = {};

    // 1. ID
    const idRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!idRegex.test(userData.username)) {
      newErrors.username = "아이디는 4~20자 영문/숫자만 가능합니다.";
    }

    // 2. 비밀번호
    if (userData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    } else if (userData.password !== pwCheck) {
      newErrors.password = "비밀번호가 일치하지 않습니다.";
    }

    // 3. 이메일
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSignUpStep(2);
    }
  };

  return (
    <form className="pb-6">
      <div className="flex flex-col gap-4 mb-6">
        <Field className="gap-2">
          <FieldLabel htmlFor="input-sign-up-id" className="mb-1">
            ID
          </FieldLabel>

          <Input
            id="input-sign-up-id"
            placeholder="ID"
            value={userData.username}
            onChange={(e) => handleUserData("username", e.target.value)}
            aria-invalid={!!errors.username}
            maxLength={20}
            //className={errors.username && "border-red-500 ring-3 ring-red-500"}
          />

          {errors.username && <FieldDescription className="text-red-500 text-xs">{errors.username}</FieldDescription>}
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="input-sign-up-pw-1">비밀번호</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="input-sign-up-pw-1"
              type={showPw ? "text" : "password"}
              placeholder="비밀번호 8자 이상"
              value={userData.password}
              onChange={(e) => handleUserData("password", e.target.value)}
              aria-invalid={!!errors.password}
              maxLength={50}
            />
            <InputGroupAddon align="inline-end" className="mr-0!">
              <button type="button" onClick={() => setShowPw((prev) => !prev)} className="cursor-pointer">
                {showPw ? <EyeIcon strokeWidth={1} size={20} /> : <EyeOffIcon strokeWidth={1} size={20} />}
              </button>
            </InputGroupAddon>
          </InputGroup>
          {errors.password && <FieldDescription className="text-red-500 text-xs">{errors.password}</FieldDescription>}
        </Field>
        <Field>
          <FieldLabel htmlFor="input-sign-up-pw-2">비밀번호 재확인</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="input-sign-up-pw-2"
              type={showCheckPw ? "text" : "password"}
              placeholder="비밀번호 8자 이상"
              value={pwCheck}
              onChange={(e) => {
                setPwCheck(e.target.value);
              }}
              maxLength={50}
            />

            <InputGroupAddon align="inline-end" className="mr-0!">
              <button type="button" onClick={() => setShowCheckPw((prev) => !prev)} className="cursor-pointer">
                {showCheckPw ? <EyeIcon strokeWidth={1} size={20} /> : <EyeOffIcon strokeWidth={1} size={20} />}
              </button>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field className="gap-2">
          <FieldLabel htmlFor="input-sign-up-mail">이메일</FieldLabel>
          <Input
            id="input-mail"
            type="text"
            placeholder="이메일"
            value={userData.email}
            onChange={(e) => {
              handleUserData("email", e.target.value);
            }}
            aria-invalid={!!errors.email}
            //className={errors.email && "border-red-500 ring-3 ring-red-500"}
          />
          {errors.email && <FieldDescription className="text-red-500 text-xs">{errors.email}</FieldDescription>}
        </Field>
      </div>
      <button type="button" className="bg-[#1E1B4B] text-white text-sm w-full h-10 rounded-md" onClick={() => validateUserData()}>
        계속하기
      </button>
    </form>
  );
}
