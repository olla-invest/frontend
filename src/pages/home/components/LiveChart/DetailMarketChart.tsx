"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, ReferenceLine } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

/* -------------------- 타입 -------------------- */

interface RSChartPoint {
  date: string; // "YYYY-MM-DD"
  rs: number;
}

interface FilterValue {
  start: string; // 조회 시작일
  end: string; // 조회 종료일
}

interface Props {
  data: RSChartPoint[];
  filterValue: FilterValue;
}

/* -------------------- 7등분 Tick 생성 -------------------- */

function get7Ticks(data: RSChartPoint[], filterValue: FilterValue): string[] {
  if (!data.length) return [];

  const filtered = data.filter((d) => d.date >= filterValue.start && d.date <= filterValue.end).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!filtered.length) return [];

  if (filtered.length <= 7) {
    return filtered.map((d) => d.date);
  }

  const ticks: string[] = [];
  for (let i = 0; i <= 6; i++) {
    const index = Math.round((i * (filtered.length - 1)) / 6);
    ticks.push(filtered[index].date);
  }

  return ticks;
}

/* -------------------- 차트 -------------------- */

export function ChartLineLinear({ data, filterValue }: Props) {
  // 조회기간 반영 데이터
  const filteredData = data.filter((d) => d.date >= filterValue.start && d.date <= filterValue.end).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const ticks = get7Ticks(filteredData, filterValue);

  return (
    <ChartContainer
      className="h-76.5 w-full"
      config={{
        rs: {
          label: "RS",
          color: "var(--chart-1)",
        },
      }}
    >
      <LineChart data={filteredData} margin={{ top: 10, left: 12, right: 24, bottom: 0 }}>
        <CartesianGrid vertical={false} />

        <XAxis dataKey="date" ticks={ticks} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis orientation="right" tickFormatter={(value: number) => value.toFixed(2)} tickLine={false} axisLine={false} tickMargin={8} />

        {/* 기준선 1.0 고정 */}
        <ReferenceLine y={1} stroke="#CBD5E1" />

        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <Line dataKey="rs" type="linear" stroke="var(--color-rs)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
