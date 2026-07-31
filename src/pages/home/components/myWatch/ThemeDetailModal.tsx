import DraggableModal from "@/components/DraggableModal";

import type { IssueTheme } from "@/types/api/issueTheme";
import IssueDetailContent from "../issueTheme/IssueDetailContent";

interface ModalProps {
  onClose: () => void;
  selectIssue: IssueTheme;
}
export default function ThemeDetailModal({ onClose, selectIssue }: ModalProps) {
  return (
    <DraggableModal onClose={onClose}>
      <IssueDetailContent selectIssue={selectIssue} />
    </DraggableModal>
  );
}
