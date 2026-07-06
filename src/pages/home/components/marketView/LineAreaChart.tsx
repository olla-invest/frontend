import { useEffect, useRef } from "react";
import { createChart, AreaSeries, type UTCTimestamp } from "lightweight-charts";
import type { IndexCandle } from "@/types/api/marketView";

interface LineAreaChartProps {
  colorType: string;
  data: IndexCandle[];
}

// ✅ tradeTime/indexPrice가 아직 없는 데이터(undefined)는 걸러내고, 유효한 것만 변환
const toAreaData = (data: IndexCandle[]) => {
  return (
    data
      .map((d) => {
        // tradeTime, indexPrice가 옵셔널 필드라 아직 없을 수 있음 (추후 API 추가 예정)
        const rawTime = (d as { tradeTime?: string }).tradeTime;
        const rawValue = (d as { indexPrice?: number }).indexPrice;

        const time = rawTime ? Math.floor(new Date(rawTime).getTime() / 1000) : NaN;
        const value = rawValue;

        return { time, value } as { time: number; value: number | undefined };
      })
      // ✅ time/value가 유효한(NaN 아니고 undefined 아닌) 데이터만 남김
      .filter((item): item is { time: number; value: number } => Number.isFinite(item.time) && typeof item.value === "number" && Number.isFinite(item.value))
      .map((item) => ({ time: item.time as UTCTimestamp, value: item.value }))
      .sort((a, b) => Number(a.time) - Number(b.time))
      .filter((item, index, arr) => {
        if (index === 0) return true;
        return item.time !== arr[index - 1].time; // 중복 time 제거
      })
  );
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
      width: containerRef.current.clientWidth,
      height: 56,
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      ...chartColorMap(),
      lineWidth: 1,
      lineType: 2,
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
