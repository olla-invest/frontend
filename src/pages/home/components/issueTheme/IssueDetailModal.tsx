import DraggableModal from "@/components/DraggableModal";
import type { IssueTheme } from "@/types/api/issueTheme";
import IssueDetailContent from "./IssueDetailContent";

interface ModalProps {
  onClose: () => void;
  selectIssue: IssueTheme;
}
export default function IssueDetailModal({ onClose, selectIssue }: ModalProps) {
  return (
    <DraggableModal onClose={onClose}>
      <IssueDetailContent selectIssue={selectIssue} />
    </DraggableModal>
  );
}
