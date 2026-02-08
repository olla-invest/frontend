"use client";

import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { ChevronDown, CircleCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableLoading } from "@/components/TableLoading";

import ChartFilter from "./ChartFilter";
import type { StockRankingApiResponse, StockRankingApiItem } from "@/types/api/stocks";
import InvestmentIndicatorGuide from "./InvestmentIndicatorGuideDialog";
import { format, subDays } from "date-fns";

import { getRealTimeChart, getRealTimeChartStatus } from "@/api/stocks";

export const formatNumber = (value?: number | string) => (value == null ? "-" : Number(value).toLocaleString());

const columns: ColumnDef<StockRankingApiItem>[] = [
  {
    accessorKey: "rank",
    header: () => <div className="text-left w-16">순위</div>,
    cell: ({ row }) => <div>{row.getValue("rank")}</div>,
  },
  {
    accessorKey: "companyName",
    header: () => <div className="min-w-40">기업</div>,
    cell: ({ row }) => <div className="font-semibold text-slate-800">{row.getValue("companyName")}</div>,
  },
  {
    accessorKey: "currentPrice",
    header: () => <div className="text-right min-w-40">현재가</div>,
    cell: ({ row }) => {
      const price = row.getValue<number>("currentPrice");
      const rate = row.original.investmentIndicators;

      return (
        <div className="flex gap-1 items-end min-w-40 justify-end">
          {/* 현재가 */}
          <div>{formatNumber(price)}</div>
          <div className={`w-12.5 shrink-0 text-sm ${rate.startsWith("+") ? "text-rose-500" : rate.startsWith("-") ? "text-blue-500" : "text-muted-foreground"}`}>{rate}</div>

          {/* 전일 대비 */}
        </div>
      );
    },
  },

  {
    accessorKey: "exchange",
    header: () => <div className="text-right min-w-32">거래소</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue("exchange")}</div>,
  },
  {
    accessorKey: "relativeStrengthScore",
    header: () => <div className="text-right min-w-32">시장대비강도 점수</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue("relativeStrengthScore")}</div>,
  },
  {
    accessorKey: "isHighPrice",
    header: () => <div className="text-right min-w-32">신고가 여부</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {row.getValue("isHighPrice") ? (
          <Badge variant="outline">
            <CircleCheckIcon className="text-red-400" />
            신고가
          </Badge>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    id: "investmentIndicatorsDtl",
    header: () => <div className="text-right min-w-32">투자 중요지표</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue("investmentIndicatorsDtl")}</div>,
  },
  {
    accessorKey: "theme",
    header: () => <div className="text-right min-w-32">테마</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue("theme")}</div>,
  },
  {
    accessorKey: "rankHistory",
    header: () => (
      <div className="text-center min-w-40">
        <div className="text-xs">최근 3일 순위변동</div>
        <div className="flex">
          <span className="flex-1">D-1</span>
          <span className="flex-1">D-2</span>
          <span className="flex-1">D-3</span>
        </div>
      </div>
    ),
    cell: ({ row }) => {
      const v = row.getValue("rankHistory") as {
        oneDayAgo: number | null;
        today: number | null;
        twoDaysAgo: number | null;
      };

      return (
        <div className="flex">
          <span className="flex-1 text-center">{v.oneDayAgo ?? "-"}</span>
          <span className="flex-1 text-center">{v.today ?? "-"}</span>
          <span className="flex-1 text-center">{v.twoDaysAgo ?? "-"}</span>
        </div>
      );
    },
  },
];

export interface RSFilterValue {
  from: string; // yyyy-MM-dd
  to: string; // yyyy-MM-dd
  ratio: number;
}

export interface ChartFilterState {
  rs: RSFilterValue[];
  market: string;
  isHighPrice: ({ value: string; name: string } | null)[];
  theme: ({ value: string; name: string } | null)[];
  price: number | null;
}

