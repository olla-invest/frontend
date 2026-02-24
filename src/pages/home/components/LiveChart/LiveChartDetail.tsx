import { useState } from "react";
import DraggableModal from "@/components/DraggableModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailChart from "./DetailChart";
import DetailMarketStrength from "./DetailMarketStrength";

interface LiveChartDetailProps {
  onClose: () => void;
  detailInfo: string;
}

type TabItem = {
  name: string;
  value: string;
};

const tabs: TabItem[] = [
  { name: "차트·시세", value: "chart" },
  { name: "시장강도분석", value: "marketStrength" },
  { name: "종목정보", value: "stockInfo" },
  { name: "이슈분석", value: "issueAnalysis" },
];

export default function LiveChartDetail(props: LiveChartDetailProps) {
  const onClose = props.onClose;
  const [isBookmark, setIsBookmark] = useState(false);
  const volumeInfo = [
    { title: "거래량", value: "9,469,593주" },
    { title: "1일 최고/최저", value: "942,000원/910,000원" },
    { title: "거래대금", value: "2,590억원" },
    { title: "52주 최고/최저", value: "988,000원/210,000원" },
  ];
  return (
    <DraggableModal onClose={onClose}>
      <div className="py-2 px-6 flex w-full justify-between">
        <div className="flex gap-2.5">
          <div className="size-16 rounded-full bg-[#D9D9D9] overflow-hidden text-center">이미지</div>
          <div>
            <div>
              <span className="font-bold">주식명</span>
              <button onClick={() => setIsBookmark((prev) => !prev)}>
                <i className={`icon ${isBookmark ? "icon-star-fill" : "icon-star"}`} />
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-2xl font-semibold">922,000원</span>
              <div className="text-sm flex gap-1">
                <span className="text-muted-foreground">전일 대비</span>
                <span className="text-rose-500">+11,000원(1.5%)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid items-center grid-cols-[repeat(2,minmax(0,auto))] gap-y-1 gap-x-4 py-2.5">
          {volumeInfo.map((e, i) => {
            return (
              <div key={i} className="flex gap-2 text-xs">
                <span className="text-muted-foreground">{e.title}</span>
                <span>{e.value}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="py-2 px-6 h-[calc(100%-80px)]">
        <Tabs defaultValue="chart" className="h-full">
          <TabsList variant="line" className="justify-start border-b w-full p-0 pb-0.5 gap-4 mb-2">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="grow-0 px-0 py-2 text-base">
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="chart" className="h-full overflow-y-auto">
            <DetailChart />
          </TabsContent>
          <TabsContent value="marketStrength" className="h-full overflow-y-auto">
            <DetailMarketStrength />
          </TabsContent>
        </Tabs>
      </div>
    </DraggableModal>
  );
}
