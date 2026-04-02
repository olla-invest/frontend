import React, { useState } from "react";
import { LiveChart } from "./components/LiveChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IssueTheme } from "./components/IssueTheme";
import MyWatch from "./components/MyWatch";

import { useAuthStore } from "@/store/useAuthStore"; // 로그인 상태 (예시)
import { toast } from "sonner";

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
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [activeTab, setActiveTab] = useState("liveChart");

  const handleTabChange = (value: string) => {
    if (value === "myWatch" && !isLoggedIn) {
      toast.warning("내 관심 메뉴는 로그인 후 이용할 수 있어요.", { position: "top-center" });
      return;
    }

    setActiveTab(value);
  };

  return (
    <div className="h-[calc(100vh-120px)]">
      <div className="pt-2 pb-14 px-6 h-full overflow-hidden">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full h-full gap-0">
          <TabsList variant="line" className="justify-start border-b w-full p-0 pb-0.5 gap-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="grow-0 px-0 py-2 text-base">
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="liveChart" className="h-full pt-2">
            <LiveChart />
          </TabsContent>

          <TabsContent value="issueTheme" className="h-full pt-4">
            <IssueTheme />
          </TabsContent>

          <TabsContent value="myWatch" className="h-full">
            <MyWatch />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
