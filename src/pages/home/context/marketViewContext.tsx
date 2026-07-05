import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getMarketViewSummary } from "@/api/marketView"; // 실제 경로에 맞게 수정
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

export function MarketViewProvider({ children }: MarketViewProviderProps) {
  const [marketData, setMarketData] = useState<null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  return <MarketViewContext.Provider value={{ marketData: marketData, isLoading, error, refetch: fetchData }}>{children}</MarketViewContext.Provider>;
}
