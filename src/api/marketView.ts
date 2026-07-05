import api from "@/lib/api";

export const getMarketViewSummary = () => api.get("/market-view");
