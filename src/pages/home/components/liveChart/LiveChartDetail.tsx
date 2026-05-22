import DraggableModal from "@/components/DraggableModal";
import LiveChartDetailContent from "./LiveChartDetailContent";
import type { StockDetailInfo } from "./stockDetailTypes";

interface LiveChartDetailProps {
  onClose: () => void;
  detailInfo: StockDetailInfo;
}

export default function LiveChartDetail({ onClose, detailInfo }: LiveChartDetailProps) {
  return (
    <DraggableModal onClose={onClose}>
      <LiveChartDetailContent detailInfo={detailInfo} variant="modal" />
    </DraggableModal>
  );
}
