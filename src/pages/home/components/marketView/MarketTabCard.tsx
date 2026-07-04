import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaDecline from "./marketTabCardComp/MaDecline";
import Highlight from "./marketTabCardComp/HighLow";
import Adr from "./marketTabCardComp/Adr";

export default function MarketTabCard() {
  const [activeTab, setActiveTab] = useState("maDecline");
  const tabInfo = {
    maDecline: {
      title: "MA하락률",
      description: "주가가 이동평균선 아래로 내려간 종목이 전체의 몇 % 인지 알 수 있어요.",
    },
    highLow: {
      title: "신고가, 신저가",
      description: "오늘 52주 최고가 · 최저가를 새로 쓴 종목이 각각 몇개인지 알 수 있어요.",
    },
    adr: {
      title: "ADR",
      description: "오늘 오른 종목 수와 내린  종목 수의 비율을 알 수 있어요. ",
    },
  };
  return (
    <Tabs defaultValue="maDecline" value={activeTab} onValueChange={setActiveTab}>
      <div className="flex md:items-center md:flex-row gap-4 mb-2 flex-col items-start">
        <TabsList className="w-full md:w-fit">
          <TabsTrigger value="maDecline">MA하락률</TabsTrigger>
          <TabsTrigger value="highLow">신고가, 신저가</TabsTrigger>
          <TabsTrigger value="adr">ADR</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-1 text-muted-foreground">
          <i className="icon icon-info-gray" />
          <span className="text-sm font-medium">{tabInfo[activeTab as keyof typeof tabInfo]?.description}</span>
        </div>
      </div>

      <TabsContent value="maDecline">
        <MaDecline />
      </TabsContent>
      <TabsContent value="highLow">
        <Highlight />
      </TabsContent>
      <TabsContent value="adr">
        <Adr />
      </TabsContent>
    </Tabs>
  );
}
