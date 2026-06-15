import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function InfoModal({ open, onClose, onClickEvent }: { open: boolean; onClose: () => void; onClickEvent: (() => void) | null }) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="w-fit! flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl text-foreground">클로즈드 베타 테스트 운영 중</DialogTitle>
        </DialogHeader>
        <div className="py-10 flex flex-col gap-4 border-t w-fit">
          <div className="font-medium text-gray-700 text-sm flex flex-col gap-5">
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
        <DialogFooter className="items-end pb-3 pt-20 border-t">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
