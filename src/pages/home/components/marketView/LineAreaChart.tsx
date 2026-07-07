import { useEffect, useRef } from "react";
import { createChart, AreaSeries, type UTCTimestamp } from "lightweight-charts";
import type { IndexCandle } from "@/types/api/marketView";

interface LineAreaChartProps {
  colorType: string;
  data: IndexCandle[];
}

// tradeTime/indexPrice가 아직 없는 데이터(undefined)는 걸러내고, 유효한 것만 변환
const toAreaData = (data: IndexCandle[]) => {
  return data
    .map((d) => {
      const rawTime = (d as { tradeTime?: string }).tradeTime;
      const rawValue = (d as { indexPrice?: number }).indexPrice;

      let time = NaN;
      if (rawTime) {
        // "HH:mm" 형식 파싱 (예: "09:00")
        const match = /^(\d{1,2}):(\d{2})$/.exec(rawTime);
        if (match) {
          const [, hh, mm] = match;
          const now = new Date();
          const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(hh), Number(mm), 0, 0);
          time = Math.floor(d2.getTime() / 1000);
        } else {
          // ISO 문자열 등 다른 포맷 대비 fallback
          const parsed = new Date(rawTime).getTime();
          time = Number.isFinite(parsed) ? Math.floor(parsed / 1000) : NaN;
        }
      }

      const value = rawValue;

      return { time, value } as { time: number; value: number | undefined };
    })
    .filter((item): item is { time: number; value: number } => Number.isFinite(item.time) && typeof item.value === "number" && Number.isFinite(item.value))
    .map((item) => ({ time: item.time as UTCTimestamp, value: item.value }))
    .sort((a, b) => Number(a.time) - Number(b.time))
    .filter((item, index, arr) => {
      if (index === 0) return true;
      return item.time !== arr[index - 1].time;
    });
};

export default function LineAreaChart({ colorType, data }: LineAreaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const chartColorMap = () => {
    if (colorType === "blue") {
      return {
        lineColor: "#3B82F6",
        topColor: "#3B82F6CC",
        bottomColor: "#3B82F600",
      };
    }
    if (colorType === "red") {
      return {
        lineColor: "#F43F5E",
        topColor: "#FF8E8ECC",
        bottomColor: "#FF8E8E00",
      };
    }
    return {
      lineColor: "#94A3B8",
      topColor: "#94A3B8CC",
      bottomColor: "#94A3B800",
    };
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const areaData = toAreaData(data);

    // 유효한 데이터가 하나도 없으면(아직 필드 미제공) 차트를 그리지 않고 종료
    if (areaData.length === 0) return;

    const chart = createChart(containerRef.current, {
      layout: {
        textColor: "black",
        attributionLogo: false,
      },
      timeScale: {
        visible: false,
      },
      rightPriceScale: {
        visible: false,
      },
      leftPriceScale: {
        visible: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        vertLine: {
          visible: false,
          labelVisible: false,
        },
        horzLine: {
          visible: false,
          labelVisible: false,
        },
      },
      width: containerRef.current.clientWidth,
      handleScroll: false, // 드래그로 스크롤 안 되게
      handleScale: false, // 휠/핀치로 확대축소 안 되게
      height: 56,
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      ...chartColorMap(),
      lineWidth: 1,
      lineType: 2,
      crosshairMarkerVisible: false,
    });

    areaSeries.setData(areaData);
    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      chart.applyOptions({ width });
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, colorType]);

  return <div ref={containerRef} style={{ width: "100%", height: 56 }} />;
}
