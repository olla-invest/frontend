import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function FindPwModal() {
  const [open, setOpen] = useState(false);
  const [findPwStep, setFindePwStep] = useState(1);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        // 닫힐 때 초기화
        if (!isOpen) {
          setFindePwStep(1);
        }
      }}
    >
      <DialogTrigger asChild>
        <a className="text-sm text-muted-foreground cursor-pointer">비밀번호 찾기</a>
      </DialogTrigger>
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
                <Field>
                  <FieldLabel htmlFor="input-find-id-name">이름</FieldLabel>
                  <Input id="input-find-id-name" type="text" placeholder="이름" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="input-find-id-mail">이메일</FieldLabel>
                  <Input id="input-find-id-mail" type="text" placeholder="이메일" />
                </Field>
              </form>
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
                user@email.com으로
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
                setFindePwStep(2);
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
