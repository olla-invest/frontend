import React from "react";

export default function HighLow() {
  const demoData = [
    {
      title: "신고가",
      declineRate: "+47",
      description: "52주 최고가 경신",
      color: "rose",
      barColor: "bg-linear-to-r from-slate-200 to-rose-500",
    },
    {
      title: "신저가",
      declineRate: "-12",
      description: "52주 최저가 경신",
      color: "blue",
      barColor: "bg-linear-to-r from-slate-200 to-blue-500",
    },
    {
      title: "순증 (신고가 - 신저가)",
      declineRate: "+35",
      description: "",
      color: "rose",
      barColor: "bg-linear-to-r from-slate-200 to-rose-500",
    },
  ];

  const getGraphWidth = (value: number) => {
    return value > 0 ? value / 3 : 0;
  };
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
          <div className={`relative top-0 left-[50%] transform h-full ${demoData[2].barColor}`} style={{ width: `${getGraphWidth(35)}%` }}>
            <span className="absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2 text-sm text-white">+35</span>
          </div>
        </div>
        <div className="w-full flex gap-2 items-center justify-between">
          <span className="text-sm text-slate-700">신저가 우세</span>
          <span className="text-sm text-slate-700">0</span>
          <span className="text-sm text-slate-700">신저가 우세</span>
        </div>
      </div>
    </div>
  );
}
