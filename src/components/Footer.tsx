interface FooterProps {
  isHideBottomMenu?: boolean;
}

export function Footer({ isHideBottomMenu = false }: FooterProps) {
  const baseURL = window.location.origin;
  return (
    <footer className="absolute bottom-0 left-0 md:h-17 md:p-6 pt-12 pb-16 border-t w-full">
      <div className="flex items-center justify-between text-sm text-muted-foreground flex-col gap-4 md:flex-row">
        {!isHideBottomMenu && (
          <div className="flex gap-2 items-center cursor-pointer transition-all">
            <a
              onClick={() => {
                window.open(`${baseURL}/policies/terms`);
                // navigate("/policies/terms");
              }}
              className="hover:font-semibold"
            >
              서비스 이용약관
            </a>
            <div className="w-px h-3 bg-slate-300" />
            <a
              onClick={() => {
                window.open(`${baseURL}/policies/privacy`);
                // navigate("/policies/privacy");
              }}
              className="hover:font-semibold"
            >
              개인정보 처리방침
            </a>
            <div className="w-px h-3 bg-slate-300" />
            <a
              onClick={() => {
                window.open(`${baseURL}/policies/investmentNotice`);
              }}
              className="hover:font-semibold"
            >
              투자주의사항
            </a>
          </div>
        )}
        <span className="md:ml-auto">ⓒ2026 olla invest Co., Ltd All Rights Reserved.</span>
      </div>
    </footer>
  );
}
