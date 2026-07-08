import React from "react";
import type { NewHighLow } from "@/types/api/marketView";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HighLow({ kospiHighLow, kosdaqHighLow }: { kospiHighLow: NewHighLow | undefined; kosdaqHighLow: NewHighLow | undefined }) {
  const isMobile = useIsMobile();

  const getColors = (value: number) => {
    if (value > 0) {
      return { color: "rose", barColor: "bg-linear-to-r from-slate-200 to-rose-500" };
    } else if (value < 0) {
      return { color: "blue", barColor: "bg-linear-to-r from-blue-500 to-slate-200" };
    } else {
      return { color: "slate", barColor: "bg-linear-to-r from-slate-200 to-slate-500" };
    }
  };

  const totalNewHigh = (kospiHighLow?.newHighCount ?? 0) + (kosdaqHighLow?.newHighCount ?? 0);
  const totalNewLow = (kospiHighLow?.newLowCount ?? 0) + (kosdaqHighLow?.newLowCount ?? 0);
  const netValue = totalNewHigh - totalNewLow;

  const demoData = [
    {
      title: "신고가",
      declineRate: totalNewHigh,
      description: "52주 최고가 경신",
      ...getColors(totalNewHigh),
    },
    {
      title: "신저가",
      declineRate: totalNewLow,
      description: "52주 최저가 경신",
      ...getColors(totalNewLow),
    },
    {
      title: isMobile ? "순증" : "순증 (신고가 - 신저가)",
      declineRate: netValue,
      description: "",
      ...getColors(netValue),
    },
  ];

  const GRAPH_MAX = totalNewHigh + totalNewLow;

  const getGraphWidth = (value: number) => {
    const ratio = Math.min(Math.abs(value) / GRAPH_MAX, 1);
    return ratio * 50; // 중앙에서 최대 50%까지
  };

  const netWidth = getGraphWidth(netValue);
  const netColors = getColors(netValue);
  const isPositive = netValue > 0;
  const isZero = netValue === 0;

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex justify-center items-start gap-6">
        {demoData.map((data, index) => (
          <React.Fragment key={index}>
            <div key={index} className="flex flex-col justify-start gap-1 flex-1">
              <div className="text-sm font-medium text-slate-800">{data.title}</div>
              <div className="flex flex-col">
                <b className={`text-2xl font-semibold text-${data.color}-500`}>{data.declineRate}</b>
                <p className="text-xs text-muted-foreground">{data.description}</p>
              </div>
            </div>
            {index < demoData.length - 1 && <div className="border-r h-18" />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="w-full h-8 relative overflow-hidden rounded-md bg-slate-200">
          {/* 중앙 기준선 */}
          <div className="absolute top-0 left-1/2 w-px h-full z-10" />

          {!isZero && (
            <div
              className={`absolute top-0 h-full ${netColors.barColor} flex items-center transition-all`}
              style={isPositive ? { left: "50%", width: `${netWidth}%` } : { right: "50%", width: `${netWidth}%` }}
            >
              <span className={`font-medium absolute top-1/2 -translate-y-1/2 text-sm text-white ${isPositive ? "right-2" : "left-2"}`}>{isPositive ? `+${netValue}` : netValue}</span>
            </div>
          )}
        </div>

        <div className="w-full flex gap-2 items-center justify-between">
          <span className="text-sm text-slate-700">신저가 우세</span>
          <span className="text-sm text-slate-700">0</span>
          <span className="text-sm text-slate-700">신고가 우세</span>
        </div>
      </div>
    </div>
  );
}
