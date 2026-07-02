interface PropsType {
  info: {
    marketName: string;
    status: string;
    statusDetail: string;
  };
}

export default function MarketTypeCardDetail({ info: { marketName, status, statusDetail } }: PropsType) {
  const dotColorMap: Record<string, string> = {
    sell: "bg-blue-50",
    buy: "bg-rose-50",
    neutral: "bg-slate-50",
  };

  const textColorMap: Record<string, string> = {
    sell: "text-blue-500",
    buy: "text-rose-500",
    neutral: "text-slate-700",
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 상단 */}
      <div className="py-2 flex gap-2 justify-between w-full">
        <div className="flex items-center gap-2 text-sm">
          <div className={`size-2 rounded-full bg-${status === "sell" ? "blue" : status === "buy" ? "rose" : "slate"}-500`} />
          <span className="text-slate-800 font-medium">{marketName}</span>
          <span className="text-slate-700 text-sm">{statusDetail}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className={`size-2 rounded-full bg-rose-500`} />
            <div className="text-muted-foreground text-xs">단기</div>
          </div>
          <div className="flex items-center gap-1">
            <div className={`size-2 rounded-full bg-rose-500`} />
            <div className="text-muted-foreground text-xs">장기</div>
          </div>
        </div>
      </div>
      {/* 중간 */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`p-4 flex items-center justify-between rounded-md ${dotColorMap[status] ?? "bg-slate-500"}`}>
          <span className="text-slate-800 text-sm">권장비중</span>
          <span className={`font-semibold ${textColorMap[status] ?? "text-slate-500"}`}>80 ~ 100%</span>
        </div>
        <div className="p-4 flex items-center justify-between rounded-md bg-slate-50">
          <span className="text-slate-800 text-sm">매도 신호</span>
          <span className="font-semibold text-slate-700">2회</span>
        </div>
        <div className="p-4 flex items-center justify-between rounded-md bg-slate-50">
          <span className="text-slate-800 text-sm">상승 확인일</span>
          <span className="font-semibold text-slate-700">2025-09-21</span>
        </div>
      </div>
      {/* 하단 */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 items-center text-xs">
          <span className="text-muted-foreground">매도 신호일</span>
          <span className="text-slate-800 font-medium">05-15(-5.68%)</span>
        </div>
        <div className="flex gap-1 items-center text-xs">
          <span className="text-muted-foreground">상승 확인일 </span>
          <span className="text-slate-800 font-medium">2025-09-12</span>
        </div>
        <div className="flex gap-1 items-center text-xs">
          <span className="text-muted-foreground">반등일차</span>
          <span className="text-slate-800 font-medium">4일차</span>
        </div>
      </div>
    </div>
  );
}
