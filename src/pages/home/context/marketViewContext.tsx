import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { getMarketViewSummary } from "@/api/marketView";
import type { MarketViewSummary } from "@/types/api/marketView";

interface MarketViewContextType {
  marketData: MarketViewSummary | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const MarketViewContext = createContext<MarketViewContextType | undefined>(undefined);

export function useMarketView() {
  const context = useContext(MarketViewContext);
  if (!context) {
    throw new Error("useMarketView는 MarketViewProvider 안에서만 사용할 수 있습니다");
  }
  return context;
}

interface MarketViewProviderProps {
  children: ReactNode;
}

// 오늘(이미 지났다면 내일) 오후 4:30까지 남은 밀리초를 계산
function getMsUntilNext430PM() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(16, 30, 0, 0);

  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - now.getTime();
}

export function MarketViewProvider({ children }: MarketViewProviderProps) {
  const [marketData, setMarketData] = useState<MarketViewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMarketViewSummary();
      setMarketData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("알 수 없는 에러"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 데이터 페칭 초기 로딩 상태 설정
    fetchData();
  }, []);

  // 매일 오후 4:30이 되면 자동으로 재요청
  useEffect(() => {
    const schedule = () => {
      const ms = getMsUntilNext430PM();
      timerRef.current = setTimeout(() => {
        fetchData();
        schedule(); // 실행 후 다음 날 4:30을 위해 재예약
      }, ms);
    };

    schedule();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return <MarketViewContext.Provider value={{ marketData, isLoading, error, refetch: fetchData }}>{children}</MarketViewContext.Provider>;
}
