import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import UserBtnImg from "@/assets/images/user-info.png";
import { useState } from "react";
import { toast } from "sonner";

export function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="h-13 py-2 px-6">
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
          <Button>olla 플랜 업그레이드하기</Button>
          {isLoggedIn ? (
            <div className="flex gap-2 items-center">
              <button className="size-8">
                <i className="icon icon-bell" />
              </button>
              <button
                className="size-8"
                onClick={() => {
                  setShowUserMenu((prev) => !prev);
                }}
              >
                <img src={UserBtnImg} alt={user + "정보"} />
              </button>
            </div>
          ) : (
            <a href="" className="block py-2 px-4 text-slate-700 text-sm" onClick={() => navigate("/login")}>
              로그인
            </a>
          )}
        </div>
      </div>
      {showUserMenu && (
        <div className="absolute right-6 mt-2 rounded-sm bg-white shadow-xl border">
          <ul className="flex flex-col gap-2">
            <li className="flex px-3 py-2">
              <button
                className="text-sm text-slate-800 cursor-pointer"
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                  toast.success("로그아웃 되었습니다", { position: "top-center" });
                }}
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
