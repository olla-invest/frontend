import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import DraggableModal from "@/components/DraggableModal";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getIssueThemeDetail } from "@/api/issueTheme";
import type { IssueTheme, IssueThemeDetailApiResponse } from "@/types/api/issueTheme";

interface ModalProps {
  onClose: () => void;
  selectIssue: IssueTheme;
}
export default function IssueDetailModal({ onClose, selectIssue }: ModalProps) {
  const [detailData, setDetailData] = useState<IssueThemeDetailApiResponse>();

  useEffect(() => {
    const getIssueDetailData = async () => {
      try {
        const res = await getIssueThemeDetail(selectIssue.themeCode);
        setDetailData(res);
      } catch (err) {
        console.log(err);
      }
    };
    getIssueDetailData();
  }, []);

  const [isBookmark, setIsBookmark] = useState(false);
  return (
    <DraggableModal onClose={onClose}>
      <div className="flex flex-col gap-1 px-6 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="font-bold text-2xl">{detailData?.themeName}</span>
            <button onClick={() => setIsBookmark((prev) => !prev)}>
              <i className={`icon ${isBookmark ? "icon-star-fill" : "icon-star"}`} />
            </button>
          </div>
          <div className="py-1 flex gap-1">
            {detailData?.insights.map((e, i) => {
              return (
                <Badge variant="outline" key={i}>
                  {e}
                </Badge>
              );
            })}
          </div>
        </div>
        <div className="flex gap-1 items-center">
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

      <div className="px-6">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="font-medium">
                <TableHead className="w-16 text-muted-foreground">순위</TableHead>
                <TableHead className="text-muted-foreground">기업</TableHead>
                <TableHead className="text-right text-muted-foreground">현재가(등락률)</TableHead>
                <TableHead className="text-right text-muted-foreground">시장대비강도 점수 점수</TableHead>
                <TableHead className="text-right text-muted-foreground">거래대금 변화</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {detailData?.stocks.map((stock) => {
                const isUp = stock.changeRate > 0;
                const isDown = stock.changeRate < 0;

                return (
                  <TableRow key={stock.stockCode} className="text-slate-700 h-10">
                    <TableCell className="w-16">{stock.rank}</TableCell>
                    <TableCell className="truncate font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-[#d9d9d9]"></div>
                        {stock.companyName}
                      </div>
                    </TableCell>
                    <TableCell className="flex justify-end items-center gap-1">
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
    </DraggableModal>
  );
}
