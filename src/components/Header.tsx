import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import UserBtnImg from "@/assets/images/user-info.png";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "./confirmModal";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const [confirmLogout, setConfirmLogout] = useState(false);
  const handleLogout = () => {
    logout(navigate);
    setShowUserMenu(false);
    toast.success("로그아웃 되었습니다", { position: "top-center" });
  };

  const isMobile = useIsMobile();

  return (
    <header className="h-13 w-full py-2 px-6 sticky top-0 left-0 right-0 z-10 bg-white">
      <div className="flex justify-between h-full items-center">
        <h1
          className="logo"
          onClick={() => {
            navigate("/home");
          }}
        >
          <span className="sr-only">olla</span>
        </h1>
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => {
              navigate("/plan");
            }}
            className="hidden md:block"
          >
            olla 플랜 업그레이드하기
          </Button>
          {isLoggedIn ? (
            <div className="flex gap-2 items-center">
              <button
                className="size-8"
                onClick={() => {
                  setShowUserMenu((prev) => !prev);
                }}
              >
                <img src={UserBtnImg} alt={userInfo + "정보"} />
              </button>
            </div>
          ) : (
            <a href="" className="block py-2 px-4 text-slate-700 text-sm" onClick={() => navigate("/login")}>
              로그인
            </a>
          )}
        </div>
      </div>
      {showUserMenu && userInfo && (
        <div className="w-56 absolute right-6 mt-1 rounded-sm bg-white shadow-md border z-20">
          <div className="p-1">
            <div className="flex py-1.5 px-2 gap-2">
              <img src={UserBtnImg} alt={userInfo.name + "정보"} className="size-8" />
              <div className="flex flex-col ">
                <span className="text-sm text-popover-foreground font-semibold">{userInfo.name}</span>
                <span className="text-xs text-muted-foreground">{userInfo.username}</span>
              </div>
            </div>
          </div>
          <ul className="flex flex-col gap-2 p-1 text-sm text-popover-foreground font-normal border-t">
            {!isMobile && (
              <>
                <li>
                  <button
                    className="w-full px-2 py-1.5 cursor-pointer text-left"
                    onClick={() => {
                      toast.success("준비중 입니다", { position: "top-center" });
                    }}
                  >
                    플랜 업그레이드 하기
                  </button>
                </li>
                <li>
                  <button
                    className="w-full px-2 py-1.5 cursor-pointer text-left"
                    onClick={() => {
                      toast.success("준비중 입니다", { position: "top-center" });
                    }}
                  >
                    설정
                  </button>
                </li>
              </>
            )}
            <li>
              <button
                className="w-full px-2 py-1.5 cursor-pointer text-left"
                onClick={() => {
                  setConfirmLogout(true);
                }}
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      )}
      <ConfirmModal open={confirmLogout} onOpenChange={setConfirmLogout} title="" description="로그아웃 하면 현재 계정에서 로그아웃됩니다. " confirmText="로그아웃" onConfirm={handleLogout} />
    </header>
  );
}
