import React from "react";
import { LiveChart } from "./components/LiveChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IssueTheme } from "./components/IssueTheme";

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
  return (
    <div className="h-[calc(100vh-120px)]">
      <div className="pt-2 pb-14 px-6 h-full overflow-hidden">
        <Tabs defaultValue="liveChart" className="w-full h-full overflow-hidden">
          <TabsList variant="line" className="justify-start border-b w-full p-0 pb-0.5 gap-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="grow-0 px-0 py-2 text-base">
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="liveChart" className="h-full">
            <LiveChart />
          </TabsContent>

          <TabsContent value="issueTheme" className="h-full">
            <IssueTheme />
          </TabsContent>

          <TabsContent value="myWatch" className="h-full">
            <p>내 관심: 준비중 입니다</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
