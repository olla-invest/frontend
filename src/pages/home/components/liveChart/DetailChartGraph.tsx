"use client";

import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, ColorType, type IChartApi, type ISeriesApi, type CandlestickData, type Time } from "lightweight-charts";

import type { GraphDetail } from "@/types/api/chartDetails";

interface Props {
  data: GraphDetail["candles"];
  chartPeriod?: "minute" | "day" | "week" | "month" | "year";
}

// ✅ 모든 타입 → Unix timestamp(초)로 통일
const toChartTime = (time: string | number, chartPeriod?: string): Time => {
  const str = String(time);

  // 분봉: "2026-06-05T09:30:00.000Z" → timestamp
  if (chartPeriod === "minute") {
    return Math.floor(new Date(str).getTime() / 1000) as unknown as Time;
  }

  // 년: "2026" → "2026-01-01" → timestamp
  if (str.length === 4) {
    return Math.floor(new Date(`${str}-01-01`).getTime() / 1000) as unknown as Time;
  }

  // 월: "2026-06" → "2026-06-01" → timestamp
  if (str.length === 7) {
    return Math.floor(new Date(`${str}-01`).getTime() / 1000) as unknown as Time;
  }

  // 일/주: "2026-06-05T00:00:00.000Z" → timestamp
  return Math.floor(new Date(str).getTime() / 1000) as unknown as Time;
};

// ✅ 호버 시 표시 포맷
const formatTimeLabel = (time: Time, chartPeriod?: string): string => {
  const date = new Date(Number(time) * 1000);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");

  if (chartPeriod === "minute") return `${y}-${m}-${d} ${hh}:${mm}`;
  if (chartPeriod === "year") return `${y}`;
  if (chartPeriod === "month") return `${y}-${m}`;
  return `${y}-${m}-${d}`;
};

// ✅ x축 tick 포맷
const formatTickLabel = (time: Time, chartPeriod?: string): string => {
  const date = new Date(Number(time) * 1000);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");

  if (chartPeriod === "minute") return `${hh}:${mm}`;
  if (chartPeriod === "year") return `${y}`;
  if (chartPeriod === "month") return `${y}.${m}`;
  return `${m}.${d}`;
};

export default function DetailChartGraph({ data, chartPeriod }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        textColor: "black",
        background: { type: ColorType.Solid, color: "white" },
        attributionLogo: false,
      },
      localization: {
        timeFormatter: (time: Time) => formatTimeLabel(time, chartPeriod),
      },
      timeScale: {
        tickMarkFormatter: (time: Time) => formatTickLabel(time, chartPeriod),
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#EF4444",
      downColor: "#3B82F6",
      borderVisible: false,
      wickUpColor: "#EF4444",
      wickDownColor: "#3B82F6",
      priceFormat: {
        type: "price",
        precision: 0,
        minMove: 1,
      },
    });

    seriesRef.current = candlestickSeries;

    const chartData: CandlestickData[] = data
      .map((d) => ({
        time: toChartTime(d.time as unknown as string, chartPeriod),
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
      // ✅ timestamp(숫자)로 통일했으므로 숫자 정렬
      .sort((a, b) => Number(a.time) - Number(b.time))
      // ✅ 중복 time 제거 (같은 timestamp 데이터 제거)
      .filter((item, index, arr) => {
        if (index === 0) return true;
        return item.time !== arr[index - 1].time;
      });

    candlestickSeries.setData(chartData);
    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, chartPeriod]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "312px",
      }}
    />
  );
}
