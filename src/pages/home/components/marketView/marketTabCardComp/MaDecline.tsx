import { Progress } from "@/components/ui/progress";
import React from "react";

export default function MarketTabCard() {
  const demoData = [
    {
      title: "KOSPI MA20",
      declineRate: "12.4%",
      description: "단기 이탈 종목 적음",
      color: "rose",
      barColor: "bg-linear-to-r from-slate-200 to-rose-500",
    },
    {
      title: "KOSPI MA200",
      declineRate: "5.1%",
      description: "장기 이탈 종목 적음",
      color: "rose",
      barColor: "bg-linear-to-r from-slate-200 to-rose-500",
    },
    {
      title: "KOSDAQ MA20",
      declineRate: "75.8%",
      description: "단기 이탈 종목 많음",
      color: "blue",
      barColor: "bg-linear-to-r from-slate-200 to-blue-500",
    },
    {
      title: "KOSDAQ MA200",
      declineRate: "21.1%",
      description: "장기 이탈 종목 많음",
      color: "gray",
      barColor: "bg-linear-to-r from-slate-200 to-gray-500",
    },
  ];
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="md:flex md:justify-center md:items-center md:gap-6 grid grid-cols-2 gap-4">
        {demoData.map((data, index) => (
          <React.Fragment key={index}>
            <div className={`flex flex-col flex-1 gap-2 md:gap-1 border-r pr-4 md:border-r-0 md:pr-0 ${index % 2 === 1 ? "border-r-0 pr-0" : ""}`}>
              <div className="text-sm font-medium text-slate-800">{data.title}</div>
              <div className="flex flex-col">
                <b className={`text-2xl font-semibold text-${data.color}-500`}>{data.declineRate}</b>
                <p className="text-xs text-muted-foreground">{data.description}</p>
              </div>
              <Progress value={parseFloat(data.declineRate)} className="h-1 w-full rounded-full bg-slate-200 block md:hidden" barClassName={data.barColor} />
            </div>
            {index < demoData.length - 1 && <div className="border-r h-18 hidden md:block" />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex-col gap-4 hidden md:flex">
        {demoData.map((data, index) => (
          <div key={index} className="flex gap-2 items-center">
            <span className="w-27.5 text-sm text-slate-700 shrink-0">{data.title}</span>
            <span className={`font-medium text-sm text-${data.color}-500 shrink-0 w-12 text-right`}>{data.declineRate}</span>
            <Progress value={parseFloat(data.declineRate)} className="h-2 w-full rounded-full bg-slate-200" barClassName={data.barColor} />
          </div>
        ))}
      </div>
    </div>
  );
}
