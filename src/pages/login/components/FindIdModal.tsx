import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function FindIdModal() {
  const [open, setOpen] = useState(false);
  const [findIdStep, setFindeIdStep] = useState(1);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        // 닫힐 때 초기화
        if (!isOpen) {
          setFindeIdStep(1);
        }
      }}
    >
      <DialogTrigger asChild>
        <a className="text-sm text-muted-foreground cursor-pointer">ID 찾기</a>
      </DialogTrigger>
      <DialogContent className="w-[384px] h-131">
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
        {findIdStep === 2 && (
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>ID 찾기 결과</DialogTitle>
            </DialogHeader>
            <div className="py-20 px4 flex flex-col gap-2 items-center border-t border-b">
              <span className="text-sm text-muted-foreground">사용자 ID</span>
              <span className="font-semibold text-foreground">admi***4</span>
            </div>
          </div>
        )}
        <DialogFooter className="items-end">
          {findIdStep === 1 && (
            <Button
              type="button"
              onClick={() => {
                setFindeIdStep(2);
              }}
            >
              ID 찾기
            </Button>
          )}
          {findIdStep === 2 && (
            <>
              <Button variant="outline">비밀번호 찾기</Button>

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
