import api from "@/lib/api";
import type { ChartResponse, TableDetail } from "@/types/api/chartDetails";

interface GetChartDetailParams {
  stockCode: string;
  candleType?: "day" | "week" | "month";
  startDate: string;
  endDate: string;
}

const transformChartResponse = (response: ChartResponse): TableDetail => {
  return {
    stockCode: response.stockCode,
    candleType: response.candleType,
    candles: response.candles.map((c) => ({
      time: c.time.slice(0, 10),
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
      volume: Number(c.volume),
    })),
  };
};

export const getChartTableDetailData = async ({ stockCode, candleType = "day", startDate, endDate }: GetChartDetailParams): Promise<TableDetail> => {
  const res = await api.get<ChartResponse>(`/real-time-chart/stored/${stockCode}`, {
    params: {
      candleType,
      startDate,
      endDate,
    },
  });

  return transformChartResponse(res.data);
};
