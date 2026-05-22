import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStockBasicData, getStockNews } from "@/api/chartDetails";
import { LoadingUi } from "@/components/LoadingUi";
import LiveChartDetailContent from "./LiveChartDetailContent";
import type { StockDetailInfo } from "./stockDetailTypes";

export default function LiveChartDetailPage() {
  const { stockCode } = useParams<{ stockCode: string }>();
  const [detailInfo, setDetailInfo] = useState<StockDetailInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!stockCode) {
      setIsError(true);
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setIsError(false);

        const [basicRes, newsRes] = await Promise.all([
          getStockBasicData(stockCode),
          getStockNews(stockCode).catch(() => null),
        ]);

        const basicData = basicRes.data;

        setDetailInfo({
          id: stockCode,
          companyName: newsRes?.companyName ?? stockCode,
          investmentIndicators: basicData.changeRate,
          currentPrice: basicData.currentPrice,
        });
      } catch (err) {
        console.error("종목 상세 조회 오류", err);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [stockCode]);

  if (loading) {
    return <LoadingUi message="종목 정보를 불러오는 중입니다" />;
  }

  if (isError || !detailInfo) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        <span>종목 정보를 불러올 수 없습니다.</span>
      </div>
    );
  }

  return <LiveChartDetailContent detailInfo={detailInfo} variant="page" />;
}
