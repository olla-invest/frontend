import { useState, useEffect } from "react";

import { getMyInfo, patchMarketing } from "@/api/users";

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Marketing() {
  const [marketingYn, setMarketingYn] = useState(false);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const info = await getMyInfo();
      setMarketingYn(info.marketingConsent);
    };
    fetchUserInfo();
  }, []);

  const handleMarketing = async (yn: boolean) => {
    try {
      await patchMarketing({
        consent: !yn,
      });
      setMarketingYn(!yn);
      toast.success("마케팅 수신 설정이 변경 되었습니다", { position: "top-center" });
    } catch (err) {
      console.error(err);
      toast.error("마케팅 수신 설정이 변경 되었습니다", { position: "top-center" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 py-6 border-y">
          <div className="flex items-start justify-between text-sm gap-1">
            <div className="flex flex-col">
              <p className="text-foreground font-medium">olla의 새로운 기능, 업데이트 및 혜택 정보를 받아보시려면 동의해주세요.</p>
              <p className="text-xs text-muted-foreground">초기 설정은 가입 시 동의한 마케팅 정보 수신 기준으로 적용되며, 언제든지 변경할 수 있습니다.</p>
            </div>
            <Switch
              checked={marketingYn}
              onCheckedChange={() => {
                if (marketingYn === undefined) return;
                handleMarketing(marketingYn);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
