// utils/rank.tsx
export type RankStatus = "same" | "up" | "down";

export interface RankInfo {
  status: RankStatus;
  diff: number;
  isNew: boolean;
}

export const getRankInfo = (prevRank: number | null | undefined, rank: number | null | undefined): RankInfo => {
  if (rank == null) return { status: "down", diff: 0, isNew: false };
  if (prevRank == null) return { status: "up", diff: 0, isNew: true };

  const diff = Math.abs(prevRank - rank);
  if (diff === 0) return { status: "same", diff, isNew: false };

  return { status: prevRank > rank ? "up" : "down", diff, isNew: false };
};

export const RANK_META: Record<RankStatus, { text: string; color: string; icon: React.ReactNode }> = {
  same: { text: "유지", color: "text-gray-500", icon: null },
  up: { text: "상승", color: "text-rose-500", icon: <i className="icon icon-arrow-up" /> },
  down: { text: "하락", color: "text-blue-500", icon: <i className="icon icon-arrow-down" /> },
};
