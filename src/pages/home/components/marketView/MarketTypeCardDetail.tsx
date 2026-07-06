import type { MarketData } from "@/types/api/marketView";
import FollowThroughDateModal from "./marketTypeCard/FollowThroughDateModal";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const getCardLabel = (marketState: string) => {
  switch (marketState) {
    case "반등 시도 중":
      return "bg-slate-50 text-slate-700";
    case "압박받는 상승 중":
      return "bg-slate-50 text-slate-700";
    case "안정적으로 상승중":
      return "bg-blue-50 text-blue-500";
    case "조정 중":
      return "bg-rose-50 text-rose-500";
    default:
      return "bg-slate-50 text-slate-700";
  }
};

const getCardDot = (marketState: string) => {
  switch (marketState) {
    case "반등 시도 중":
      return "bg-slate-500";
    case "압박받는 상승 중":
      return "bg-slate-500";
    case "안정적으로 상승중":
      return "bg-blue-500";
    case "조정 중":
      return "bg-rose-500";
    default:
      return "bg-slate-500";
  }
};

const signalColorMap: Record<string, string> = {
  blue: "bg-blue-500",
  rose: "bg-rose-500",
  slate: "bg-slate-500",
};

export default function MarketTypeCardDetail({ marketName, info }: { marketName: string; info: MarketData }) {
  const latestDistributionDay = info.distribution.latestDays;
  const [isFollowThroughDateModalOpen, setIsFollowThroughDateModalOpen] = useState(false);

  const isMobile = useIsMobile();
  const SLICE = isMobile ? 2 : 3;

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* 상단 */}
      <div className="py-2 flex gap-0 md:gap-2 justify-between w-full items-start flex-wrap md:flex-nowrap">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className={`size-2 rounded-full shrink-0 ${getCardDot(info.marketState)}`} />
            <span className="text-slate-800 font-medium">
              {marketName} {info.marketState}
            </span>
          </div>
          <span className="text-slate-700 text-sm hidden md:block">{info.alertMessage || "-"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className={`size-2 rounded-full ${signalColorMap[info?.signalMeta?.short?.inactiveColorClass] ?? "bg-slate-500"}`} />
            <div className="text-muted-foreground text-xs">단기</div>
          </div>
          <div className="flex items-center gap-1">
            <div className={`size-2 rounded-full ${signalColorMap[info?.signalMeta?.long?.inactiveColorClass] ?? "bg-slate-500"}`} />
            <div className="text-muted-foreground text-xs">장기</div>
          </div>
        </div>
        <span className="text-slate-700 text-sm w-full shrink-0 block md:hidden">{info.alertMessage || "-"}</span>
      </div>

      {/* 중간 */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className={`p-4 flex justify-between rounded-md ${getCardLabel(info.marketState)} md:flex-row md:items-center items-start flex-col`}>
          <span className="text-slate-800 text-sm">권장비중</span>
          <span className={`font-semibold text-sm md:text-base`}>
            {info.recommendedExposure.min} ~ {info.recommendedExposure.max}%
          </span>
        </div>
        <div className="p-4 flex justify-between rounded-md bg-slate-50 md:flex-row md:items-center items-start flex-col">
          <span className="text-slate-800 text-sm">매도 신호</span>
          <span className="font-semibold text-slate-700 text-sm md:text-base">{info.distribution.count}회</span>
        </div>
        <div className="p-4 flex justify-between rounded-md bg-slate-50 md:flex-row md:items-center items-start flex-col">
          <span className="text-slate-800 text-sm">상승 확인일</span>
          <span className="font-semibold text-slate-700 text-xs md:text-base">{info.rally.followThroughDate ?? "-"}</span>
        </div>
      </div>

      {/* 하단 */}
      <div className="flex items-center gap-2 flex-wrap">
        {latestDistributionDay && (
          <div className="flex gap-1 items-center text-xs shrink-0">
            <span className="text-muted-foreground">매도 신호일</span>
            {latestDistributionDay.slice(0, SLICE).map((day, index, arr) => (
              <span key={index} className="text-slate-800 font-medium">
                {day.tradeDate.slice(5).replace("-", "-")}({day.changeRate}%)
                {index < arr.length - 1 && ", "}
              </span>
            ))}
            {latestDistributionDay.length > SLICE && (
              <span className="text-slate-800 font-medium cursor-pointer" onClick={() => setIsFollowThroughDateModalOpen(true)}>
                ...더보기
              </span>
            )}
          </div>
        )}
        <div className="flex gap-1 items-center text-xs shrink-0">
          <span className="text-muted-foreground">상승 확인일</span>
          <span className="text-slate-800 font-medium">{info.rally.followThroughDate ?? "-"}</span>
        </div>
        <div className="flex gap-1 items-center text-xs shrink-0">
          <span className="text-muted-foreground">반등일차</span>
          <span className="text-slate-800 font-medium">{info.rally.day ? `${info.rally.day}일차` : "-"}</span>
        </div>
      </div>
      {isFollowThroughDateModalOpen && <FollowThroughDateModal isOpen={isFollowThroughDateModalOpen} onClose={() => setIsFollowThroughDateModalOpen(false)} marketName={marketName} />}
    </div>
  );
}
