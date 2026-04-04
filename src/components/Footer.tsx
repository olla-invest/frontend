import { useNavigate } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="absolute bottom-0 left-0 h-17 p-6 border-t w-full">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex gap-2 items-center cursor-pointer transition-all">
          <a
            onClick={() => {
              navigate("/policies/terms");
            }}
            className="hover:font-semibold"
          >
            서비스 이용약관
          </a>
          <div className="w-px h-3 bg-slate-300" />
          <a
            onClick={() => {
              navigate("/policies/privacy");
            }}
            className="hover:font-semibold"
          >
            개인정보 처리방침
          </a>
          <div className="w-px h-3 bg-slate-300" />
          <a className="hover:font-semibold">투자주의사항</a>
        </div>
        <span>ⓒ2026 olla invest Co., Ltd All Rights Reserved.</span>
      </div>
    </footer>
  );
}
