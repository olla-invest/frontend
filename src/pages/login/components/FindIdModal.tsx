import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { CircleX } from "lucide-react";

import { postFindId, type FindIdParams } from "@/api/auth";
import { toast } from "sonner";

import axios from "axios";
import type { AuthErrorResponse } from "@/types/api/auth";

const EMAIL_LIST = [
  { name: "네이버", value: "@naver.com" },
  { name: "구글", value: "@gmail.com" },
  { name: "다음", value: "@daum.net" },
];

export default function FindIdModal({ open, onClose, onOpenFindPw }: { open: boolean; onClose: () => void; onOpenFindPw: () => void }) {
  const [findIdStep, setFindeIdStep] = useState(1);
  const [userData, setUserData] = useState<FindIdParams>({ name: "", email: "" });
  const handleFindIdData = <K extends keyof FindIdParams>(key: K, value: FindIdParams[K]) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key as "name" | "email"];
      return newErrors;
    });
  };
  const [errors, setErrors] = useState<Partial<Record<"name" | "email", string>>>({});
  const [result, setResult] = useState({
    result: "",
    value: "",
  });

  const renderFindResult = (result: string, value?: string) => {
    if (result === "success") {
      return (
        <>
          <span className="text-sm text-muted-foreground">사용자 ID</span>
          <span className="font-semibold text-foreground">{value}</span>
        </>
      );
    }
    if (result === "fail") {
      return <span className="text-sm text-muted-foreground">사용자 정보가 일치하지 않습니다</span>;
    }
  };

  const validateUserData = () => {
    const newErrors: Partial<Record<"name" | "email", string>> = {};
    // 이름
    if (!userData.name) {
      newErrors.name = "이름을 입력해 주세요.";
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
    setResult(() => ({ result: "", value: "" }));
    const isValid = validateUserData();
    if (!isValid) return;

    try {
      const res = await postFindId(userData);
      setResult(() => ({ result: "success", value: res.maskedUsername }));
      setFindeIdStep(2);
    } catch (err) {
      if (axios.isAxiosError<AuthErrorResponse>(err)) {
        const statusCode = err.response?.data?.statusCode ?? "아이디 찾기 실패";
        if (statusCode === 404) {
          setResult(() => ({ result: "fail", value: "" }));
          setFindeIdStep(2);
        } else {
          toast.error("오류가 발생했습니다. 잠시 후 다시 시도해 주세요");
          console.error("아이디 찾기 오류", err);
        }
      } else {
        toast.error("오류가 발생했습니다. 잠시 후 다시 시도해 주세요");
        console.error("아이디 찾기 오류", err);
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
          setFindeIdStep(1);
          setUserData({ name: "", email: "" });
          setErrors({});
          setResult({ result: "", value: "" });
        }
      }}
    >
      <DialogContent className="w-[384px] min-h-131">
        {findIdStep === 1 && (
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>ID찾기</DialogTitle>
              <DialogDescription>
                계정 등록 시 입력한 이름과 이메일 주소가
                <br />
                모두 일치하는 경우, ID의 일부가 표시됩니다
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="py-2 border-b mb-4">
                <span className="text-foreground font-medium">사용자 정보</span>
              </div>
              <form className="flex flex-col gap-4 pb-4 border-b">
                <Field className="gap-2">
                  <FieldLabel htmlFor="input-find-id-name" className="mb-1">
                    이름
                  </FieldLabel>
                  <Input
                    id="input-find-id-name"
                    type="text"
                    placeholder="이름"
                    value={userData.name}
                    onChange={(e) => {
                      handleFindIdData("name", e.target.value);
                    }}
                  />
                  {errors.name && <FieldDescription className="text-red-500 text-xs">{errors.name}</FieldDescription>}
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
                        handleFindIdData("email", e.target.value);
                      }}
                    />
                    {userData.email.length > 0 && (
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={() => {
                            handleFindIdData("email", "");
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
                            handleFindIdData("email", userData.email + e.value);
                          }}
                        >
                          {e.value}
                        </Button>
                      );
                    })}
                  </div>
                </Field>
              </form>
            </div>
          </div>
        )}
        {findIdStep === 2 && (
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>ID 찾기 결과</DialogTitle>
            </DialogHeader>
            <div className="py-20 px4 flex flex-col gap-2 items-center border-t border-b">{renderFindResult(result.result, result.value)}</div>
          </div>
        )}
        <DialogFooter className="items-end">
          {findIdStep === 1 && (
            <Button
              type="button"
              onClick={() => {
                handleSubmit();
              }}
            >
              ID 찾기
            </Button>
          )}
          {findIdStep === 2 && result.result !== "fail" && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenFindPw();
                }}
              >
                비밀번호 찾기
              </Button>

              <DialogClose asChild>
                <Button type="button">로그인 하러가기</Button>
              </DialogClose>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
