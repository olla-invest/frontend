import { Suspense, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import userImg from "@/assets/images/user-info-xl.png";
import { getMyInfo } from "@/api/users";
import type { UserInfo } from "@/types/api/users";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "@/components/confirmModal";

import { MENU_LIST, type MenuItem, type MenuGroup } from "@/pages/mypage/MENU_LIST";
import { LoadingUi } from "@/components/LoadingUi";
import { MENU_COMPONENTS } from "./MENU_COMPONENTS";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const DEFAULT_TAB = "profile";

export default function Mypage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { tab } = useParams<{ tab?: string }>();
  const currentTab = tab ?? DEFAULT_TAB;
  const logout = useAuthStore((state) => state.logout);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const info = await getMyInfo();
      setUserInfo(info);
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    logout(navigate);
    toast.success("로그아웃 되었습니다", { position: "top-center" });
  };

  if (!tab) {
    return <Navigate to={`/mypage/${DEFAULT_TAB}`} replace />;
  }

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <LoadingUi />
      </div>
    );
  }

  const ActiveComponent = MENU_COMPONENTS[tab];

  return (
    <div className="flex gap-12 mx-auto h-full w-full max-w-312 pt-4 pb-14 px-6">
      {/* 좌측 - 메뉴 리스트 */}
      <div className="border rounded-md shadow-sm pt-8 pb-6 flex flex-col gap-6 w-60 shrink-0 h-fit">
        <div className="flex flex-col items-center gap-2 pb-6 border-b">
          <div className="size-24 rounded-2xl bg-gray-300 overflow-hidden">
            <img src={userImg} alt="프로필 이미지" className="size-full" />
          </div>
          <h3 className="text-xl text-foreground font-semibold">{userInfo.name}</h3>
        </div>
        <div>
          {MENU_LIST.map((group: MenuGroup) => (
            <div key={group.groupName} className="flex flex-col gap-1 px-4 pb-6 border-b not-first:pt-6">
              <h4 className="py-2 px-3 text-muted-foreground text-sm">{group.groupName}</h4>
              <ul className="flex flex-col gap-1">
                {group.menuList.map((menu: MenuItem) => {
                  const isActive = currentTab === menu.key;
                  return (
                    <li key={menu.key}>
                      <Link
                        to={`/mypage/${menu.key}`}
                        className={`block px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary hover:text-foreground ${isActive ? "bg-secondary text-foreground" : "text-slate-600"}`}
                      >
                        {menu.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex-1 flex items-center px-3">
          <button className="py-2 px-3 text-muted-foreground text-sm text-left" onClick={() => setConfirmLogout(true)}>
            로그아웃
          </button>
        </div>
      </div>

      {/* 우측 - 컨텐츠 */}
      <div className="flex-1 flex flex-col gap-4 py-2">
        <h2 className="text-xl font-semibold text-foreground">{MENU_LIST.flatMap((group) => group.menuList).find((menu) => menu.key === tab)?.name}</h2>
        {ActiveComponent ? (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full w-full">
                <LoadingUi />
              </div>
            }
          >
            <ActiveComponent />
          </Suspense>
        ) : (
          <div className="flex justify-center items-center h-full w-full">준비중 입니다.</div>
        )}
      </div>
      <ConfirmModal open={confirmLogout} onOpenChange={setConfirmLogout} title="" description="로그아웃 하면 현재 계정에서 로그아웃됩니다. " confirmText="로그아웃" onConfirm={handleLogout} />
    </div>
  );
}