export function LiveChart() {
  const [tableData, setTableData] = useState<StockRankingApiResponse | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  //페이지 네이션
  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(10);

  //필터
  const [filter, setFilter] = useState<ChartFilterState>({
    rs: [
      {
        from: format(subDays(new Date(), 63), "yyyy-MM-dd"),
        to: format(new Date(), "yyyy-MM-dd"),
        ratio: 100,
      },
    ],
    market: "0",
    isHighPrice: [],
    theme: [],
    price: 1000000000,
  });

  //로딩 상태관리
  const [loading, setLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState("- -:-:-");
  const [dataDate, setDataDate] = useState("- ~ - ");

  const pollingRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const startPolling = async () => {
      try {
        setLoading(true);

        // 1️⃣ 최초 호출
        const firstRes = await getRealTimeChart({ page, pageSize });
        if (cancelled) return;

        // 이미 초기화된 상태면 바로 종료
        const statusRes = await getRealTimeChartStatus();
        if (statusRes.data.initialized) {
          setTableData(firstRes.data);
          setUpdateTime(format(new Date(firstRes.data.meta.lastUpdatedAt), "yyyy-MM-dd HH:mm:ss"));
          setDataDate(firstRes.data.meta.dataDate);
          setLoading(false);
          return;
        }

        // 2️⃣ polling 시작
        pollingRef.current = setInterval(async () => {
          try {
            const status = await getRealTimeChartStatus();
            if (cancelled) return;

            if (status.data.initialized) {
              if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
              }

              const res = await getRealTimeChart({ page, pageSize });
              if (!cancelled) {
                setTableData(res.data);
                setUpdateTime(format(new Date(res.data.meta.lastUpdatedAt), "yyyy-MM-dd HH:mm:ss"));
                setDataDate(res.data.meta.dataDate);
                setLoading(false);
              }
            }
          } catch (e) {
            console.error("status polling error", e);
          }
        }, 3000);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    };

    startPolling();

    return () => {
      cancelled = true;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [page, pageSize]);

  const table = useReactTable({
    data: tableData?.stocks ?? [],
    manualPagination: true,
    pageCount: tableData?.totalPages ?? -1,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1, // TanStack은 0-based
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex: page - 1, pageSize }) : updater;
      setPage(next.pageIndex + 1);
      setPageSize(next.pageSize);
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full flex flex-col h-full">
      <ChartFilter filter={filter} setFilter={setFilter} />

      <div className="flex justify-between items-center py-4">
        <div className="flex gap-2 items-center max-h-8 text-muted-foreground text-xs">
          <div className="bg-muted p-2 rounded-sm flex align-middle gap-1">
            <span>조회기간:</span>
            <span>
              {dataDate} ({updateTime} 업데이트)
            </span>
          </div>
          <span className="text-sm">전체 {tableData?.totalCount?.toLocaleString() ?? 0}건</span>
        </div>
        <div className="flex gap-2 items-center max-h-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <i className="icon icon-info" />
                투자 주요지표 안내
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-lg md:max-w-2xl">
              <InvestmentIndicatorGuide />
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {table.getState().pagination.pageSize}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {[10, 20, 30, 50].map((size) => (
                  <DropdownMenuCheckboxItem
                    key={size}
                    checked={pageSize === size}
                    onCheckedChange={() => {
                      setPage(1);
                      setPageSize(size);
                    }}
                  >
                    {size}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col gap-4 h-[calc(100%-172px)]">
        <Table>
          <TableHeader className="sticky top-0 left-0 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground!">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableLoading colSpan={columns.length} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="h-12.25">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-75">
                <TableCell colSpan={columns.length} className="text-center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {tableData?.totalCount && tableData?.totalCount > 0 ? (
          <Pagination className="justify-end">
            <PaginationContent>
              {/* 이전 */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {/* 페이지 번호 3개 고정 */}
              {(() => {
                const totalPages = tableData?.totalPages ?? 0;
                if (totalPages === 0) return null;

                const start = Math.max(1, Math.min(page - 1, totalPages - 2));
                const pages = Array.from({ length: 3 }, (_, i) => start + i).filter((p) => p <= totalPages);

                return pages.map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNumber}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ));
              })()}

              {/* Ellipsis */}
              {tableData && tableData.totalPages > 3 && page < tableData.totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {/* 다음 */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < (tableData?.totalPages ?? 1)) {
                      setPage(page + 1);
                    }
                  }}
                  className={page >= (tableData?.totalPages ?? 1) ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}
