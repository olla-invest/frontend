import React from "react";
import { LiveChart } from "./components/LiveChart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

//import { realTimeChart } from "@/api/chartData";

const Home: React.FC = () => {
  // useEffect(() => {
  //   realTimeChart()
  //     .then((res) => {
  //       console.log(res.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);

  return (
    <div className="h-[calc(100vh-120px)]">
      <div className="pt-2 pb-14 px-6">
        <Tabs defaultValue="liveChart">
          <TabsList variant="line" className="w-full justify-start border-b">
            <TabsTrigger value="liveChart" className="bg-white! w-fit">
              실시간 차트
            </TabsTrigger>
            <TabsTrigger value="issueTheme" className="bg-white!">
              🔥 이슈 테마
            </TabsTrigger>
            <TabsTrigger value="MyWatch" className="bg-white!">
              내 관심
            </TabsTrigger>
          </TabsList>
          <TabsContent value="liveChart">
            <LiveChart />
          </TabsContent>
          <TabsContent value="issueTheme">
            <p>🔥 이슈 테마: 준비중 입니다</p>
          </TabsContent>
          <TabsContent value="MyWatch">
            <p>내 관심: 준비중 입니다</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
