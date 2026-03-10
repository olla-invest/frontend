"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, ReferenceLine } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

/* -------------------- 타입 -------------------- */

interface RSChartPoint {
  date: string; // "YYYYMMDD"
  rsRaw: number;
}

interface FilterValue {
  start: string; // 조회 시작일
  end: string; // 조회 종료일
}

interface Props {
  data: RSChartPoint[];
  filterValue: FilterValue;
}

/* -------------------- 차트 -------------------- */

export function ChartLineLinear({ data, filterValue }: Props) {
  // 조회기간 반영 데이터
  const filteredData = data.filter((d) => d.date >= filterValue.start && d.date <= filterValue.end).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <ChartContainer
      className="h-76.5 w-full"
      config={{
        rsRaw: {
          label: "RS",
          color: "var(--chart-1)",
        },
      }}
    >
      <LineChart data={filteredData} margin={{ top: 10, left: 35, right: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} />

        <XAxis dataKey="date" interval={Math.floor(data.length / 7)} tickFormatter={(v) => `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis orientation="right" tickFormatter={(value: number) => value.toFixed(2)} tickLine={false} axisLine={false} tickMargin={8} />

        {/* 기준선 1.0 고정 */}
        <ReferenceLine y={1} stroke="#CBD5E1" />

        <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(v) => `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`} />} />

        <Line dataKey="rsRaw" type="linear" stroke="#4F46E5" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
