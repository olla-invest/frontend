import { useState, useEffect } from "react";

import { getMyInfo } from "@/api/users";
import type { UserInfo } from "@/types/api/users";
import { Button } from "@/components/ui/button";
import ChangeProfileModal from "./ChangeProfileModal";

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [changeProfileModalOpen, setChangeProfileModalOpen] = useState(false);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const info = await getMyInfo();
      setUserInfo(info);
    };
    fetchUserInfo();
  }, []);

  const userInfoForm = [
    { lable: "이름", key: userInfo?.name },
    { lable: "휴대폰 번호", key: userInfo?.phone },
    { lable: "이메일", key: userInfo?.email },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 py-6 border-y">
        {userInfoForm.map((e, i) => {
          return (
            <div className="flex items-center justify-between text-sm" key={i}>
              <span className="w-30 shrink-0 text-muted-foreground font-medium ">{e.lable}</span>
              <span className="text-slate-800 font-semibold">{e.key}</span>
            </div>
          );
        })}
      </div>
      <Button size="sm" className="ml-auto" variant="outline" onClick={() => setChangeProfileModalOpen(true)}>
        프로필 수정
      </Button>
      {changeProfileModalOpen && <ChangeProfileModal open={changeProfileModalOpen} onClose={() => setChangeProfileModalOpen(false)} user={userInfo!} />}
    </div>
  );
}
