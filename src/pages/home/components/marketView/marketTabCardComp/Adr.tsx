import { Progress } from "@/components/ui/progress";
import React from "react";

export default function Adr() {
  const demoData = [
    {
      title: "KOSPI ADR",
      declineRate: "6.70",
      description: "상승 종목 우세",
      color: "rose",
      barColor: "bg-linear-to-r from-slate-200 to-rose-500",
    },
    {
      title: "KOSDAQ ADR",
      declineRate: "0.67",
      description: "하락 종목 우세",
      color: "blue",
      barColor: "bg-linear-to-r from-slate-200 to-blue-500",
    },
  ];
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex justify-center items-center gap-6">
        {demoData.map((data, index) => (
          <React.Fragment key={index}>
            <div key={index} className="flex flex-col gap-1 flex-1">
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
      <div className="flex flex-col gap-4">
        {demoData.map((data, index) => (
          <div key={index} className="flex gap-2 items-center">
            <span className="w-27.5 text-sm text-slate-700 shrink-0">{data.title}</span>
            <span className={`font-medium text-sm text-${data.color}-500 shrink-0 w-12 text-right`}>{data.declineRate}</span>
            <Progress value={parseFloat(data.declineRate)} max={10} className="h-2 w-full rounded-full bg-slate-200" barClassName={data.barColor} />
          </div>
        ))}
      </div>
    </div>
  );
}
