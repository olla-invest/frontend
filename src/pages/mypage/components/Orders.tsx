import { useEffect, useState } from "react";
import { getMyPlan } from "@/api/plan";
import { LoadingUi } from "@/components/LoadingUi";
import type { MyPlan } from "@/types/api/plan";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();
  const [myPlan, setMyPlan] = useState<MyPlan | null>(null);
  useEffect(() => {
    const fetchMyPlan = async () => {
      const info = await getMyPlan();
      setMyPlan(info);
    };
    fetchMyPlan();
  }, []);

  if (!myPlan) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <LoadingUi />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-50 rounded-md p-4 flex gap-2 justify-between items-center">
        <div className="flex flex-col gap-2">
          <p>
            현재 이용중인 플랜: <b>{myPlan.planType}</b>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              navigate("/plan");
            }}
          >
            플랜 변경하기
          </Button>
        </div>
      </div>
    </div>
  );
}
