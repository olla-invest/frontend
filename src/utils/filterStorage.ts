import type { ChartFilterState } from "@/pages/home/components/LiveChart";

const KEY = "liveChart:filter";

export const saveFilterForDetailNav = (filter: ChartFilterState) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(filter));
  } catch {
    console.log("로컬 저장 실패");
  }
};

/** 읽은 뒤 즉시 삭제 — 뒤로가기 1회에만 복원 */
export const popFilterFromSession = (): ChartFilterState | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    return JSON.parse(raw) as ChartFilterState;
  } catch {
    return null;
  }
};
