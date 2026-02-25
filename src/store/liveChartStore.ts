import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { PriceUpdatedPayload } from "@/soket/socketTypes";

/**
 * 🔥 UI에서 사용할 정규화된 타입
 * price는 항상 number
 */
interface NormalizedPrice {
  stockCode: string;
  price: number;
  changeRate: string;
}

interface LiveState {
  prices: Record<string, NormalizedPrice>;
  updatePrice: (data: PriceUpdatedPayload) => void;
}

export const useLiveStore = create<LiveState>()(
  devtools(
    (set) => ({
      prices: {},

      updatePrice: (data) => {
        set(
          (state) => ({
            prices: {
              ...state.prices,
              [data.stockCode]: {
                stockCode: data.stockCode,
                price: Number(data.price),
                changeRate: data.changeRate,
              },
            },
          }),
          false,
          "live/updatePrice",
        );
      },
    }),
    { name: "LiveStore" },
  ),
);
