"use client";

import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, ColorType, type IChartApi, type ISeriesApi, type CandlestickData, type Time } from "lightweight-charts";

import type { GraphDetail } from "@/types/api/chartDetails";

interface Props {
  data: GraphDetail["candles"];
  chartPeriod?: "minute" | "day" | "week" | "month" | "year";
}

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
        timeFormatter: (time: Time) => {
          const date = new Date(Number(time) * 1000);

          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const d = String(date.getDate()).padStart(2, "0");

          return `${y}-${m}-${d}`;
        },
      },

      timeScale: {
        tickMarkFormatter: (time: Time) => {
          const date = new Date(Number(time) * 1000);

          if (chartPeriod === "minute") {
            return date.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            });
          }

          if (chartPeriod === "year") {
            return date.getFullYear().toString();
          }

          return date.toLocaleDateString("ko-KR", {
            month: "2-digit",
            day: "2-digit",
          });
        },
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#EF4444",
      downColor: "#3B82F6",
      borderVisible: false,
      wickUpColor: "#EF4444",
      wickDownColor: "#3B82F6",
    });

    seriesRef.current = candlestickSeries;

    // 데이터 변환 + 정렬
    const chartData: CandlestickData[] = data
      .map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
      .sort((a, b) => Number(a.time) - Number(b.time));

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
