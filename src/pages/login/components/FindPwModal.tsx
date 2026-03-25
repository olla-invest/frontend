import { useState } from "react";
import { postFindPw, type FindPwParams } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { CircleX } from "lucide-react";

import axios from "axios";
import type { AuthErrorResponse } from "@/types/api/auth";
import { toast } from "sonner";

const EMAIL_LIST = [
  { name: "네이버", value: "@naver.com" },
  { name: "구글", value: "@gmail.com" },
  { name: "다음", value: "@daum.net" },
];

export default function FindPwModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [findPwStep, setFindePwStep] = useState(1);
  const [userData, setUserData] = useState<FindPwParams>({ username: "", email: "" });

  const handleFindPwData = <K extends keyof FindPwParams>(key: K, value: FindPwParams[K]) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key as "username" | "email"];
      return newErrors;
    });
  };
  const [errors, setErrors] = useState<Partial<Record<"username" | "email", string>>>({});
  const [failMsg, setFailMsg] = useState("");
  const validateUserData = () => {
    const newErrors: Partial<Record<"username" | "email", string>> = {};
    // 이름
    if (!userData.username) {
      newErrors.username = "ID를 입력해 주세요.";
    }
    // 이메일
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userData.email) {
      newErrors.email = "이메일을 입력해 주세요.";
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setFailMsg("");
    const isValid = validateUserData();
    if (!isValid) return;

    try {
      await postFindPw(userData);
      setFindePwStep(2);
    } catch (err) {
      if (axios.isAxiosError<AuthErrorResponse>(err)) {
        const statusCode = err.response?.data?.statusCode ?? "비밀번호 찾기 실패";
        if (statusCode === 404) {
          setFailMsg("입력하신 정보로 가입된 계정을 찾을 수 없습니다.");
        } else {
          toast.error("오류가 발생했습니다. 잠시 후 다시 시도해 주세요");
          console.error("비밀번호 찾기 오류", err);
        }
      } else {
        toast.error("오류가 발생했습니다. 잠시 후 다시 시도해 주세요");
        console.error("비밀번호 찾기 오류", err);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();

        // 닫힐 때 초기화
        if (!isOpen) {
          setFindePwStep(1);
        }
      }}
    >
      <DialogContent className="w-[384px] h-131">
        {findPwStep === 1 && (
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>비밀번호 찾기</DialogTitle>
              <DialogDescription>
                아이디와 이메일 주소가 모두 일치하는 경우,
                <br /> 등록된 이메일로 임시 비밀번호를 발송합니다
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="py-2 border-b mb-4">
                <span className="text-foreground font-medium">사용자 정보</span>
              </div>
              <form className="flex flex-col gap-4 pb-4 border-b">
                <Field className="gap-2">
                  <FieldLabel htmlFor="input-find-pw-id" className="mb-1">
                    ID
                  </FieldLabel>
                  <Input
                    id="input-find-pw-id"
                    type="text"
                    placeholder="ID"
                    value={userData.username}
                    onChange={(e) => {
                      handleFindPwData("username", e.target.value);
                    }}
                  />
                  {errors.username && <FieldDescription className="text-red-500 text-xs">{errors.username}</FieldDescription>}
                </Field>
                <Field className="gap-2">
                  <FieldLabel htmlFor="input-find-id-email" className="mb-1">
                    이메일
                  </FieldLabel>
                  <InputGroup className="overflow-hidden">
                    <InputGroupInput
                      id="input-find-id-email"
                      type="email"
                      placeholder="이메일"
                      value={userData.email}
                      onChange={(e) => {
                        handleFindPwData("email", e.target.value);
                      }}
                    />
                    {userData.email.length > 0 && (
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={() => {
                            handleFindPwData("email", "");
                          }}
                        >
                          <CircleX />
                        </InputGroupButton>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                  {errors.email && <FieldDescription className="text-red-500 text-xs">{errors.email}</FieldDescription>}
                  <div className={`flex gap-2 ${userData.email.length > 0 ? "opacity-100" : "opacity-0"} transition-all`}>
                    {EMAIL_LIST.map((e, i) => {
                      return (
                        <Button
                          key={i}
                          variant={"outline"}
                          type="button"
                          size={"sm"}
                          className="rounded-full text-slate-800 text-xs font-normal"
                          onClick={() => {
                            handleFindPwData("email", userData.email + e.value);
                          }}
                        >
                          {e.value}
                        </Button>
                      );
                    })}
                  </div>
                </Field>
              </form>
              {failMsg && <p className="mt-4 text-destructive text-xs text-center">입력하신 정보로 가입된 계정을 찾을 수 없습니다. 다시 확인해주세요.</p>}
            </div>
          </div>
        )}
        {findPwStep === 2 && (
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>비밀번호 찾기 결과</DialogTitle>
            </DialogHeader>
            <div className="py-20 px4 flex flex-col gap-2 items-center border-t border-b">
              <span className="font-semibold text-foreground">임시 비밀번호 발송 완료</span>
              <p className="text-sm text-muted-foreground text-center">
                {userData.email}으로
                <br />
                임시 비밀번호가 발송되었습니다
                <br /> 메일함을 확인해주세요
              </p>
            </div>
          </div>
        )}
        <DialogFooter className="items-end">
          {findPwStep === 1 && (
            <Button
              type="button"
              onClick={() => {
                handleSubmit();
              }}
            >
              비밀번호 찾기
            </Button>
          )}
          {findPwStep === 2 && (
            <DialogClose asChild>
              <Button type="button">확인</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
