import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

export default function SelectPlanModal({ open, onClose, setModal }: { open: boolean; onClose: () => void; setModal: React.Dispatch<React.SetStateAction<string>> }) {
  const handleSubmit = () => {
    setModal("upgrade");
  };

  const [planType, setPlanTyle] = useState("month");

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="w-[384px] h-131">
        <div className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>요금제 선택</DialogTitle>
            <DialogDescription>언제든지 플랜 변경 및 해지 할 수 있습니다.</DialogDescription>
          </DialogHeader>
          <div>
            <div className="flex flex-col gap-2 py-4 border-y mb-4">
              <div
                className={`p-4 flex flex-col gap-2 text-sm rounded-lg border cursor-pointer ${planType === "month" ? "border-primary bg-accent" : ""}`}
                onClick={() => {
                  setPlanTyle("month");
                }}
              >
                <span className="text-accent-foreground font-medium">월별 결제</span>
                <div className="flex items-center text-foreground">
                  <b className="font-semibold text-xl">NN,NNN원</b>
                  <span>/월</span>
                </div>
              </div>
              <div
                className={`p-4 flex flex-col gap-2 text-sm rounded-lg border cursor-pointer ${planType === "year" ? "border-primary bg-accent" : ""}`}
                onClick={() => {
                  setPlanTyle("year");
                }}
              >
                <span className="text-accent-foreground font-medium">연간 결제</span>
                <div className="flex items-center text-foreground gap-2">
                  <b className="font-semibold text-xl">NN,NNN원</b>
                  <span className="text-muted-foreground">N,NNN원/월</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-800">
              구독을 시작하면 <span className="text-primary">서비스 이용약관</span> 및 <span className="text-primary">개인정보 처리방침</span>에 동의하고
              <br /> 선택한 요금제로 자동 결제가 진행됩니다.
            </p>
          </div>
        </div>
        <DialogFooter className="items-end">
          <Button
            type="button"
            onClick={() => {
              handleSubmit();
            }}
          >
            다음
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
