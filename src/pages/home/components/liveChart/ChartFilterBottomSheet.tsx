import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BottomSheetHeight = 70 | 90;

interface ChartFilterBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  height: BottomSheetHeight;
  title: string;
  description?: string;
  children: React.ReactNode;
  onCancel: () => void;
  onApply: () => void;
}

export default function ChartFilterBottomSheet({ open, onOpenChange, height, title, description, children, onCancel, onApply }: ChartFilterBottomSheetProps) {
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const handleApply = () => {
    onApply();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className={cn("flex max-h-none flex-col gap-0 rounded-t-xl border-t p-0", height === 90 ? "h-[90dvh]" : "h-[70dvh]")}>
        <SheetHeader className={`shrink-0 px-4 py-4 text-left ${description ? "border-b" : ""}`}>
          <SheetTitle className="text-base font-medium">{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        <SheetFooter className="shrink-0 flex-row gap-2 border-t bg-background px-4 py-3">
          <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
            취소
          </Button>
          <Button type="button" className="flex-1" onClick={handleApply}>
            적용
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
