import { useEffect } from "react";
import { getChartSocket } from "@/soket/chartSocket";
import { useLiveStore } from "@/store/liveChartStore";
import type { MetricsUpdatedPayload, PriceUpdatedPayload } from "@/soket/socketTypes";

export function useChartSocket(onMetricsUpdated?: (data: MetricsUpdatedPayload) => void) {
  const updatePrice = useLiveStore((s) => s.updatePrice);

  useEffect(() => {
    const socket = getChartSocket();

    const handlePriceUpdated = (data: PriceUpdatedPayload) => {
      updatePrice(data);
    };

    const handleMetricsUpdated = (data: MetricsUpdatedPayload) => {
      onMetricsUpdated?.(data);
    };

    socket.on("connect", () => {
      console.log("chart socket connected");
    });

    socket.on("priceUpdated", handlePriceUpdated);
    socket.on("metricsUpdated", handleMetricsUpdated);

    return () => {
      socket.off("priceUpdated", handlePriceUpdated);
      socket.off("metricsUpdated", handleMetricsUpdated);
    };
  }, [updatePrice, onMetricsUpdated]);
}
