import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table as UiTable, TableBody, TableHeader, TableHead, TableCell, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getMarketViewDays } from "@/api/marketView";

interface DistributionDayItem {
  tradeDate: string;
  changeRate: number;
  volume: string;
  isActive: boolean;
  removedReason: string | null;
}

interface DistributionDayResponse {
  marketType: "KOSPI" | "KOSDAQ";
  total: number;
  items: DistributionDayItem[];
}

export default function FollowThroughDateModal({ marketName, isOpen, onClose }: { marketName: string; isOpen: boolean; onClose: () => void }) {
  const marketType = marketName === "코스피" ? "KOSPI" : "KOSDAQ";
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DistributionDayResponse | null>(null);

  const getDateInfo = async () => {
    try {
      setLoading(true);
      const res = await getMarketViewDays(marketType);
      setData(res.data);
    } catch (err) {
      console.log(err + "분산일 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line
      getDateInfo();
    }
  }, [isOpen, marketType]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="w-[384px] h-131">
        <div className="flex flex-col gap-4">
          <DialogHeader className="h-fit">
            <DialogTitle className="text-lg font-semibold text-slate-800">{marketName} 매도 신호일</DialogTitle>
            <DialogDescription className="text-sm text-slate-700">최근 25거래일 기준 · 총 {data?.total ?? 0}개 ⚡️</DialogDescription>
          </DialogHeader>
          <UiTable>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">날짜</TableHead>
                <TableHead className="text-right text-muted-foreground">등락률</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-sm text-muted-foreground h-16">
                    불러오는 중...
                  </TableCell>
                </TableRow>
              ) : data && data.items.length > 0 ? (
                data.items.map((item) => {
                  const isNegative = item.changeRate < 0;
                  const displayRate = item.changeRate > 0 ? `+${item.changeRate}` : `${item.changeRate}`;

                  return (
                    <TableRow key={item.tradeDate} className={!item.isActive ? "opacity-50" : ""}>
                      <TableCell className="text-slate-700">{item.tradeDate}</TableCell>
                      <TableCell className={`text-right font-medium ${isNegative ? "text-blue-500" : "text-rose-500"}`}>{displayRate}%</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-sm text-muted-foreground h-16">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </UiTable>
        </div>
      </DialogContent>
    </Dialog>
  );
}
