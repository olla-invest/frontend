import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export function Header() {
  const navigate = useNavigate();
  return (
    <header className="h-13 py-2 px-6">
      <div className="flex justify-between h-full items-center">
        <h1 className="logo">
          <span className="sr-only">olla</span>
        </h1>
        <div className="flex gap-2 items-center">
          <Button>olla 플랜 업그레이드하기</Button>
          <a href="" className="block py-2 px-4 text-slate-700 text-sm" onClick={() => navigate("/login")}>
            로그인
          </a>
        </div>
      </div>
    </header>
  );
}
