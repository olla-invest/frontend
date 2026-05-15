import { Button } from "@/components/ui/button";
export interface PlanCardProps {
  setModal?: React.Dispatch<React.SetStateAction<string>>;
  planName: string; //플랜이름
  isRecomend: boolean; //추천 여부
  description: string; //플랜 설명
  cost: string; //가격
  discountInfo?: string; //할인 정보
  costInfo?: string; //NN월간 NN원 결제
  actionType: "upgrade" | "downgrade" | "now";
  include: string[]; //포함 사항
  notIncluded?: string[]; //불포함 사항
}

export default function PlanCard({ setModal, planName, isRecomend = false, description, cost, discountInfo, costInfo, actionType, include, notIncluded }: PlanCardProps) {
  const renderBtn = (actionType: string) => {
    const btnStyle = actionType === "upgrade" && !isRecomend ? "outline" : actionType === "downgrade" ? "default" : isRecomend ? "default" : "ghost";
    return (
      <Button
        type="button"
        onClick={() => {
          setModal?.("default");
        }}
        variant={btnStyle}
        className={`${btnStyle === "outline" ? "text-primary" : ""}`}
        disabled={btnStyle === "ghost" ? true : false}
      >
        {actionType === "upgrade" ? `${planName}으로 업그레이드 하기` : actionType === "downgrade" ? `${planName}으로 전환` : "현재플랜"}
      </Button>
    );
  };

  return (
    <div
      style={
        isRecomend
          ? {
              padding: "2px",
              borderRadius: "0.625rem",
              background: "linear-gradient(90deg, #6366F1 0%, #06B6D4 100%)",
            }
          : {}
      }
    >
      <div className="rounded-lg border p-6 h-140 shadow-sm bg-white">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h4 className="text-slate-800 text-xl font-semibold">
              {planName}
              {isRecomend && <span className="rounded-lg px-2.5 py-0.5 border text-primary text-xs ml-1">추천</span>}
            </h4>
            <p className="h-10 text-slate-700 text-sm">{description}</p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <b className="text-foreground text-2xl font-bold flex items-center">
                {cost}원<span className="text-sm font-normal">/월</span>
              </b>
              <p className="text-slate-400 text-sm line-through">{discountInfo}</p>
            </div>
            <p className="text-xs text-muted-foreground h-4">{costInfo}</p>
          </div>
          {renderBtn(actionType)}

          <div className="w-full h-px bg-[#E2E8F0]" />

          <ul className="flex flex-col gap-2">
            {include.map((e, i) => {
              return (
                <li className="flex gap-1 items-center text-slate-800 text-sm font-medium" key={i}>
                  <i className="icon icon-check" />
                  <span>{e}</span>
                </li>
              );
            })}
          </ul>

          {notIncluded && (
            <ul className="flex flex-col gap-2">
              {notIncluded.map((e, i) => {
                return (
                  <li className="flex gap-1 items-center text-muted-foreground text-sm font-medium" key={i}>
                    <i className="icon icon-x" />
                    <span>{e}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
