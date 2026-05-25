import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import SampleImg from "@/assets/images/issueAnalysis-sample-img.png";
import { useEffect, useState } from "react";
import { getStockNews } from "@/api/chartDetails";
import type { StockNews } from "@/types/api/chartDetails";

import DOMPurify from "dompurify";
import ConfirmModal from "@/components/confirmModal";
import { useIsMobile } from "@/hooks/use-mobile";
interface Props {
  stockCode: string;
  stockName: string;
}
export default function DetailIssueAnalysis({ stockCode, stockName }: Props) {
  const [sortType, setSortType] = useState("latest");
  const [newsData, setNewsData] = useState<StockNews | null>(null);

  const isMobile = useIsMobile();
  const [confirmNews, setConfirmNews] = useState(false);

  const renderTitle = (html: string) => {
    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["b"],
      ALLOWED_ATTR: [],
    });

    return <b dangerouslySetInnerHTML={{ __html: clean }} />;
  };

  const renderDescription = (html: string) => {
    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["b"],
      ALLOWED_ATTR: [],
    });

    return <p className="text-slate-700 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: clean }} />;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getStockNews(stockCode);
        setNewsData(res);
      } catch (err) {
        console.error("이슈분석 호출 에러", err);
      }
    };

    fetchNews();
  }, [stockCode]);

  const sortedNews = [...(newsData?.items ?? [])].sort((a, b) => {
    // 최신순
    if (sortType === "latest") {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    }

    // 관련도순
    const countKeyword = (text: string, keyword: string) => {
      const matches = text.match(new RegExp(keyword, "gi"));

      return matches ? matches.length : 0;
    };

    const aCount = countKeyword(a.title + a.description, stockName);
    const bCount = countKeyword(b.title + b.description, stockName);

    return bCount - aCount;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* ai */}
      {/* <section className="w-full py-2 px-6">
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
      </section> */}
      <section className="w-full py-2 flex flex-col gap-4">
        <div className="flex items-center justify-between px-6 flex-wrap">
          <h3 className="font-semibold text-xl">{stockName} 뉴스</h3>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-muted-foreground text-xs">업데이트 일시 : {formatDate(Date())}</span>
            <Tabs defaultValue={sortType} onValueChange={(value) => setSortType(value)}>
              <TabsList className="p-0.75">
                <TabsTrigger value="latest">최신순</TabsTrigger>
                <TabsTrigger value="relevance">관련도순</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <ul className="flex gap-6 flex-col">
          {sortedNews?.map((e, i) => {
            return (
              <li className="w-full" key={i}>
                <a
                  className="block px-6"
                  href={e.originallink}
                  target={isMobile ? undefined : "_blank"}
                  rel="noreferrer"
                  onClick={(event) => {
                    if (isMobile) {
                      event.preventDefault();

                      setConfirmNews(true);
                    }
                  }}
                >
                  <div className="flex gap-6">
                    {/* 본문 */}
                    <div className="flex flex-col gap-2">
                      {renderTitle(e.title)}
                      {renderDescription(e.description)}
                      <div className="flex gap-1 items-center text-muted-foreground text-xs">
                        <span>{e.mediaName}</span>
                        {/* <span>서울경제</span> */}
                        <div className="size-0.5 bg-muted-foreground"></div>
                        <span>{formatDate(e.pubDate)}</span>
                      </div>
                    </div>
                    {/* 이미지 */}
                    {/* <div className="border w-40 shrink-0 rounded-md overflow-hidden">
                      <img src={SampleImg} alt="예시 이미지" className="w-full" />
                    </div> */}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
      <ConfirmModal
        open={confirmNews}
        onOpenChange={setConfirmNews}
        title=""
        description={"뉴스 상세보기는 최적화된 환경을 위해\n웹버전에서 제공됩니다."}
        confirmText="확인"
        useCancel={false}
        onConfirm={() => {
          setConfirmNews(false);
        }}
      />
    </div>
  );
}
