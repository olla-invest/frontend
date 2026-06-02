import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getIssueThemeDetail } from "@/api/issueTheme";
import type { IssueTheme, IssueThemeDetailApiResponse } from "@/types/api/issueTheme";
import { useWatchThemeStore } from "@/store/WatchListStore";
import { isInWatchThemeList, toggleWatchThemeList } from "@/hooks/useToggleWatchList";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingUi } from "@/components/LoadingUi";
import { openStockDetailInNewTab } from "../liveChart/stockDetailTypes";
import { useNavigate } from "react-router-dom";

interface ContentProps {
  selectIssue: IssueTheme;
}
export default function IssueDetailContent({ selectIssue }: ContentProps) {
  const isMobile = useIsMobile();
  const [detailData, setDetailData] = useState<IssueThemeDetailApiResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const { themeList } = useWatchThemeStore();
  const [isBookmark, setIsBookmark] = useState(isInWatchThemeList(themeList ?? [], selectIssue.themeCode));
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const getIssueDetailData = async () => {
      try {
        setIsLoading(true);
        const res = await getIssueThemeDetail(selectIssue.themeCode);
        setDetailData(res);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    getIssueDetailData();
  }, []);

  const getStockImageUrl = (stockCode: string) => {
    return `${BASE_URL}/stock-image/${stockCode}.png`;
  };

  const handleStockClick = (stockCode: string) => {
    if (isMobile) {
      navigate(`/detail/${stockCode}`);
    } else {
      openStockDetailInNewTab(stockCode);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingUi boxStyle="h-[calc(100vh-195px)]!" />
      ) : (
        <div>
          <div className="flex flex-col gap-1 px-6 py-2">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-2xl">{detailData?.themeName}</span>
                  <button
                    onClick={async () => {
                      const success = await toggleWatchThemeList(selectIssue.themeCode);
                      if (success) {
                        setIsBookmark((prev) => !prev);
                      }
                    }}
                  >
                    <i className={`icon ${isBookmark ? "icon-star-fill" : "icon-star"}`} />
                  </button>
                </div>
                <div className="md:hidden flex gap-1 items-center">
                  <div className="flex gap-1 text-sm">
                    <span className="text-muted-foreground">순위변동</span>
                    <span>{selectIssue?.rank}위</span>
                    {selectIssue?.rankChange && (
                      <div className={`flex items-center gap-0.5 ${selectIssue.rankChange > 0 ? "text-rose-500" : selectIssue.rankChange < 0 ? "text-blue-500" : "text-gray-400"}`}>
                        {selectIssue.rankChange > 0 && <i className="icon icon-arrow-up" />}
                        {selectIssue.rankChange < 0 && <i className="icon icon-arrow-down" />}
                        {Math.abs(selectIssue.rankChange)}
                      </div>
                    )}
                  </div>
                  <div className="size-0.5 rounded-full bg-muted-foreground" />
                  <div className="flex gap-1 text-sm">
                    <span className="text-muted-foreground">테마 내 상승종목수</span>
                    <span>
                      <span className="text-rose-500">{detailData?.risingCount}</span>/{detailData?.totalCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-1 flex gap-1 flex-wrap">
                {detailData?.insights.map((e, i) => {
                  return (
                    <Badge variant="outline" key={i}>
                      {e}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div className="hidden md:flex gap-1 items-center">
              <div className="flex gap-1 text-sm">
                <span className="text-muted-foreground">순위변동</span>
                <span>{selectIssue?.rank}위</span>
                {selectIssue?.rankChange && (
                  <div className={`flex items-center gap-0.5 ${selectIssue.rankChange > 0 ? "text-rose-500" : selectIssue.rankChange < 0 ? "text-blue-500" : "text-gray-400"}`}>
                    {selectIssue.rankChange > 0 && <i className="icon icon-arrow-up" />}
                    {selectIssue.rankChange < 0 && <i className="icon icon-arrow-down" />}
                    {Math.abs(selectIssue.rankChange)}
                  </div>
                )}
              </div>
              <div className="size-0.5 rounded-full bg-muted-foreground" />
              <div className="flex gap-1 text-sm">
                <span className="text-muted-foreground">테마 내 상승종목수</span>
                <span>
                  <span className="text-rose-500">{detailData?.risingCount}</span>/{detailData?.totalCount}
                </span>
              </div>
            </div>
          </div>

          {/* <div className="py-4 px-6 mb-4">
        <div className="rounded-md p-4 bg-muted flex gap-1">
          <i className="icon icon-star-four-color" />
          <div className="flex flex-col gap-1 text-sm">
            <b className="font-semibold">AI 기업 요약으로 기업정보를 확인해보세요!</b>
            <p className="text-slate-700 ">동사는 1949년 설립되어 경기도 이천시에 본사를 두고 4개의 생산기지와 3개의 연구개발법인 및 여러 해외 판매법인을 운영하는 글로벌 반도체 기업임.</p>
          </div>
        </div>
      </div> */}

          <div className="px-6 mb-10 md:mb-0">
            <div className="overflow-x-auto">
              <Table className="md:w-full w-max">
                <TableHeader>
                  <TableRow className="font-medium">
                    {/* 순위 - 모바일 sticky */}
                    <TableHead className="md:static sticky left-0 z-10 bg-background w-12 text-muted-foreground">순위</TableHead>
                    {/* 기업명 - 모바일 sticky */}
                    <TableHead className="md:static sticky left-12 z-10 bg-background text-muted-foreground">기업</TableHead>
                    <TableHead className="text-right text-muted-foreground">{isMobile ? "현재가" : "현재가(등락률)"}</TableHead>
                    <TableHead className="text-right text-muted-foreground whitespace-pre-line">{isMobile ? "시장대비\n강도 점수" : "시장대비강도 점수"}</TableHead>
                    <TableHead className="text-right text-muted-foreground whitespace-pre-line">{isMobile ? "거래대금\n변화" : "거래대금 변화"}</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {detailData?.stocks.map((stock) => {
                    const isUp = stock.changeRate > 0;
                    const isDown = stock.changeRate < 0;

                    return (
                      <TableRow key={stock.stockCode} className="text-slate-700 h-10" onClick={() => handleStockClick(stock.stockCode)}>
                        {/* 순위 - 모바일 sticky */}
                        <TableCell className="md:static md:bg-transparent bg-background sticky left-0 z-10 w-7.5 md:w-8">{stock.rank}</TableCell>
                        {/* 기업명 - 모바일 sticky */}
                        <TableCell className="md:static md:bg-transparent bg-background sticky left-12 z-10 font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-[#D9D9D9] overflow-hidden text-center hidden md:block">
                              <img src={getStockImageUrl(stock.stockCode)} alt={stock.companyName} className="w-full h-full object-cover" />
                            </div>
                            <span className="w-30 truncate">{stock.companyName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="flex justify-end items-center gap-1 md:flex-row flex-col md:h-12.25">
                          <div>{stock.currentPrice.toLocaleString()}</div>
                          <div className={`w-14 text-right ${isUp ? "text-rose-500" : isDown ? "text-blue-500" : "text-gray-400"}`}>
                            {isUp && "+"}
                            {stock.changeRate.toFixed(2)}%
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{stock.rsScore.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{stock.tradingValueRatio}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
