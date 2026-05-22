export interface StockDetailInfo {
  id: string;
  companyName: string;
  investmentIndicators: string;
  currentPrice: number;
}

/** modal: 드래그 모달 | page: /detail 라우트 */
export type StockDetailOpenMode = "modal" | "page";

/**
 * page 모드일 때 열기 방식
 * - newTab: 새 탭
 * - navigate: 같은 창에서 이동
 * - auto: 모바일(768px 미만)은 navigate, 그 외는 newTab
 */
export type StockDetailPageTarget = "newTab" | "navigate" | "auto";

export const getStockDetailUrl = (stockCode: string) => `/detail/${stockCode}`;

export function resolveStockDetailPageTarget(pageTarget: StockDetailPageTarget, isMobile: boolean): "newTab" | "navigate" {
  if (pageTarget === "auto") {
    return isMobile ? "navigate" : "newTab";
  }
  return pageTarget;
}

export function openStockDetailInNewTab(stockCode: string) {
  window.open(getStockDetailUrl(stockCode), "_blank", "noopener,noreferrer");
}
