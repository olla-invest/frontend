import GaugeChart from "./GaugeChart";

export default function MarketSummary() {
  return (
    <section>
      <h3 className="sr-only">요약</h3>
      <div className="w-fit px-2 rounded-full bg-muted ml-auto hidden md:block">
        <span className="text-xs text-muted-foreground">2026-05-21 기준 · 매일 오후 4:30 자동 업데이트</span>
      </div>
      <div className="flex md:gap-6 py-1 px-2 md:flex-row flex-col items-center gap-4 justify-center">
        <div className="flex flex-col gap-2 items-center text-center md:items-start md:text-left">
          <span className="text-slate-800 text-3xl font-semibold">큰 흐름은 살아있어요.</span>
          <span className="text-primary text-3xl font-semibold">지금 당장은 기다리세요.</span>
          <p className="text-gray-700 font-medium text-center md:text-left">
            코스닥에서 기관 매도 신호가 빠르게 쌓이고 있어요.
            <br />
            코스피는 안정적이지만 코스닥 신규 매수는 상승 확인 후로 미루세요.{" "}
          </p>
        </div>
        {/* gauge chart 영역 */}
        <div className="text-center md:text-left">
          {/* signal   "sell" | "neutral" | "buy"  */}
          <GaugeChart label="단기" signal="sell" />
          <GaugeChart label="장기" signal="buy" />
        </div>
      </div>
    </section>
  );
}
