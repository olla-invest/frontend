import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LiveChart } from "./components/LiveChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IssueTheme } from "./components/IssueTheme";
import MyWatch from "./components/MyWatch";

import { useAuthStore } from "@/store/useAuthStore";
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

const MOBILE_WIDTH = 768;

const Home: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [searchParams, setSearchParams] = useSearchParams();
  // URL에서 탭 읽기, 없으면 기본값
  const activeTab = searchParams.get("tab") ?? "liveChart";

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < MOBILE_WIDTH;

      // 모바일에서 myWatch 탭 제거
      if (isMobile && activeTab === "myWatch") {
        setSearchParams({ tab: "liveChart" });
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    if (value === "myWatch" && !isLoggedIn) {
      toast.warning("내 관심 메뉴는 로그인 후 이용할 수 있어요.", {
        position: "top-center",
      });

      return;
    }

    setSearchParams({ tab: value });
  };

  return (
    <div className="md:h-[calc(100vh-120px)]">
      <div className="pt-2 pb-14 px-4 md:px-6 h-full overflow-hidden">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full h-full gap-0">
          <TabsList variant="line" className="justify-start border-b w-full p-0 pb-0.5 gap-4">
            {tabs.map((tab) => {
              const isMyWatch = tab.value === "myWatch";

              return (
                <TabsTrigger key={tab.value} value={tab.value} className={`grow-0 px-0 py-2 text-base ${isMyWatch ? "hidden md:flex" : ""}`}>
                  {tab.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="liveChart" className="h-full pt-2">
            <LiveChart />
          </TabsContent>

          <TabsContent value="issueTheme" className="h-full pt-4">
            <IssueTheme />
          </TabsContent>

          <TabsContent value="myWatch" className="hidden h-full pt-4 md:block">
            <MyWatch />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
