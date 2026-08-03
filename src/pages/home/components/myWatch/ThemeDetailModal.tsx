import DraggableModal from "@/components/DraggableModal";

import IssueDetailContent from "../issueTheme/IssueDetailContent";
import type { IssueDetailSummary } from "../issueTheme/IssueDetailContent";

interface ModalProps {
  onClose: () => void;
  selectIssue: IssueDetailSummary;
}
export default function ThemeDetailModal({ onClose, selectIssue }: ModalProps) {
  return (
    <DraggableModal onClose={onClose}>
      <IssueDetailContent selectIssue={selectIssue} />
    </DraggableModal>
  );
}
