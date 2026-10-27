import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import ChangePwModal from "@/pages/mypage/components/ChangePwModal";

export default function Account() {
  const { userInfo } = useAuthStore();
  const [isChangePwOpen, setIsChangePwOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 py-6 border-y">
          <div className="flex items-center justify-between text-sm">
            <span className="w-30 shrink-0 text-muted-foreground font-medium ">ID</span>
            <span className="text-slate-800 font-semibold">{userInfo?.username}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="w-30 shrink-0 text-muted-foreground font-medium ">비밀번호</span>
            <button className="text-primary hover:text-blue-700 font-semibold" onClick={() => setIsChangePwOpen(true)}>
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>
      {isChangePwOpen && <ChangePwModal open={isChangePwOpen} onClose={() => setIsChangePwOpen(false)} />}
    </div>
  );
}
