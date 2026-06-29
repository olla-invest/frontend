import { useEffect, useRef } from "react";
import { createChart, AreaSeries, type UTCTimestamp } from "lightweight-charts";

const data: { value: number; time: UTCTimestamp }[] = [
  { value: 0, time: 1642425322 as UTCTimestamp },
  { value: 8, time: 1642511722 as UTCTimestamp },
  { value: 10, time: 1642598122 as UTCTimestamp },
  { value: 20, time: 1642684522 as UTCTimestamp },
  { value: 3, time: 1642770922 as UTCTimestamp },
  { value: 43, time: 1642857322 as UTCTimestamp },
  { value: 41, time: 1642943722 as UTCTimestamp },
  { value: 43, time: 1643030122 as UTCTimestamp },
  { value: 56, time: 1643116522 as UTCTimestamp },
  { value: 46, time: 1643202922 as UTCTimestamp },
];

interface LineAreaChartProps {
  colorType: string;
}

export default function LineAreaChart({ colorType }: LineAreaChartProps) {
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
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        textColor: "black",
        // background: { color: "white" },
        attributionLogo: false,
      },
      timeScale: {
        visible: false, // X축 숨기기
      },
      rightPriceScale: {
        visible: false, // Y축 숨기기 (오른쪽)
      },
      leftPriceScale: {
        visible: false, // Y축 숨기기 (왼쪽)
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: 275,
      height: 56,
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      ...chartColorMap(),
      lineWidth: 1,
      lineType: 2,
    });

    areaSeries.setData(data);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: 56 }} />;
}
