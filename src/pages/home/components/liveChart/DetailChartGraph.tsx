"use client";

import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, ColorType, type IChartApi, type ISeriesApi, type CandlestickData, type Time, type UTCTimestamp } from "lightweight-charts";

import type { GraphDetail } from "@/types/api/chartDetails";
import type { TickPayload, SnapshotPayload } from "@/soket/socketTypes";

interface Props {
  data: GraphDetail["candles"];
  chartPeriod?: "minute" | "day" | "week" | "month" | "year";
  tick: TickPayload | SnapshotPayload | null;
  interval?: number;
}

// 모든 타입 → Unix timestamp(초)로 통일
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

// 호버 시 표시 포맷
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

// x축 tick 포맷
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

export default function DetailChartGraph({ data, chartPeriod, tick, interval }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const minuteOhlcRef = useRef<{ open: number; high: number; low: number } | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // tick의 실시간(초 단위) 시각을 캔들 버킷 시작 시각으로 내림 처리
  const getBucketTime = (rawTimeSec: number, chartPeriod?: string, interval?: number): UTCTimestamp => {
    if (chartPeriod === "minute") {
      const intervalSec = (interval ?? 1) * 60;
      return (Math.floor(rawTimeSec / intervalSec) * intervalSec) as UTCTimestamp;
    }

    const date = new Date(rawTimeSec * 1000);
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth();
    const d = date.getUTCDate();

    if (chartPeriod === "year") return Math.floor(Date.UTC(y, 0, 1) / 1000) as UTCTimestamp;
    if (chartPeriod === "month") return Math.floor(Date.UTC(y, m, 1) / 1000) as UTCTimestamp;
    return Math.floor(Date.UTC(y, m, d) / 1000) as UTCTimestamp; // day/week
  };

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
        fixRightEdge: true,
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
      // NaN/유효하지 않은 값 필터링
      .filter((item) => Number.isFinite(Number(item.time)) && Number.isFinite(item.open) && Number.isFinite(item.high) && Number.isFinite(item.low) && Number.isFinite(item.close))
      .sort((a, b) => Number(a.time) - Number(b.time))
      .filter((item, index, arr) => {
        if (index === 0) return true;
        return item.time !== arr[index - 1].time;
      });

    candlestickSeries.setData(chartData);
    //새로 세팅된 데이터의 마지막 time 기록 (기존에 남아있던 lastTimeRef 초기화)

    lastTimeRef.current = chartData.length > 0 ? Number(chartData[chartData.length - 1].time) : null;
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

  useEffect(() => {
    if (!tick || !seriesRef.current) return;

    const price = Number(tick.price);
    const rawTimeSec = typeof tick.time === "string" ? Math.floor(new Date(tick.time).getTime() / 1000) : Number(tick.time);

    if (!Number.isFinite(rawTimeSec) || !Number.isFinite(price)) {
      console.warn("⚠️ 유효하지 않은 tick 무시:", tick);
      return; // 이상한 데이터는 update 자체를 스킵
    }

    // 인터벌 버킷 시작 시각으로 변환
    const time = getBucketTime(rawTimeSec, chartPeriod, interval);
    const numericTime = Number(time);

    if (!Number.isFinite(numericTime)) {
      console.warn("⚠️ 버킷 시간 계산 실패:", { rawTimeSec, chartPeriod, interval });
      return;
    }

    // 마지막 bar보다 과거 시간이면 무시 (out-of-order 방지)
    if (lastTimeRef.current !== null && numericTime < lastTimeRef.current) {
      return;
    }

    if (chartPeriod === "minute") {
      if (!minuteOhlcRef.current) {
        minuteOhlcRef.current = {
          open: Number(tick.open),
          high: Number(tick.high),
          low: Number(tick.low),
        };
      } else {
        minuteOhlcRef.current.high = Math.max(minuteOhlcRef.current.high, price);
        minuteOhlcRef.current.low = Math.min(minuteOhlcRef.current.low, price);
      }

      seriesRef.current.update({
        time,
        open: minuteOhlcRef.current.open,
        high: minuteOhlcRef.current.high,
        low: minuteOhlcRef.current.low,
        close: price,
      });
    } else {
      const open = Number(tick.open);
      const high = Number(tick.high);
      const low = Number(tick.low);

      // day/week/month/year 분기도 방어
      if (![open, high, low].every(Number.isFinite)) {
        console.warn("⚠️ tick의 OHLC 값이 유효하지 않음:", tick);
        return;
      }
      // day/week/month/year: 서버가 보내주는 tick.open/high/low를
      // "해당 기간 누적 OHLC"라고 가정하고 그대로 사용
      seriesRef.current.update({
        time,
        open: Number(tick.open),
        high: Number(tick.high),
        low: Number(tick.low),
        close: price,
      });
    }
    lastTimeRef.current = numericTime;
  }, [tick, chartPeriod]);

  useEffect(() => {
    minuteOhlcRef.current = null;
  }, [chartPeriod]);

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
