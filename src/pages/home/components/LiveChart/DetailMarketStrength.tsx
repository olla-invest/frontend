"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import type { RSPeriod } from "@/components/RSSettingDropdownContent";
import RSSettingDropdown from "@/components/RSSettingDropdown";
import { subDays } from "date-fns";
import { v4 as uuid } from "uuid";
import { ChartLineLinear } from "./DetailMarketChart";

export default function DetailMarketStrength() {
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
  }>({});
  console.log(filterValue);
  const mockDate = {
    start: "2025-12-01",
    end: "2025-12-30",
  };
  const mockData = [
    { date: "2025-12-01", rs: 0.45 },
    { date: "2025-12-05", rs: 0.62 },
    { date: "2025-12-10", rs: 0.98 },
    { date: "2025-12-15", rs: 1.12 },
    { date: "2025-12-20", rs: 0.88 },
    { date: "2025-12-25", rs: 1.25 },
    { date: "2025-12-30", rs: 1.04 },
  ];
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex justify-between items-center">
        <h3 className="text-xl font-semibold">시장대비강도(RS) 추이</h3>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-muted-foreground">RS 기준 : 63일 (100%)</span>
          <RSSettingDropdown
            isOnModal={true}
            periods={rsPeriods}
            onChange={setRsPeriods}
            onApply={(formatted) =>
              setFilterValue((prev) => ({
                ...prev,
                rs: formatted,
              }))
            }
          />
        </div>
      </div>
      <div>
        <ChartLineLinear data={mockData} filterValue={mockDate} />
      </div>
    </div>
  );
}
