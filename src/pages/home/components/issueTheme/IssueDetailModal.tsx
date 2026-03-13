import { Bage } from "@/components/Bage";
import DraggableModal from "@/components/DraggableModal";
import { useState } from "react";
interface ModalProps {
  onClose: () => void;
  selectIssue?: any;
}
export default function IssueDetailModal({ onClose, selectIssue }: ModalProps) {
  console.log(selectIssue);
  const [isBookmark, setIsBookmark] = useState(false);
  return (
    <DraggableModal onClose={onClose}>
      <div className="flex flex-col gap-1 px-6 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="font-bold text-2xl">태마명</span>
            <button onClick={() => setIsBookmark((prev) => !prev)}>
              <i className={`icon ${isBookmark ? "icon-star-fill" : "icon-star"}`} />
            </button>
          </div>
          <div className="py-1 flex gap-1">
            <Bage content="테마 내 상승종목 증가" />
            <Bage content="거래대금 급증 종목 증가" />
            <Bage content="평균 등락률 상승" />
            <Bage content="상위 종목 급등" />
          </div>
        </div>
        <div className="flex gap-1 items-center">
          <div className="flex gap-1 text-sm">
            <span className="text-muted-foreground">순위변동</span>
            <span>1위</span>
            <div className="flex items-center gap-0.5 text-rose-500">
              <i className="icon icon-arrow-up" />2
            </div>
          </div>
          <div className="size-0.5 rounded-full bg-muted-foreground" />
          <div className="flex gap-1 text-sm">
            <span className="text-muted-foreground">테마 내 상승종목수</span>
            <span>
              🔥<span className="text-rose-500">12</span>/15
            </span>
          </div>
        </div>
      </div>

      <div className="py-4 px-6 mb-4">
        <div className="rounded-md p-4 bg-muted flex gap-1">
          <i className="icon icon-star-four-color" />
          <div className="flex flex-col gap-1 text-sm">
            <b className="font-semibold">AI 기업 요약으로 기업정보를 확인해보세요!</b>
            <p className="text-slate-700 ">동사는 1949년 설립되어 경기도 이천시에 본사를 두고 4개의 생산기지와 3개의 연구개발법인 및 여러 해외 판매법인을 운영하는 글로벌 반도체 기업임.</p>
          </div>
        </div>
      </div>

      <div className="px-6">테이블</div>
    </DraggableModal>
  );
}
