import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeOffIcon, EyeIcon } from "lucide-react";

interface Props {
  setSignUpStep: (step: number) => void;
}

export default function SignUpStep1({ setSignUpStep }: Props) {
  const [showPw, setShowPw] = useState(false);
  const [showCheckPw, setShowCheckPw] = useState(false);
  return (
    <form className="pb-6">
      <div className="flex flex-col gap-4 mb-6">
        <Field>
          <FieldLabel htmlFor="input-sign-up-id">ID</FieldLabel>
          <Input id="input-id" type="text" placeholder="ID 4~20자, 영문/숫자" />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-sign-up-pw-1">비밀번호</FieldLabel>
          <InputGroup>
            <InputGroupInput id="input-sign-up-pw-1" type={showPw ? "text" : "password"} placeholder="비밀번호 8자 이상" />

            <InputGroupAddon align="inline-end" className="mr-0!">
              <button type="button" onClick={() => setShowPw((prev) => !prev)} className="cursor-pointer">
                {showPw ? <EyeIcon strokeWidth={1} size={20} /> : <EyeOffIcon strokeWidth={1} size={20} />}
              </button>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-sign-up-pw-2">비밀번호 재확인</FieldLabel>
          <InputGroup>
            <InputGroupInput id="input-sign-up-pw-2" type={showCheckPw ? "text" : "password"} placeholder="비밀번호 8자 이상" />

            <InputGroupAddon align="inline-end" className="mr-0!">
              <button type="button" onClick={() => setShowCheckPw((prev) => !prev)} className="cursor-pointer">
                {showCheckPw ? <EyeIcon strokeWidth={1} size={20} /> : <EyeOffIcon strokeWidth={1} size={20} />}
              </button>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-sign-up-mail">이메일</FieldLabel>
          <Input id="input-mail" type="text" placeholder="이메일" />
        </Field>
      </div>
      <button type="button" className="bg-[#1E1B4B] text-white text-sm w-full h-10 rounded-md" onClick={() => setSignUpStep(2)}>
        계속하기
      </button>
    </form>
  );
}
