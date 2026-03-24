import { DateYearSelect } from "@/components/DateYearSelect";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { getDetailStockInfo } from "@/api/chartDetails";
import type { StockDetailResponse, Quarter } from "@/types/api/chartDetails";
import { useEffect, useState } from "react";

interface Props {
  stockCode: string;
}
const formatAmount = (value: number | null | undefined) => {
  if (value == null) return "-";

  const eok = value / 100_000_000;

  return `${eok.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })}억`;
};

const formatPercent = (value: number | null | undefined) => {
  if (value == null) return "-";
  return `${value}%`;
};

export default function DetailStockInfo({ stockCode }: Props) {
  const currentYear = new Date().getFullYear().toString();
  const [selectYear, setSelectYear] = useState(currentYear);
  const [detailInfo, setDetailInfo] = useState<StockDetailResponse | null>(null);
  const [aiInfo] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getDetailStockInfo(stockCode, selectYear);
        if (res.status === 200) {
          setDetailInfo(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [stockCode, selectYear]);

  const getProfitability = (q: Quarter, key: string) => detailInfo?.indicators?.[q]?.profitability?.[key] ?? null;

  const getStability = (q: Quarter, key: string) => detailInfo?.indicators?.[q]?.stability?.[key] ?? null;

  const sampleBasicInfo1 = [
    { title: "업종", content: "-" },
    { title: "테마", content: "-" },
    { title: "상장일", content: "-" },
    { title: "시가총액", content: "-" },
  ];

  const sampleBasicInfo2 = [
    { title: "실제 기업가치", content: "-" },
    { title: "주요사업", content: "-" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* AI */}
      <section className="w-full py-2 flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <h3 className="font-semibold text-xl">{detailInfo?.overview.corpName}</h3>
          <div className="flex gap-1 items-center text-muted-foreground text-sm">
            <span>{detailInfo?.stockCode}</span>
            <div className="size-0.5 bg-muted-foreground"></div>
            <span>{detailInfo?.overview.corpClass === "Y" ? "KOSPI" : detailInfo?.overview.corpClass === "K" ? "KOSDAQ" : "KONEX"}</span>
          </div>
        </div>

        <div className="rounded-md p-4 bg-muted flex gap-1">
          <i className="icon icon-star-four-color" />
          <div className="flex flex-col gap-1 text-sm">
            {aiInfo === "" ? (
              <b className="font-semibold text-muted-foreground">AI 요약을 생성하지 못했습니다. 잠시 후 다시 시도해주세요.</b>
            ) : (
              <>
                <b className="font-semibold">AI 기업 요약으로 기업정보를 확인해보세요!</b>
                <p className="text-slate-700">{aiInfo}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 기본정보 */}
      <section className="w-full py-2 flex flex-col gap-4">
        <h3 className="font-semibold text-xl">기본 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="px-2 py-4 border-y flex flex-col gap-2">
            {sampleBasicInfo1.map((e, i) => (
              <div className="flex gap-1 text-sm" key={i}>
                <span className="text-muted-foreground shrink-0 min-w-30">{e.title}</span>
                <span className="font-semibold">{e.content}</span>
              </div>
            ))}
          </div>
          <div className="px-2 py-4 border-y flex flex-col gap-2">
            {sampleBasicInfo2.map((e, i) => (
              <div className="flex gap-1 text-sm" key={i}>
                <span className="text-muted-foreground shrink-0 min-w-30">{e.title}</span>
                <span className="font-semibold">{e.content}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 재무 */}
      <section className="w-full py-2 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-xl">재무 퀄리티</h3>
          <DateYearSelect setSelectYear={setSelectYear} selectYear={selectYear} />
        </div>

        {/* 손익 */}
        <div className="flex flex-col gap-1">
          <span>손익 현황</span>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground w-45">구분</TableHead>
                <TableHead className="text-muted-foreground text-right">1Q</TableHead>
                <TableHead className="text-muted-foreground text-right">2Q</TableHead>
                <TableHead className="text-muted-foreground text-right">3Q</TableHead>
                <TableHead className="text-muted-foreground text-right">4Q</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="h-12.25">
                <TableCell className="text-slate-700">매출액</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.revenue.q1)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.revenue.q2)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.revenue.q3)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.revenue.q4)}</TableCell>
              </TableRow>
              <TableRow className="h-12.25">
                <TableCell className="text-slate-700">영업이익</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.operatingIncome.q1)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.operatingIncome.q2)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.operatingIncome.q3)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.operatingIncome.q4)}</TableCell>
              </TableRow>
              <TableRow className="h-12.25">
                <TableCell className="text-slate-700">당기순이익</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.netIncome.q1)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.netIncome.q2)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.netIncome.q3)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.income.netIncome.q4)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* 현금흐름 */}
        <div className="flex flex-col gap-1">
          <span>현금흐름 현황</span>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground w-45">구분</TableHead>
                <TableHead className="text-muted-foreground text-right">1Q</TableHead>
                <TableHead className="text-muted-foreground text-right">2Q</TableHead>
                <TableHead className="text-muted-foreground text-right">3Q</TableHead>
                <TableHead className="text-muted-foreground text-right">4Q</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="h-12.25">
                <TableCell className="text-slate-700">영업활동현금흐름</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.operatingCashFlow.q1)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.operatingCashFlow.q2)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.operatingCashFlow.q3)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.operatingCashFlow.q4)}</TableCell>
              </TableRow>
              <TableRow className="h-12.25">
                <TableCell className="text-slate-700">투자활동현금흐름</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.investingCashFlow.q1)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.investingCashFlow.q2)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.investingCashFlow.q3)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.investingCashFlow.q4)}</TableCell>
              </TableRow>
              <TableRow className="h-12.25">
                <TableCell className="text-slate-700">재무활동현금흐름</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.financingCashFlow.q1)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.financingCashFlow.q2)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.financingCashFlow.q3)}</TableCell>
                <TableCell className="text-right">{formatAmount(detailInfo?.cashFlow.financingCashFlow.q4)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* 수익성·효율 지표 */}
        <div className="flex flex-col gap-1">
          <span>수익성·효율 지표</span>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground w-45">구분</TableHead>
                <TableHead className="text-muted-foreground text-right">1Q</TableHead>
                <TableHead className="text-muted-foreground text-right">2Q</TableHead>
                <TableHead className="text-muted-foreground text-right">3Q</TableHead>
                <TableHead className="text-muted-foreground text-right">4Q</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="h-12.25">
                <TableCell className="text-slate-700">영업이익률</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q1", "총자산영업이익률"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q2", "총자산영업이익률"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q3", "총자산영업이익률"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q4", "총자산영업이익률"))}</TableCell>
              </TableRow>

              <TableRow className="h-12.25">
                <TableCell className="text-slate-700">ROE</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q1", "ROE"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q2", "ROE"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q3", "ROE"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q4", "ROE"))}</TableCell>
              </TableRow>

              <TableRow className="h-12.25">
                <TableCell className="text-slate-700">ROA</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q1", "총자산영업이익률"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q2", "총자산영업이익률"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q3", "총자산영업이익률"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getProfitability("q4", "총자산영업이익률"))}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* 재무 안정성 지표 */}
        <div className="flex flex-col gap-1">
          <span>재무 안정성 지표</span>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground w-45">구분</TableHead>
                <TableHead className="text-muted-foreground text-right">1Q</TableHead>
                <TableHead className="text-muted-foreground text-right">2Q</TableHead>
                <TableHead className="text-muted-foreground text-right">3Q</TableHead>
                <TableHead className="text-muted-foreground text-right">4Q</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="h-12.25">
                <TableCell className="text-slate-700">부채비율</TableCell>
                <TableCell className="text-right">{formatPercent(getStability("q1", "부채비율"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getStability("q2", "부채비율"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getStability("q3", "부채비율"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getStability("q4", "부채비율"))}</TableCell>
              </TableRow>

              <TableRow className="h-12.25">
                <TableCell className="text-slate-700">유동비율</TableCell>
                <TableCell className="text-right">{formatPercent(getStability("q1", "유동비율"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getStability("q2", "유동비율"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getStability("q3", "유동비율"))}</TableCell>
                <TableCell className="text-right">{formatPercent(getStability("q4", "유동비율"))}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
