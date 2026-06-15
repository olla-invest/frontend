import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";

export default function InfoModalMobile({ open, onClose, onClickEvent }: { open: boolean; onClose: () => void; onClickEvent: (() => void) | null }) {
  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) onClose();
      }}
    >
      <SheetContent side="bottom" showCloseButton={false} className="h-[70vh] flex gap-4 max-h-none flex-col rounded-t-xl border-t p-0">
        <SheetHeader className="shrink-0 px-4 pb-4 pt-0 text-left border-b">
          <div
            className="flex justify-center py-2"
            onClick={() => {
              onClose();
            }}
          >
            <div className="w-9 h-1.25 rounded-full bg-secondary" />
          </div>
          <SheetTitle className="font-medium text-foreground text-base">클로즈드 베타 테스트 운영 중</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="font-medium text-slate-700 text-sm flex flex-col gap-5">
            <p>안녕하세요. olla 팀입니다.</p>
            <p>
              olla 서비스는 현재 베타 테스트에 사전 지원해주신 분들에
              <br />
              한하여 이용하실 수 있습니다.
              <br />
              미지원자의 경우, 로그인이 제한될 수 있습니다.
            </p>
            <p>
              2026년 9월 정식 오픈 예정입니다.
              <br />
              정식 오픈 알림 및 추가 문의사항이 있으시면 아래로
              <br />
              연락 부탁드립니다.
              <br />
              📩 <span className="dragText">ollainvestbeta@gmail.com</span>
            </p>
          </div>
        </div>
        <SheetFooter className="p-4 pb-8 border-t">
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => {
              if (onClickEvent) {
                onClickEvent();
              }
            }}
          >
            확인
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
