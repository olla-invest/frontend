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
import { ChevronDown, CircleCheckIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useExcelDownload } from "@/hooks/useExcelDownload";
import { TableLoading } from "@/components/TableLoading";

import ChartFilter from "./ChartFilter";
import type { StockRankingApiResponse, StockRankingApiItem } from "@/types/api/stocks";
import InvestmentIndicatorGuide from "./InvestmentIndicatorGuideDialog";

import { getRealTimeChart, getRealTimeChartStatus } from "@/api/stocks";

const columns: ColumnDef<StockRankingApiItem>[] = [
  {
    accessorKey: "rank",
    header: "순위",
    cell: ({ row }) => <div>{row.getValue("rank")}</div>,
  },
  {
    accessorKey: "companyName",
    header: "기업",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("companyName")}</div>,
  },
  {
    accessorKey: "currentPrice",
    header: "현재가",
    cell: ({ row }) => <div>{row.getValue("currentPrice")}</div>,
  },
  {
    accessorKey: "exchange",
    header: "거래소",
    cell: ({ row }) => <div>{row.getValue("exchange")}</div>,
  },
  {
    accessorKey: "relativeStrengthScore",
    header: "시장대비강도 점수",
    cell: ({ row }) => <div>{row.getValue("relativeStrengthScore")}</div>,
  },
  {
    accessorKey: "isHighPrice",
    header: "신고가 여부",
    cell: ({ row }) =>
      row.getValue("isHighPrice") ? (
        <Badge variant="outline">
          <CircleCheckIcon className="text-red-400" />
          신고가
        </Badge>
      ) : (
        "-"
      ),
  },
  {
    id: "investmentIndicators",
    header: "투자 중요지표",
    cell: ({ row }) => {
      const { investmentIndicators, investmentIndicatorsDtl } = row.original;

      return (
        <div>
          <div>{investmentIndicators}</div>
          <div className="text-xs text-muted-foreground">{investmentIndicatorsDtl}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "theme",
    header: "테마",
    cell: ({ row }) => <div>{row.getValue("theme")}</div>,
  },
  {
    accessorKey: "rankChange3Days",
    header: () => (
      <div className="text-center">
        <div className="text-xs">최근 3일 순위변동</div>
        <div className="flex">
          <span className="flex-1">D-1</span>
          <span className="flex-1">D-2</span>
          <span className="flex-1">D-3</span>
        </div>
      </div>
    ),
    cell: ({ row }) => {
      const values = row.getValue("rankChange3Days") as number[] | undefined;

      return (
        <div className="flex">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex-1 text-center">
              {values?.[i] ?? "-"}
            </span>
          ))}
        </div>
      );
    },
  },
];

export interface ChartFilterState {
  rs: string;
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
  const [pageSize, setPageSize] = useState(50);

  //필터
  const [filter, setFilter] = useState<ChartFilterState>({
    rs: "",
    market: "0",
    isHighPrice: [null],
    theme: [null],
    price: null,
  });

  //로딩 상태관리
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startPolling = async () => {
      try {
        setLoading(true);
        // 1. 최초 호출
        await getRealTimeChart({
          page,
          pageSize,
        });

        // 2️. 상태 폴링 시작
        intervalId = setInterval(async () => {
          try {
            const statusRes = await getRealTimeChartStatus();
            if (cancelled) return;

            if (statusRes.data.initialized) {
              // 3. initialized === true → 폴링 중단
              if (intervalId) clearInterval(intervalId);

              const res = await getRealTimeChart({
                page,
                pageSize,
              });

              if (!cancelled) {
                setLoading(false);
                setTableData(res.data);
              }
            }
          } catch (e) {
            console.error("status polling error", e);
          }
        }, 10000);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    };
    setLoading(false);
    startPolling();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
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

  const { downloadAll } = useExcelDownload(table, {
    fileName: "실시간_주식_랭킹.csv",
  });

  return (
    <div className="w-full flex flex-col h-full">
      <ChartFilter filter={filter} setFilter={setFilter} />

      <div className="flex justify-between items-center py-4">
        <div className="flex gap-2 items-center max-h-8 text-muted-foreground text-xs">
          <div className="bg-muted p-2 rounded-sm flex align-middle gap-1">
            <span>조회기간:</span>
            <span>- ~ - (- -:-:- 업데이트)</span>
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
          <Button variant="outline" size="sm" onClick={downloadAll}>
            <DownloadIcon />
            엑셀 다운로드
          </Button>
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
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableLoading colSpan={columns.length} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
