import { Progress } from "@/components/ui/progress";
import React from "react";
import type { MovingAverages } from "@/types/api/marketView";

interface MaCardData {
  title: string;
  declineRate: number;
  description: string;
  colorClass: string;
  barColor: string;
}

const buildMaCards = (label: string, ma: MovingAverages | undefined): MaCardData[] => {
  if (!ma) return [];

  const ma20Color = ma.belowMa20Status?.signalMeta?.colorClass ?? "gray";
  const ma200Color = ma.belowMa200Status?.signalMeta?.colorClass ?? "gray";

  return [
    {
      title: `${label} MA20`,
      declineRate: ma.belowMa20Ratio ?? 0,
      description: ma.belowMa20Status?.label ?? "-",
      colorClass: ma20Color,
      barColor: `bg-linear-to-r from-slate-200 to-${ma20Color}-500`,
    },
    {
      title: `${label} MA200`,
      declineRate: ma.belowMa200Ratio ?? 0,
      description: ma.belowMa200Status?.label ?? "-",
      colorClass: ma200Color,
      barColor: `bg-linear-to-r from-slate-200 to-${ma200Color}-500`,
    },
  ];
};

export default function MaDecline({ kospiMa, kosdaqMa }: { kospiMa: MovingAverages | undefined; kosdaqMa: MovingAverages | undefined }) {
  const cardData: MaCardData[] = [...buildMaCards("KOSPI", kospiMa), ...buildMaCards("KOSDAQ", kosdaqMa)];

  if (cardData.length === 0) return null;

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="md:flex md:justify-center md:items-center md:gap-6 grid grid-cols-2 gap-4">
        {cardData.map((data, index) => (
          <React.Fragment key={index}>
            <div className={`flex flex-col flex-1 gap-2 md:gap-1 border-r pr-4 md:border-r-0 md:pr-0 ${index % 2 === 1 ? "border-r-0 pr-0" : ""}`}>
              <div className="text-sm font-medium text-slate-800">{data.title}</div>
              <div className="flex flex-col">
                <b className={`text-2xl font-semibold text-${data.colorClass}-500`}>{data.declineRate.toFixed(1)}%</b>
                <p className="text-xs text-muted-foreground">{data.description}</p>
              </div>
              <Progress value={data.declineRate} className="h-1 w-full rounded-full bg-slate-200 block md:hidden" barClassName={data.barColor} />
            </div>
            {index < cardData.length - 1 && <div className="border-r h-18 hidden md:block" />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex-col gap-4 hidden md:flex">
        {cardData.map((data, index) => (
          <div key={index} className="flex gap-2 items-center">
            <span className="w-27.5 text-sm text-slate-700 shrink-0">{data.title}</span>
            <span className={`font-medium text-sm text-${data.colorClass}-500 shrink-0 w-12 text-right`}>{data.declineRate.toFixed(1)}%</span>
            <Progress value={data.declineRate} className="h-2 w-full rounded-full bg-slate-200" barClassName={data.barColor} />
          </div>
        ))}
      </div>
    </div>
  );
}
