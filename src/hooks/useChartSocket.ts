import { useEffect } from "react";
import { getChartSocket } from "@/soket/chartSocket";
import { useLiveStore } from "@/store/liveChartStore";

export function useChartSocket(onMetricsUpdated?: () => void) {
  const updatePrice = useLiveStore((s) => s.updatePrice);

  useEffect(() => {
    const socket = getChartSocket();

    socket.on("connect", () => {
      console.log("chart socket connected");
    });

    socket.on("priceUpdated", (data) => {
      updatePrice(data);
    });

    socket.on("metricsUpdated", () => {
      onMetricsUpdated?.();
    });

    return () => {
      socket.off("priceUpdated");
      socket.off("metricsUpdated");
    };
  }, [updatePrice, onMetricsUpdated]);
}
