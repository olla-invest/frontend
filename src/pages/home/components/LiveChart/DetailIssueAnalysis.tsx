import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SampleImg from "@/assets/images/issueAnalysis-sample-img.png";
import { useState } from "react";
export default function DetailIssueAnalysis() {
  const [sortType, setSortType] = useState("latest");
  return (
    <div className="flex flex-col gap-4">
      {/* ai */}
      <section className="w-full py-2 px-6">
        <div className="rounded-md p-4 bg-muted flex gap-1">
          <i className="icon icon-star-four-color shrink-0" />
          <div className="flex flex-col gap-1 text-sm">
            <b className="font-semibold">AI 요약으로 핵심 이슈만 확인해보세요!</b>
            <p className="text-slate-700 ">
              SK 스퀘어는 자회사 SK하이닉스의 실적 호조 및 주주환원(자사주 소각·배당 확대) 소식이 이어지며, 투자 심리가 강화되고 있습니다. SK하이닉스 지분가치 부각으로 순자산가치(NAV) 재평가 기대가
              커지고, 증권사들도 목표주가 상향 전망을 제시하고 있습니다. 이 영향으로 SK스퀘어 주가는 52주 신고가 및 주요상승 흐름을 보이며 시총 순위 상승도 나타나고 있습니다. 시장에서는 이러한 핵심
              자회사 성과가 스퀘어 가치에 긍정적 영향을 준다는 분석이 나옵니다.{" "}
            </p>
          </div>
        </div>
      </section>
      <section className="w-full py-2 flex flex-col gap-4">
        <div className="flex items-center justify-between px-6">
          <h3 className="font-semibold text-xl">기본 정보</h3>
          <div className="flex items-center gap-2.5">
            <span className="text-muted-foreground text-xs">업데이트 일시 : yyyy-mm-dd hh:mm:ss</span>
            <Tabs defaultValue={sortType} onValueChange={(value) => setSortType(value)}>
              <TabsList className="p-0.75">
                <TabsTrigger value="latest">최신순</TabsTrigger>
                <TabsTrigger value="relevance">관련도순</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <ul className="flex gap-6 flex-col">
          {/* 이미지 있는경우 */}
          <li className="w-full">
            <a className="block px-6">
              <div className="flex gap-6">
                {/* 본문 */}
                <div className="flex flex-col gap-2">
                  <b>[사설] HBM 기밀에다 석탄 수입 요구, 또 터진 트럼프發 돌발변수</b>
                  <p className="text-slate-700 text-sm line-clamp-2">
                    도널드 트럼프 미국 행정부의 한국에 대한 무리한 요구가 한도 끝도 없다. 서울경제신문 취재에 따르면 미 국제무역위원회(ITC)는 삼성전자가 미국 특허관리전문회사(NPE)인 넷리스트의 반도체
                    특허를 침해했는지 여부를 확인하겠다며 SK하이닉스에 고대역폭메모리(HBM) 관련 기밀 정보들을 요구한 것으로 드러났다. ‘특허 괴물’로 불리는 자국 기업의 이익을 위해 특허 소송 당사자도
                    아닌 SK하이닉스를 끌어들여 HBM의 설계 방식
                  </p>
                  <div className="flex gap-1 items-center text-muted-foreground text-xs">
                    <span>서울경제</span>
                    <div className="size-0.5 bg-muted-foreground"></div>
                    <span>1시간 전</span>
                  </div>
                </div>
                {/* 이미지 */}
                <div className="border w-40 shrink-0 rounded-md overflow-hidden">
                  <img src={SampleImg} alt="예시 이미지" className="w-full" />
                </div>
              </div>
            </a>
          </li>

          <li className="w-full">
            <a className="block px-6">
              <div className="flex gap-6">
                {/* 본문 */}
                <div className="flex flex-col gap-2">
                  <b>[사설] HBM 기밀에다 석탄 수입 요구, 또 터진 트럼프發 돌발변수</b>
                  <p className="text-slate-700 text-sm line-clamp-2">
                    도널드 트럼프 미국 행정부의 한국에 대한 무리한 요구가 한도 끝도 없다. 서울경제신문 취재에 따르면 미 국제무역위원회(ITC)는 삼성전자가 미국 특허관리전문회사(NPE)인 넷리스트의 반도체
                    특허를 침해했는지 여부를 확인하겠다며 SK하이닉스에 고대역폭메모리(HBM) 관련 기밀 정보들을 요구한 것으로 드러났다. ‘특허 괴물’로 불리는 자국 기업의 이익을 위해 특허 소송 당사자도
                    아닌 SK하이닉스를 끌어들여 HBM의 설계 방식
                  </p>
                  <div className="flex gap-1 items-center text-muted-foreground text-xs">
                    <span>서울경제</span>
                    <div className="size-0.5 bg-muted-foreground"></div>
                    <span>1시간 전</span>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
