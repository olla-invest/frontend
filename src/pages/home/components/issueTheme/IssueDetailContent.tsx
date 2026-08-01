import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getIssueThemeDetail } from "@/api/issueTheme";
import type { IssueThemeDetailApiResponse } from "@/types/api/issueTheme";
import { useWatchThemeStore } from "@/store/WatchListStore";
import { isInWatchThemeList, toggleWatchThemeList } from "@/hooks/useToggleWatchList";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingUi } from "@/components/LoadingUi";
import { openStockDetailInNewTab } from "../liveChart/stockDetailTypes";
import { useNavigate } from "react-router-dom";
import { getThemeIcon } from "@/utils/ThemeIcon";

export interface IssueDetailSummary {
  themeCode: number;
  rank?: number;
  rankChange?: number | null;
}

interface ContentProps {
  selectIssue: IssueDetailSummary;
}

// 종목 정렬 옵션
type StockSortType = "rs" | "rate" | "prevRatio";

const STOCK_SORT_OPTIONS: { key: StockSortType; label: string }[] = [
  { key: "rs", label: "RS 점수 높은순" },
  { key: "rate", label: "등락률 높은순" },
  { key: "prevRatio", label: "전일비 순" },
];

export default function IssueDetailContent({ selectIssue }: ContentProps) {
  const isMobile = useIsMobile();
  const [detailData, setDetailData] = useState<IssueThemeDetailApiResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const { themeList } = useWatchThemeStore();
  const [isBookmark, setIsBookmark] = useState(isInWatchThemeList(themeList ?? [], selectIssue.themeCode));
  const navigate = useNavigate();

  // 종목 정렬 - 디폴트 RS 점수 높은순
  const [stockSort, setStockSort] = useState<StockSortType>("rs");

  // 테마가 바뀌면 정렬 기준을 디폴트로 리셋
  // (effect에서 setState를 동기 호출하는 대신, 렌더링 중 상태를 조정하는 React 권장 패턴 사용)
  const [prevThemeCode, setPrevThemeCode] = useState(selectIssue.themeCode);
  if (prevThemeCode !== selectIssue.themeCode) {
    setPrevThemeCode(selectIssue.themeCode);
    setStockSort("rs");
  }

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const getIssueDetailData = async () => {
      try {
        setIsLoading(true);
        const res = await getIssueThemeDetail(selectIssue.themeCode);
        setDetailData(res);
        setIsBookmark(isInWatchThemeList(themeList ?? [], selectIssue.themeCode));
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    getIssueDetailData();
  }, [selectIssue]);

  const sortedStocks = useMemo(() => {
    const stocks = detailData?.stocks ?? [];
    return [...stocks].sort((a, b) => {
      if (stockSort === "rate") {
        return b.changeRate - a.changeRate;
      }
      if (stockSort === "prevRatio") {
        return b.previousTradingValueRatio - a.previousTradingValueRatio;
      }
      return b.rsScore - a.rsScore;
    });
  }, [detailData?.stocks, stockSort]);

  const currentSortLabel = STOCK_SORT_OPTIONS.find((o) => o.key === stockSort)?.label ?? STOCK_SORT_OPTIONS[0].label;

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
          {/* 헤더 */}
          <div className="flex flex-col gap-2 px-6 py-2">
            <div className="flex items-center gap-2.5">
              <div className="rounded-md size-16 overflow-hidden shrink-0">
                <img src={getThemeIcon(detailData?.themeCode)} alt={detailData?.themeName} className="w-full" />
              </div>
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
                  {detailData?.streakBadge && (
                    <div
                      className={`py-0.5 px-2 border rounded-lg text-xs font-medium ${detailData.streakBadge.tone === "RED" ? "text-rose-500" : detailData.streakBadge.tone === "BLUE" ? "text-blue-500" : "text-muted-foreground"}`}
                    >
                      {detailData?.streakBadge.label}
                    </div>
                  )}
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
                  {!isMobile && detailData?.streakBadge && (
                    <div
                      className={`py-0.5 px-2 border rounded-lg text-xs font-medium ${detailData.streakBadge.tone === "RED" ? "text-rose-500" : detailData.streakBadge.tone === "BLUE" ? "text-blue-500" : "text-muted-foreground"}`}
                    >
                      {detailData?.streakBadge.label}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="py-1 flex gap-1 flex-wrap">
              {isMobile && detailData?.streakBadge && (
                <div
                  className={`py-0.5 px-2 border rounded-lg text-xs font-medium ${detailData.streakBadge.tone === "RED" ? "text-rose-500" : detailData.streakBadge.tone === "BLUE" ? "text-blue-500" : "text-muted-foreground"}`}
                >
                  {detailData?.streakBadge.label}
                </div>
              )}
              {detailData?.insights.map((e, i) => {
                return (
                  <Badge variant="outline" key={i}>
                    {e}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* <div className="py-4 px-6 mb-4">
            <div className="rounded-md p-4 bg-muted flex gap-1">
              <div className="flex flex-col gap-1 text-sm">
                <div className="shrink-0 flex gap-1">
                  <i className="icon icon-star-four-color" />
                  <b className="text-sm font-semibold">AI 기업 요약으로 기업정보를 확인해보세요!</b>
                </div>
                <p className="text-slate-700 pl-5">동사는 1949년 설립되어 경기도 이천시에 본사를 두고 4개의 생산기지와 3개의 연구개발법인 및 여러 해외 판매법인을 운영하는 글로벌 반도체 기업임.</p>
              </div>
            </div>
          </div> */}

          {/* 종목 */}
          <div className="px-6 mb-10 md:mb-4">
            <div className="flex gap-2.5 justify-between items-center mb-4">
              <p className="text-xs text-muted-foreground">이슈 테마에 포함된 종목은 실시간 차트에서 조회되는 종목에 한해 제공됩니다.</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {currentSortLabel}
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0" align="end">
                  <DropdownMenuRadioGroup value={stockSort} onValueChange={(v) => setStockSort(v as StockSortType)}>
                    <div className="px-2 py-1.5 flex flex-col gap-1">
                      {STOCK_SORT_OPTIONS.map((option) => (
                        <DropdownMenuRadioItem key={option.key} value={option.key}>
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </div>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="overflow-x-auto">
              <Table className="md:w-full">
                <TableHeader>
                  <TableRow className="font-medium">
                    {/* 기업명 - 모바일 sticky */}
                    <TableHead className="sticky left-0 z-10 text-muted-foreground bg-background">종목명</TableHead>
                    <TableHead className="text-right text-muted-foreground bg-background">RS 점수</TableHead>
                    <TableHead className="text-right text-muted-foreground bg-background">단기 RS</TableHead>
                    <TableHead className="text-right text-muted-foreground bg-background">등락률</TableHead>
                    <TableHead className="text-right text-muted-foreground bg-background">거래대금</TableHead>
                    <TableHead className="text-right text-muted-foreground bg-background">전일비</TableHead>
                    <TableHead className="text-right text-muted-foreground bg-background">신고가</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {sortedStocks.map((stock) => {
                    const isUp = stock.changeRate > 0;
                    const isDown = stock.changeRate < 0;

                    const isHightUp = stock.newHighRate > 0;
                    const isHightDown = stock.newHighRate < 0;

                    return (
                      <TableRow key={stock.stockCode} className="text-slate-700 h-10" onClick={() => handleStockClick(stock.stockCode)}>
                        {/* 기업명 - 모바일 sticky */}
                        <TableCell className="sticky left-0 z-10 font-semibold text-slate-800 bg-background">
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-[#D9D9D9] overflow-hidden text-center hidden md:block">
                              <img src={getStockImageUrl(stock.stockCode)} alt={stock.companyName} className="w-full h-full object-cover" />
                            </div>
                            <span className="w-30 truncate">{stock.companyName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{stock.rsScore.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{stock.shortTermRs || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className={`w-full text-right ${isUp ? "text-rose-500" : isDown ? "text-blue-500" : "text-gray-400"}`}>
                            {isUp && "+"}
                            {stock.changeRate.toFixed(2)}%
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>{stock.currentPrice?.toLocaleString() || "-"}원</div>
                        </TableCell>
                        <TableCell className="text-right">{stock.previousTradingValueRatio.toFixed(2) || "-"}%</TableCell>
                        <TableCell>
                          {" "}
                          <div className={`w-full text-right ${isHightUp ? "text-rose-500" : isHightDown ? "text-blue-500" : "text-gray-400"}`}>
                            {isHightUp && "+"}
                            {stock.newHighRate.toFixed(2)}%
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 연관테마 */}
          <div className="px-6 py-2 mb-10 md:mb-0 flex flex-col gap-4">
            <h4 className="text-xl text-foreground font-semibold">연관테마</h4>
            {detailData?.relatedThemes && detailData?.relatedThemes.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="font-medium">
                      {/* 기업명 - 모바일 sticky */}
                      <TableHead className="sticky left-0 z-10 bg-background text-muted-foreground">테마명</TableHead>
                      <TableHead className="text-right text-muted-foreground bg-background">RS 점수</TableHead>
                      <TableHead className="text-right text-muted-foreground bg-background">등락률</TableHead>
                      <TableHead className="text-right text-muted-foreground bg-background">주요 종목</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {detailData?.relatedThemes?.map((theme) => {
                      const isUp = theme.changeRate > 0;
                      const isDown = theme?.changeRate < 0;

                      return (
                        <TableRow key={theme.themeCode} className="text-slate-700 h-10">
                          {/* 기업명 - 모바일 sticky */}
                          <TableCell className="sticky left-0 z-10 font-semibold text-slate-800 bg-background">
                            <div className="flex items-center gap-2">
                              <div className="size-8 rounded-md bg-[#D9D9D9] overflow-hidden text-center hidden md:block">
                                <img src={getThemeIcon(theme.themeCode)} alt={theme.themeName} className="w-full h-full object-cover" />
                              </div>
                              <span className="w-30 truncate">{theme.themeName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{theme.rsScore.toFixed(1)}</TableCell>
                          <TableCell className="text-right">
                            <div className={` ${isUp ? "text-rose-500" : isDown ? "text-blue-500" : "text-gray-400"}`}>
                              {isUp && "+"}
                              {theme.changeRate.toFixed(2)}%
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{theme.sharedStockCount || "-"}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="w-full h-12 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">연관 테마가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
