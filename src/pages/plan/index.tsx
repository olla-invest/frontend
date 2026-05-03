import PlanCard, { type PlanCardProps } from "./components/PlanCard";

const PlanChange: React.FC = () => {
  const demoPlan: PlanCardProps[] = [
    {
      planName: "Basic",
      isRecomend: false,
      description: "olla의 기본 분석 기준으로 데이터를 쉽고 빠르게",
      cost: "NN,NNN",
      discountInfo: "NN,NNN원/월",
      costInfo: "NN개월 동안, 이후 NN,NNN원 /월 으로 결제",
      actionType: "upgrade",
      include: ["olla 기본 분석 기준 적용", "종목 및 테마 데이터 확인", "시장대비강도 점수 / 등락률 / 거래대금 등 주요 지표 데이터 확인", "관심 종목·테마 데이터 변화 알림 제공"],
      notIncluded: ["데이터 필터 조건 직접 설정 불가", "조건 저장 기능 미지원", "일부 확장 데이터 확인 불가"],
    },
    {
      planName: "Pro",
      isRecomend: true,
      description: "olla의 기본 분석 기준을 넘어, 직접 설정한 조건으로 체계적으로 관리",
      cost: "NN,NNN",
      actionType: "upgrade",
      include: ["데이터 필터 조건 직접 설정 가능", "확장 데이터 무제한 확인 가능", "RS기간 및 세부 조건 설정 가능", "관심 종목·테마 기준 정렬 가능", "AI 데이터 분석 기능 및 인사이트 제공"],
      notIncluded: ["전략별 데이터 AI 비교 분석", "전략 성과 추적 기능", "고급 지표 제공"],
    },
    {
      planName: "Premium",
      isRecomend: false,
      description: "설정한 조건을 관리하고, 심화 분석과 AI 비교기능까지",
      cost: "NN,NNN",
      actionType: "upgrade",
      include: [
        "데이터 필터 조건 직접 설정 가능",
        "확장 데이터 무제한 확인 가능",
        "RS기간 및 세부 조건 설정 가능",
        "AI 데이터 분석 기능 및 인사이트 제공",
        "전략별 데이터 AI 비교 분석",
        "전략 성과 추적 가능",
        "고급 지표 제공",
        "전략 히스토리 관리",
      ],
    },
  ];
  return (
    <div className="py-2 px-6 w-full h-[calc(100vh-120px)] overflow-y-auto">
      <div className="mx-auto max-w-312 py-2">
        <div className="flex flex-col gap-4">
          {/* 제목 영역 */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-foreground text-xl font-semibold">olla 플랜 업그레이드</h3>
            <div className="flex gap-2.5 items-center">
              <p className="flex-1 text-muted-foreground text-sm">
                olla만의 데이터 분석 기준으로 데이터를 쉽고 빠르게 확인할 수 있는 Basic부터,
                <br />
                직접 조건을 설정하고 더 많은 데이터를 확인 할 수 있는 Pro와 Premium까지!
              </p>
              <div className="rounded-md bg-slate-50 p-4 flex gap-1 text-sm">
                <span className="text-slate-700">현재 이용중인 플랜:</span>
                <b className="text-foreground font-semibold">free</b>
              </div>
            </div>
          </div>

          {/* 컨텐츠 영역 */}
          <div className="grid grid-cols-3 gap-4">
            {demoPlan.map((plan, i) => (
              <PlanCard key={i} {...plan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanChange;
