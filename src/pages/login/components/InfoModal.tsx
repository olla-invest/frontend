import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export default function InfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="max-w-fit!">
        <DialogTitle className="sr-only">회원가입 안내</DialogTitle>
        <div className="pt-6 flex flex-col gap-4 w-159">
          <h2 className="font-bold text-[17px]">클로즈드 베타 테스트 운영 중</h2>
          <div className="text-[17px] flex flex-col gap-7 py-2">
            <p>안녕하세요. olla 팀입니다.</p>
            <p>
              olla 서비스는 현재 베타 테스트에 사전 지원해주신 분들에 한하여 이용하실 수 있습니다.
              <br />
              미지원자의 경우, 로그인이 제한될 수 있습니다.
            </p>
            <p>
              2026년 9월 정식 오픈 예정입니다.
              <br />
              정식 오픈 알림 및 추가 문의사항이 있으시면 아래로 연락 부탁드립니다.
              <br />
              📩 ollainvestbeta@gmail.com
            </p>
          </div>
        </div>
        <DialogFooter className="items-end py-3 border-t">
          <Button variant="dark" type="button" className="cursor-pointer" onClick={() => navigate("/signup")}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
