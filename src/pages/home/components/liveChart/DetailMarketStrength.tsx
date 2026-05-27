"use client";

import { useState, useEffect } from "react";
import type { RSPeriod } from "@/components/RSSettingDropdownContent";
import RSSettingDropdown from "@/components/RSSettingDropdown";
import { getDefaultRSRange } from "@/utils/tradingDay";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import { ChartLineLinear } from "./DetailMarketChart";
import { postMarketStrengthGraphData } from "@/api/chartDetails";
import type { MarketStrengthGraph } from "@/types/api/chartDetails";
interface Props {
  stockCode: string;
}

export default function DetailMarketStrength({ stockCode }: Props) {
  const [graphData, setGraphData] = useState<MarketStrengthGraph | null>(null);

  const defaultRSRange = getDefaultRSRange(63);

  const [rsPeriods, setRsPeriods] = useState<RSPeriod[]>([
    {
      id: uuid(),
      date: defaultRSRange,
      ratio: 100,
    },
  ]);

  const [filterValue, setFilterValue] = useState<{
    rs?: { from: string; to: string; ratio: number }[];
  }>({
    rs: [
      {
        from: format(defaultRSRange.from!, "yyyyMMdd"),
        to: format(defaultRSRange.to!, "yyyyMMdd"),
        ratio: 100,
      },
    ],
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await postMarketStrengthGraphData({
          stockCode,
          startDate: format(defaultRSRange.from!, "yyyyMMdd"),
          endDate: format(defaultRSRange.to!, "yyyyMMdd"),
          rsFilters: filterValue.rs?.map((v) => ({
            rsStartDate: v.from,
            rsEndDate: v.to,
            strength: v.ratio,
          })),
        });

        setGraphData(res);
      } catch (err) {
        console.log("시장 강도 분석 조회 오류", err);
      }
    };

    fetch();
  }, [stockCode, filterValue]);

  const result = `RS 기준 : ${graphData?.rsFilters?.map((item) => `${item.period}일 (${item.strength}%)`).join(", ")}`;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold">시장대비강도(RS) 추이</h3>
          <span className="block md:hidden text-xs text-muted-foreground">{result}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden md:block text-xs text-muted-foreground">{result}</span>

          <RSSettingDropdown
            isOnModal={true}
            popPosition="end"
            periods={rsPeriods}
            onChange={setRsPeriods}
            onApply={(formatted) =>
              setFilterValue({
                rs: formatted,
              })
            }
          />
        </div>
      </div>

      <div>
        {!graphData?.data?.length ? (
          <div className="h-76.5 w-full border rounded-md flex items-center justify-center bg-gray-50">
            <span className="text-sm text-muted-foreground">조회된 데이터가 없습니다</span>
          </div>
        ) : (
          <ChartLineLinear
            data={graphData.data}
            filterValue={{
              start: format(defaultRSRange.from!, "yyyyMMdd"),
              end: format(defaultRSRange.to!, "yyyyMMdd"),
            }}
          />
        )}
      </div>
    </div>
  );
}
