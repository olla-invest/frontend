import api from "@/lib/api";

export const getMarketViewSummary = () => api.get("/market-view");
export const getMarketViewDays = (marketType: string) => api.get(`/market-view/markets/${marketType}/distribution-days`);
