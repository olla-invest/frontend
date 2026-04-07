import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;

  onConfirm: () => void;
  onCancel?: () => void;

  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({ open, onOpenChange, title, description, onConfirm, onCancel, confirmText = "확인", cancelText = "취소" }: ConfirmModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[384px]">
        <DialogHeader>
          <DialogTitle className="h-7">{title}</DialogTitle>
          {description && <DialogDescription className="text-center text-sm text-foreground font-medium pb-6">{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter className="w-full flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button type="button" variant="outline" className="text-primary flex-1" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
