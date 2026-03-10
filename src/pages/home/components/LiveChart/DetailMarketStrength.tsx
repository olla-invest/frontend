"use client";

import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import type { RSPeriod } from "@/components/RSSettingDropdownContent";
import RSSettingDropdown from "@/components/RSSettingDropdown";
import { subDays, format } from "date-fns";
import { v4 as uuid } from "uuid";
import { ChartLineLinear } from "./DetailMarketChart";
import { postMarketStrengthGraphData } from "@/api/chartDetails";
import type { MarketStrengthGraph } from "@/types/api/chartDetails";

interface Props {
  stockCode: string;
}

export default function DetailMarketStrength({ stockCode }: Props) {
  const [graphData, setGraphData] = useState<MarketStrengthGraph | null>(null);

  const DEFAULT_RANGE: DateRange = {
    from: subDays(new Date(), 62),
    to: new Date(),
  };

  const [rsPeriods, setRsPeriods] = useState<RSPeriod[]>([
    {
      id: uuid(),
      date: DEFAULT_RANGE,
      ratio: 100,
    },
  ]);

  const [filterValue, setFilterValue] = useState<{
    rs?: { from: string; to: string; ratio: number }[];
  }>({
    rs: [
      {
        from: format(DEFAULT_RANGE.from!, "yyyyMMdd"),
        to: format(DEFAULT_RANGE.to!, "yyyyMMdd"),
        ratio: 100,
      },
    ],
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await postMarketStrengthGraphData({
          stockCode,
          startDate: format(DEFAULT_RANGE.from!, "yyyyMMdd"),
          endDate: format(DEFAULT_RANGE.to!, "yyyyMMdd"),
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

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex justify-between items-center">
        <h3 className="text-xl font-semibold">시장대비강도(RS) 추이</h3>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-muted-foreground">RS 기준 : 63일 (100%)</span>

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
              start: format(DEFAULT_RANGE.from!, "yyyyMMdd"),
              end: format(DEFAULT_RANGE.to!, "yyyyMMdd"),
            }}
          />
        )}
      </div>
    </div>
  );
}
