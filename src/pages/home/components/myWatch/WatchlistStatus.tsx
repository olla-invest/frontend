import { useState } from "react";
import { Table as UiTable, TableBody, TableHeader, TableHead, TableCell, TableRow } from "@/components/ui/table";
import { useReactTable, flexRender, getCoreRowModel, type ColumnDef, type Table as ReactTable } from "@tanstack/react-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { WatchListTheme, WatchListStock, StockEventType } from "@/types/api/watchList";
import { Badge } from "@/components/ui/badge";
import { CircleCheckIcon } from "lucide-react";
import { getThemeIcon } from "@/utils/ThemeIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface WatchlistStatusProps {
  themeList: WatchListTheme[] | null;
  stockList: WatchListStock[] | null;
  handleStockModal: (stock: WatchListStock) => void;
  handleThemeModal: (stock: WatchListTheme) => void;
}

type EventMeta = {
  label: string;
  icon?: React.ReactNode;
};

const EVENT_META: Record<StockEventType, EventMeta> = {
  NEW_HIGH: {
    label: "신고가",
    icon: <CircleCheckIcon className="text-red-400" />,
  },
  VOLATILITY_CONTRACTION: {
    label: "변동성 축소",
  },
  PRICE_COMPRESSION: {
    label: "가격 압축",
  },
  TREND_TEMPLATE: {
    label: "트렌드템플레이트",
  },
  RANK_UP: {
    label: "순위 상승",
  },
  RANK_DOWN: {
    label: "순위 하락",
  },
};

const RANK_META = {
  same: {
    text: "유지",
    color: "text-gray-500",
    icon: null,
  },
  up: {
    text: "상승",
    color: "text-rose-500",
    icon: <i className="icon icon-arrow-up" />,
  },
  down: {
    text: "하락",
    color: "text-blue-500",
    icon: <i className="icon icon-arrow-down" />,
  },
} as const;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getStockImageUrl = (stockCode: string) => {
  return `${BASE_URL}/stock-image/${stockCode}.png`;
};

