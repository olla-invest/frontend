import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { patchChangePw } from "@/api/auth";
import { toast } from "sonner";
import axios from "axios";

interface PwData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePwModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [errors, setErrors] = useState<Partial<Record<keyof PwData, string>>>({});

  const [pwData, setPwData] = useState<PwData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
    if (!pwData.currentPassword) {
      newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
    }

    // 비밀번호
    if (!pwData.newPassword) {
      newErrors.newPassword = "비밀번호를 입력해주세요.";
    } else if (pwData.newPassword.length < 8) {
      newErrors.newPassword = "비밀번호는 8자 이상이어야 합니다.";
    }

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

  const handleSubmit = async () => {
    const isValid = validatePwData();
    if (!isValid) return;
    try {
      await patchChangePw(pwData);
      onClose();
      toast.success("비밀번호가 변경되었습니다.", { position: "top-center" });
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;

      if (status === 401) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: "현재 비밀번호가 일치하지 않습니다.",
        }));
      } else {
        toast.error("비밀번호 변경 실패", { position: "top-center" });
      }
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
              <FieldLabel htmlFor="current-input-pw" className="font-medium text-sm text-foreground mb-2">
                현재 비밀번호
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="current-input-pw"
                  type="password"
                  placeholder="현재 비밀번호"
                  value={pwData.currentPassword}
                  onChange={(e) => handlePwData("currentPassword", e.target.value)}
                  aria-invalid={!!errors.currentPassword}
                />
              </InputGroup>

              {errors.currentPassword && <FieldDescription className="text-red-500 text-xs">{errors.currentPassword}</FieldDescription>}
            </Field>
            {/* 비밀번호 */}
            <Field className="gap-1">
              <FieldLabel htmlFor="change-input-pw" className="font-medium text-sm text-foreground mb-2">
                새 비밀번호
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="change-input-pw"
                  type="password"
                  placeholder="새 비밀번호"
                  value={pwData.newPassword}
                  onChange={(e) => handlePwData("newPassword", e.target.value)}
                  aria-invalid={!!errors.newPassword}
                />
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
                  type="password"
                  placeholder="새 비밀번호 재확인"
                  value={pwData.confirmPassword}
                  onChange={(e) => handlePwData("confirmPassword", e.target.value)}
                  aria-invalid={!!errors.confirmPassword}
                />
              </InputGroup>

              {errors.confirmPassword && <FieldDescription className="text-red-500 text-xs">{errors.confirmPassword}</FieldDescription>}
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
            비밀번호 변경
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
