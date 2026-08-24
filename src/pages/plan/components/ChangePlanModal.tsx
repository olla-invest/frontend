import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { SelectPlanType } from "..";
import { postFirstPay } from "@/api/payment";

export default function ChangePlanModal({ open, onClose, type, selectPlan }: { open: boolean; onClose: () => void; type: string; selectPlan: SelectPlanType }) {
  const handleSubmit = async () => {
    const authKey = import.meta.env.VITE_TOSS_API_KEY;
    const customerKey = import.meta.env.VITE_TOSS_CLI_KEY;

    console.log(import.meta.env);

    console.log(authKey, customerKey);
    if (!authKey || !customerKey) return;
    try {
      const res = await postFirstPay({
        authKey: authKey,
        customerKey: customerKey,
        planType: selectPlan.planType,
        billingCycle: selectPlan.billingCycle,
      });
      console.log(res);
    } catch (err) {
      console.error("토스 결제 호출 실패" + err);
    }
  };

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
            <DialogTitle>
              {selectPlan.planType}으로{type === "upgrade" ? "업그레이드 " : "변경"}할까요?
            </DialogTitle>
            <DialogDescription>
              {type === "upgrade"
                ? "결제 완료 즉시 모든 Premium 기능을 바로 이용할 수 있어요. 남은 이용 기간을 자동으로 차액 정산돼요."
                : "현제 결제 기간이 종료된 후 Basic 플랜으로 변경돼요. 그전까지는 Pro 기능을 그대로 이용할 수 있어요."}
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="flex flex-col gap-4 py-4 border-y mb-4">
              <div className="flex items-center gap-1 text-sm">
                <span className="text-slate-700">현재 플랜: </span>
                <span className="font-semibold text-muted-foreground">FREE</span>
                <span className="border py-0.5 px-2.5 rounded-lg font-medium text-xs">이용중</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-slate-700">변경 플랜: </span>
                <span className="font-semibold text-foreground">{selectPlan.planType}</span>
              </div>
              <div className="p-4 flex flex-col rounded-lg border bg-muted">
                <span className="font-medium text-sm text-accent-foreground mb-2">오늘 결제 금액</span>
                <span className="font-semibold text-xl text-foreground mb-1">NN,NNN원</span>
                <p className="text-xs text-muted-foreground">남은 기간 차액이 반영되었어요.</p>
              </div>
            </div>
            <p className="text-xs text-slate-800">
              자세한 정산 내역은 결제 완료 후 발급되는 결제내역에서
              <br />
              확인할 수 있어요.
            </p>
          </div>
        </div>
        <DialogFooter className="items-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => {
              handleSubmit();
            }}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