export default function WatchlistStatus({ themeList, stockList, handleThemeModal, handleStockModal }: WatchlistStatusProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const stockColumns: ColumnDef<WatchListStock>[] = [
    {
      accessorKey: "companyName",
      header: "기업",
      cell: ({ row }) => (
        <div className="min-w-24 flex items-center gap-2">
          <div className="size-8 rounded-full overflow-hidden bg-[#d9d9d9]">
            <img src={getStockImageUrl(row.original.stockCode)} alt={row.original.companyName} className="w-full h-full object-cover" />
          </div>
          {row.original.companyName}
        </div>
      ),
    },
    {
      accessorKey: "closePrice",
      header: () => <div className="text-right">현재가</div>,
      cell: ({ row }) => {
        const change = row.original.priceChangeRate1d;

        return (
          <div className="min-w-24 text-right">
            {row.original.closePrice ? row.original.closePrice?.toLocaleString() : "-"}원
            <span className={`ml-2 text-xs ${change > 0 ? "text-red-500" : change < 0 ? "text-blue-500" : "text-muted-foreground"} w-12.5 inline-block`}>
              {change > 0 ? "+" : ""}
              {change ? change?.toFixed(2) : "-"}%
            </span>
          </div>
        );
      },
    },
    {
      id: "rankChange",
      header: () => (
        <div className="text-right">
          종목 순위 변화
          <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
            <TooltipTrigger onClick={() => setTooltipOpen((prev) => !prev)}>
              <i className="icon icon-info-gray ml-1" />
            </TooltipTrigger>
            <TooltipContent className="bg-primary">
              <p>RS 기준 미충족 종목은 순위 변동을 제공하지 않습니다.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
      cell: ({ row }) => {
        const diff = Math.abs(row.original.prevRank - row.original.rank);
        const rankStatus = row.original.prevRank === row.original.rank ? "same" : row.original.prevRank > row.original.rank ? "up" : "down";
        const rankMeta = RANK_META[rankStatus];
        if (diff === 0) return <div className="text-right">-</div>;

        return (
          <div className="text-slate-700 text-sm flex gap-1 items-center justify-end">
            <span>종목 순위가</span>
            <span className="font-semibold">
              {row.original.prevRank} → {row.original.rank}
            </span>
            <span>으로 {rankMeta.text}했어요.</span>
            {rankStatus !== "same" && (
              <span className={`${rankMeta.color} flex items-center gap-0.5`}>
                {rankMeta.icon}
                {diff}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "events",
      header: () => <div className="text-right">투자 주요지표</div>,
      cell: ({ row }) => {
        const events = row.original.events;

        return (
          <div className="flex gap-1 text-xs justify-end">
            {events.map((event) => {
              const meta = EVENT_META[event];

              return (
                <Badge key={event} variant="outline">
                  {meta.icon}
                  {meta.label}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
  ];

  const themeColumns: ColumnDef<WatchListTheme>[] = [
    {
      accessorKey: "themeName",
      header: "테마",
      cell: ({ row }) => {
        return (
          <div className="min-w-24 flex items-center gap-2">
            <div className="size-8 rounded-md overflow-hidden bg-[#d9d9d9]">
              <img src={getThemeIcon(row.original.themeCode)} alt={row.original.themeName} className="w-full" />
            </div>
            {row.original.themeName}
          </div>
        );
      },
    },
    {
      id: "rankChange",
      header: () => <div className="text-right">테마 순위 변화</div>,
      cell: ({ row }) => {
        const diff = Math.abs(row.original.prevRank - row.original.rank);
        const rankStatus = row.original.prevRank === row.original.rank ? "same" : row.original.prevRank > row.original.rank ? "up" : "down";
        const rankMeta = RANK_META[rankStatus];

        if (diff === 0) return <div className="text-right">-</div>;

        return (
          <div className="text-slate-700 text-sm flex gap-1 flex-wrap items-center  justify-end">
            <span>테마 순위가</span>

            <span className="font-semibold">
              {row.original.prevRank || "-"} → {row.original.rank || "-"}
            </span>

            <span>으로 {rankMeta.text}했어요.</span>

            {rankStatus !== "same" && (
              <span className={`${rankMeta.color} flex items-center gap-0.5 w-6.5`}>
                {rankMeta.icon}
                {diff}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "stats",
      header: () => <div className="text-right">종목현황</div>,
      cell: ({ row }) => {
        const total = row.original.totalCount;
        const up = row.original.upCount ?? 0;
        const flat = row.original.flatCount ?? 0;
        const down = row.original.downCount ?? 0;

        return (
          <div className="flex items-center text-sm min-w-60 justify-end">
            {total}개중
            <span className="text-red-500 ml-2">{up}</span>상승
            <span className="text-muted-foreground ml-2">{flat}</span>보합
            <span className="text-blue-500 ml-2">{down}</span>하락
          </div>
        );
      },
    },
  ];

  const stockTable = useReactTable<WatchListStock>({
    data: stockList ?? [],
    columns: stockColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const themeTable = useReactTable<WatchListTheme>({
    data: themeList ?? [],
    columns: themeColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  function renderTable<T extends WatchListStock | WatchListTheme>(table: ReactTable<T>, type: "stock" | "theme") {
    return (
      <UiTable className="min-w-max">
        <TableHeader className="sticky top-0 bg-white">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((header) => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} onClick={() => (type === "stock" ? handleStockModal(row.original as WatchListStock) : handleThemeModal(row.original as WatchListTheme))}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </UiTable>
    );
  }

  return (
    <div>
      <Tabs defaultValue="stock">
        <TabsList className="h-9 p-0! bg-transparent!">
          <TabsTrigger
            value="stock"
            className="px-3 py-2 text-muted-foreground data-[state=active]:font-medium data-[state=active]:text-foreground data-[state=active]:rounded-full data-[state=active]:bg-muted data-[state=active]:shadow-none!"
          >
            관심 종목
            {stockList && stockList?.length > 0 && <span className="text-primary text-sm font-medium">{stockList?.length}</span>}
          </TabsTrigger>
          <TabsTrigger
            value="theme"
            className="px-3 py-2 text-muted-foreground data-[state=active]:font-medium data-[state=active]:text-foreground data-[state=active]:rounded-full data-[state=active]:bg-muted data-[state=active]:shadow-none!"
          >
            관심 테마
            {themeList && themeList?.length > 0 && <span className="text-primary text-sm font-medium">{themeList?.length}</span>}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stock">
          {stockList?.length === 0 ? (
            <div className="h-13 flex justify-center items-end">
              <span className="text-sm text-muted-foreground">관심 종목이 없어요.</span>
            </div>
          ) : (
            <div className="min-h-52">{renderTable(stockTable, "stock")}</div>
          )}
        </TabsContent>
        <TabsContent value="theme">
          {themeList?.length === 0 ? (
            <div className="h-13 flex justify-center items-end">
              <span className="text-sm text-muted-foreground">관심 테마가 없어요.</span>
            </div>
          ) : (
            <div className="min-h-52">{renderTable(themeTable, "theme")}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
