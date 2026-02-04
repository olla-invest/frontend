import React, { useEffect, useState } from "react";
import { LiveChart } from "./components/LiveChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { getRealTimeChart } from "@/api/stocks";
import type { StockRankingApiResponse } from "@/types/api/stocks";

type TabItem = {
  name: string;
  value: string;
};

const tabs: TabItem[] = [
  { name: "실시간 차트", value: "liveChart" },
  { name: "🔥 이슈 테마", value: "issueTheme" },
  { name: "내 관심", value: "myWatch" },
];

const Home: React.FC = () => {
  const [stockTableData, setStockTableData] = useState<StockRankingApiResponse | null>(null);

  useEffect(() => {
    getRealTimeChart()
      .then((res) => setStockTableData(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="h-[calc(100vh-120px)]">
      <div className="pt-2 pb-14 px-6 h-full overflow-hidden">
        <Tabs defaultValue="liveChart" className="h-full overflow-hidden">
          <TabsList variant="line" className="w-full justify-start border-b">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="liveChart" className="h-full">
            <LiveChart tableData={stockTableData} />
          </TabsContent>

          <TabsContent value="issueTheme">
            <p>🔥 이슈 테마: 준비중 입니다</p>
          </TabsContent>

          <TabsContent value="myWatch">
            <p>내 관심: 준비중 입니다</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
