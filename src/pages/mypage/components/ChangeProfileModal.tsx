import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import type { UserInfo } from "@/types/api/users";
import { patchMyInfo } from "@/api/users";
import { toast } from "sonner";
import { CircleX } from "lucide-react";

interface userData {
  phone: string;
  email: string;
}

const EMAIL_LIST = [
  { name: "네이버", value: "@naver.com" },
  { name: "구글", value: "@gmail.com" },
  { name: "다음", value: "@daum.net" },
];

export default function ChangeProfileModal({ open, onClose, user }: { open: boolean; onClose: () => void; user: UserInfo }) {
  const [errors, setErrors] = useState<Partial<Record<keyof userData, string>>>({});

  const [userData, setUserData] = useState<userData>({
    phone: user.phone,
    email: user.email,
  });

  /** 값 변경 */
  const handleUserData = <K extends keyof userData>(key: K, value: userData[K]) => {
    setUserData((prev) => ({
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
  const validateUserData = () => {
    const newErrors: Partial<Record<keyof userData, string>> = {};

    // 휴대폰 번호
    if (!userData.phone) {
      newErrors.phone = "휴대폰 번호를 입력해주세요.";
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
    const isValid = validateUserData();
    if (!isValid) return;
    try {
      await patchMyInfo(userData);
      onClose();
      toast.success("프로필이 변경되었습니다.", { position: "top-center" });
    } catch (err) {
      console.error("프로필 변경 실패", err);
      toast.error("프로필 변경 실패", { position: "top-center" });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="flex flex-col gap-4 w-[384px] min-h-131">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl text-foreground">비밀번호 변경</DialogTitle>
        </DialogHeader>
        <form className="pb-6">
          <div className="flex flex-col gap-4 mb-6">
            <Field className="gap-1">
              <FieldLabel htmlFor="current-input-name" className="font-medium text-sm text-foreground mb-2">
                이름
              </FieldLabel>
              <InputGroup>
                <InputGroupInput id="current-input-name" type="text" placeholder="이름" value={user.name} disabled={true} className="bg-muted text-muted-foreground" />
              </InputGroup>
            </Field>
            <Field className="gap-1">
              <FieldLabel htmlFor="change-input-phone" className="font-medium text-sm text-foreground mb-2">
                휴대폰 번호
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="change-input-phone"
                  type="text"
                  placeholder="휴대폰 번호"
                  value={userData.phone}
                  onChange={(e) => handleUserData("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                />
              </InputGroup>

              {errors.phone && <FieldDescription className="text-red-500 text-xs">{errors.phone}</FieldDescription>}
            </Field>
            {/* 이메일 */}
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
                    handleUserData("email", e.target.value);
                  }}
                />
                {userData.email.length > 0 && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={() => {
                        handleUserData("email", "");
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
                        handleUserData("email", userData.email + e.value);
                      }}
                    >
                      {e.value}
                    </Button>
                  );
                })}
              </div>
            </Field>
          </div>
        </form>
        <DialogFooter className="mt-auto">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              onClose();
            }}
          >
            취소
          </Button>
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => {
              handleSubmit();
            }}
          >
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
