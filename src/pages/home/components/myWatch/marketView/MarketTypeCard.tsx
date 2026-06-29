import LineAreaChart from "./LineAreaChart";
import MarketTypeCardDetail from "./MarketTypeCardDetail";

export default function MarketTypeCard() {
  const demodata = {
    marketName: "코스피 안정적으로 상승중",
    status: "buy",
    statusDetail: "흐름이 양호해요.",
  };
  const demodata2 = {
    marketName: "코스닥 반등 시도 중",
    status: "neutral",
    statusDetail: "매도 신호 7개 누적 · 반등 4일차 이후 상승 확인 전까지 신규 매수 보류 필요해요.",
  };
  return (
    <section className="pt-8 border-t">
      <h3 className="sr-only">시장별 카드</h3>
      <div className="flex gap-6">
        {/* 그래프 영역 */}
        <div className="pr-6 border-r shrink-0 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xl text-slate-800">코스피</span>
              <div className="flex items-center gap-1">
                <span className="font-medium text-xl text-slate-800">8,788.38</span>
                <p className="font-medium text-xs text-rose-500">
                  <i className="icon icon-arrow-up" />
                  452.55(+4.56%)
                </p>
              </div>
            </div>
            <LineAreaChart colorType="red" />
            <div className="flex items-center gap-4 text-xs ">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">외인</span>
                <span className="text-blue-500 font-medium">-14,610억</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">기관</span>
                <span className="text-blue-500 font-medium">-10,610억</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">개인</span>
                <span className="text-rose-500 font-medium">+28,680억</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xl text-slate-800">코스닥</span>
              <div className="flex items-center gap-1">
                <span className="font-medium text-xl text-slate-800">1,188.38</span>
                <p className="font-medium text-xs text-blue-500">
                  <i className="icon icon-arrow-down" />
                  452.55(-1.56%)
                </p>
              </div>
            </div>
            <LineAreaChart colorType="blue" />
            <div className="flex items-center gap-4 text-xs ">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">외인</span>
                <span className="text-blue-500 font-medium">-14,610억</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">기관</span>
                <span className="text-blue-500 font-medium">-10,610억</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">개인</span>
                <span className="text-rose-500 font-medium">+28,680억</span>
              </div>
            </div>
          </div>
        </div>

        {/* 정보 영역 */}
        <div className="flex flex-col gap-6 flex-1">
          <MarketTypeCardDetail info={demodata} />
          <MarketTypeCardDetail info={demodata2} />
        </div>
      </div>
    </section>
  );
}
