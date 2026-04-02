import { useState, useEffect, useMemo } from "react";
import DraggableModal from "@/components/DraggableModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailChart from "./DetailChart";
import DetailMarketStrength from "./DetailMarketStrength";
import DetailStockInfo from "./DetailStockInfo";
import DetailIssue from "./DetailIssueAnalysis";
import { getStockBasicData } from "@/api/chartDetails";
import type { StockBasicDataResponse } from "@/types/api/chartDetails";
import { isInWatchList, toggleWatchStockList } from "@/hooks/useToggleWatchList";
import { useWatchStockListStore } from "@/store/WatchListStore";

interface LiveChartDetailProps {
  onClose: () => void;
  detailInfo: {
    id: string;
    companyName: string;
    investmentIndicators: string;
    currentPrice: number;
  };
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
  const { stockList } = useWatchStockListStore();
  const onClose = props.onClose;
  const detailInfo = props.detailInfo;
  const [isBookmark, setIsBookmark] = useState(isInWatchList(stockList ?? [], detailInfo.id));

  const [basicData, setBasicData] = useState<StockBasicDataResponse | null>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getStockBasicData(detailInfo.id);
        setBasicData(data);
      } catch (err) {
        console.log("기본 정보 조회 오류", err);
      }
    };

    fetch();
  }, [props.detailInfo]);

  const getCompareInfo = (investmentIndicators?: string, currentPrice?: number) => {
    if (!investmentIndicators || !currentPrice) return null;

    const sign = investmentIndicators[0]; // + or -
    const rate = parseFloat(investmentIndicators.replace("%", "")) / 100;

    const prevPrice = currentPrice / (1 + rate);
    const diff = Math.round(currentPrice - prevPrice);

    const formattedPrice = Math.abs(diff).toLocaleString();

    return {
      sign,
      diffText: `${sign}${formattedPrice}원`,
      rateText: investmentIndicators,
      color: sign === "+" ? "text-rose-500" : "text-blue-500",
    };
  };

  const compareInfo = getCompareInfo(detailInfo.investmentIndicators, basicData?.currentPrice);

  const volumeInfo = useMemo(() => {
    if (!basicData) return [];

    return [
      { title: "거래량", value: `${Number(basicData.volume).toLocaleString()}주` },
      {
        title: "1일 최고/최저",
        value: `${basicData.dayHigh.toLocaleString()}원/${basicData.dayLow.toLocaleString()}원`,
      },
      {
        title: "거래대금",
        value: `${(Number(basicData.tradingValue) / 100).toLocaleString()}억원`,
      },
      {
        title: "52주 최고/최저",
        value: `${basicData.week52High.toLocaleString()}원/${basicData.week52Low.toLocaleString()}원`,
      },
    ];
  }, [basicData]);

  return (
    <DraggableModal onClose={onClose}>
      <div className="py-2 px-6 flex w-full justify-between">
        <div className="flex gap-2.5">
          <div className="size-16 rounded-full bg-[#D9D9D9] overflow-hidden text-center">이미지</div>
          <div>
            <div>
              <span className="font-bold">{detailInfo.companyName}</span>
              <button
                onClick={async () => {
                  const success = await toggleWatchStockList(detailInfo.id);

                  if (success) {
                    setIsBookmark((prev) => !prev);
                  }
                }}
              >
                <i className={`icon ${isBookmark ? "icon-star-fill" : "icon-star"}`} />
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-2xl font-semibold">{detailInfo.currentPrice.toLocaleString()}원</span>
              {compareInfo && (
                <div className="text-sm flex gap-1">
                  <span className="text-muted-foreground">전일 대비</span>
                  <span className={compareInfo.color}>
                    {compareInfo.diffText}({compareInfo.rateText})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid items-center grid-cols-[repeat(2,minmax(0,auto))] gap-y-1 gap-x-4 py-2.5">
          {volumeInfo.map((e, i) => {
            return (
              <div key={i} className="flex gap-2 text-xs">
                <span className={`text-muted-foreground shrink-0 ${i % 2 !== 0 ? "w-18.5" : "w-10.5"}`}>{e.title}</span>
                <span>{e.value}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* 컨텐츠 영역만 스크롤 하고싶을때  h-[calc(100%-80px)]추가*/}
      <div className="py-2">
        <Tabs defaultValue="chart" className="h-full">
          <TabsList variant="line" className="justify-start border-b w-[calc(100%-48px)] p-0 pb-0.5 gap-4 mb-2 mx-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="grow-0 px-0 py-2 text-base">
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="chart" className="h-full overflow-y-auto px-6">
            <DetailChart stockCode={detailInfo.id} />
          </TabsContent>
          <TabsContent value="marketStrength" className="h-full overflow-y-auto px-6">
            <DetailMarketStrength stockCode={detailInfo.id} />
          </TabsContent>
          <TabsContent value="stockInfo" className="h-full overflow-y-auto px-6">
            <DetailStockInfo stockCode={detailInfo.id} />
          </TabsContent>
          <TabsContent value="issueAnalysis" className="h-full overflow-y-auto">
            <DetailIssue />
          </TabsContent>
        </Tabs>
      </div>
    </DraggableModal>
  );
}
