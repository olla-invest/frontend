import { Progress } from "@/components/ui/progress";
import React from "react";

import type { MarketBreadth } from "@/types/api/marketView";

interface AdrCardData {
  title: string;
  adrValue: number;
  description: string;
  colorClass: string;
  barColor: string;
}

const buildAdrCard = (title: string, breadth: MarketBreadth | undefined): AdrCardData | null => {
  if (!breadth) return null;

  const colorClass = breadth.adrStatus?.signalMeta?.colorClass ?? "gray";

  return {
    title,
    adrValue: breadth.adr ?? 0,
    description: breadth.adrStatus?.label ?? "-",
    colorClass,
    barColor: `bg-linear-to-r from-slate-200 to-${colorClass}-500`,
  };
};

export default function Adr({ kospiAdr, kosdaqAdr }: { kospiAdr: MarketBreadth | undefined; kosdaqAdr: MarketBreadth | undefined }) {
  const cardData: AdrCardData[] = [buildAdrCard("KOSPI ADR", kospiAdr), buildAdrCard("KOSDAQ ADR", kosdaqAdr)].filter((d): d is AdrCardData => d !== null);

  if (cardData.length === 0) return null;

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex justify-center items-center gap-6">
        {cardData.map((data, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col gap-1 flex-1">
              <div className="text-sm font-medium text-slate-800">{data.title}</div>
              <div className="flex flex-col">
                <b className={`text-2xl font-semibold text-${data.colorClass}-500`}>{data.adrValue.toFixed(2)}</b>
                <p className="text-xs text-muted-foreground">{data.description}</p>
              </div>
              <Progress value={data.adrValue} max={10} className="h-1 w-full rounded-full bg-slate-200 block md:hidden" barClassName={data.barColor} />
            </div>
            {index < cardData.length - 1 && <div className="border-r h-20" />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex-col gap-4 hidden md:flex">
        {cardData.map((data, index) => (
          <div key={index} className="flex gap-2 items-center">
            <span className="w-27.5 text-sm text-slate-700 shrink-0">{data.title}</span>
            <span className={`font-medium text-sm text-${data.colorClass}-500 shrink-0 w-12 text-right`}>{data.adrValue.toFixed(2)}</span>
            <Progress value={data.adrValue} max={10} className="h-2 w-full rounded-full bg-slate-200" barClassName={data.barColor} />
          </div>
        ))}
      </div>
    </div>
  );
}
