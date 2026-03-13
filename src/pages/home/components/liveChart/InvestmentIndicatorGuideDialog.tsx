import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
export default function InvestmentIndicatorGuide() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>투자주요지표 안내</DialogTitle>
        <DialogDescription>각 투자 주요지표의 의미와 표시 기준을 안내합니다.</DialogDescription>
      </DialogHeader>
      <div className="text-sm">
        <div className="flex min-h-10 text-muted-foreground border-b">
          <div className="w-30 p-2 shrink-0">
            <span>지표</span>
          </div>
          <div className="w-full p-2">
            <span>지표</span>
          </div>
        </div>
        <div className="flex min-h-10 border-b">
          <div className="w-30 p-2 shrink-0">
            <span>변동성 축소</span>
          </div>
          <div className="w-full p-2">
            <span>최근 10일간 ATR 지수가 하락 추세인 경우 해당 지표 표시 </span>
          </div>
        </div>
        <div className="flex min-h-10 border-b">
          <div className="w-30 p-2 shrink-0">
            <span>가격 압축</span>
          </div>
          <div className="w-full p-2">
            <span>최근 10일 동안 일봉의 고점과 저점 간 차이가 가장 작은 구간일 경우 표시 </span>
          </div>
        </div>
        <div className="flex min-h-10 items-center">
          <div className="w-30 p-2 shrink-0">
            <span>트렌드 템플릿</span>
          </div>
          <div className="w-full p-2 pr-1">
            <span>단·중·장기 이동평균성 정렬, 장기 추세 상승, 시장 대비 강도 기준을 모두 충족한 경우 표시 </span>
            <ol>
              <li>1&#41; 최근 3년 평균 EPS 증가률 ≥ 15%</li>
              <li>2&#41; 최근 분기 EPS의 전년 동기 대비(YoY) 증감률≥ 15%</li>
              <li>3&#41; 최근 3년 평균 ROE ≥ 15%</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
