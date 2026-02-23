"use client";

import { useEffect, useState } from "react";
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

import ChartFilter from "./LiveChart/ChartFilter";
import type { StockRankingApiResponse, StockRankingApiItem } from "@/types/api/stocks";
import type { GetRealTimeChartRequest } from "@/api/stocks";
import InvestmentIndicatorGuide from "./LiveChart/InvestmentIndicatorGuideDialog";
import { format } from "date-fns";

import { getRealTimeChart } from "@/api/stocks";
import { LoadingUi } from "@/components/LoadingUi";
import LiveChartDetail from "./LiveChart/LiveChartDetail";

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
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <div className="size-8 bg-[#D9D9D9] rounded-full"></div>
          <span className="font-semibold text-slate-800">{row.getValue("companyName")}</span>
        </div>
      );
    },
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
          {rate === "-" ? (
            <div className="w-12.5 shrink-0 text-sm text-right text-muted-foreground">0%</div>
          ) : (
            <div className={`w-12.5 shrink-0 text-sm text-right ${rate.startsWith("+") ? "text-rose-500" : rate.startsWith("-") ? "text-blue-500" : "text-muted-foreground"}`}>{rate}</div>
          )}
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
    size: 160,
    minSize: 160,
    maxSize: 160,
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
  rs: RSFilterValue[] | null;
  market: string;
  isHighPrice: { value: string; name: string } | null;
  theme: ({ code: number; name: string; description: string } | null)[];
  price: number | null;
}

export function LiveChart() {
  const [tableData, setTableData] = useState<StockRankingApiResponse | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  //상세 정보
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectRow, setSelectRow] = useState("");

  //페이지 네이션
  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(10);

  //로딩 상태관리
  const [loading, setLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState("- -:-:-");
  const [dataDate, setDataDate] = useState("- ~ - ");
  const [isError, setIsError] = useState(false);

  //필터
  const [filter, setFilter] = useState<ChartFilterState>({
    rs: null,
    market: "all",
    isHighPrice: null,
    theme: [],
    price: null,
  });
  const [appliedFilter, setAppliedFilter] = useState<ChartFilterState>(filter);

  const buildRequest = (filter: ChartFilterState, targetPage: number): GetRealTimeChartRequest => {
    const themes = filter.theme.map((t) => t?.code).filter((v): v is number => Boolean(v));

    return {
      marketType: filter.market === "0" ? "0" : filter.market,
      page: targetPage,
      pageSize,

      filters:
        filter.isHighPrice !== null || themes.length > 0 || filter.price !== null
          ? {
              isHighPrice: filter.isHighPrice !== null ? filter.isHighPrice.value === "true" : undefined,
              theme: themes.length > 0 ? themes : undefined,
              minTradingValue: filter.price ?? undefined,
            }
          : undefined,

      rsFilters: filter.rs
        ? filter.rs.map((r) => ({
            rsStartDate: r.from.replaceAll("-", ""),
            rsEndDate: r.to.replaceAll("-", ""),
            strength: r.ratio,
          }))
        : undefined,
    };
  };

  const fetchData = async (targetFilter: ChartFilterState, targetPage: number) => {
    try {
      setLoading(true);

      const requestBody = buildRequest(targetFilter, targetPage);

      const res = await getRealTimeChart(requestBody);

      setTableData(res.data);
      setUpdateTime(format(new Date(res.data.meta.lastUpdatedAt), "yyyy-MM-dd HH:mm:ss"));
      setDataDate(res.data.meta.dataDate);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      console.error("❌ API 호출 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const nextFilter = { ...filter };

    setAppliedFilter(nextFilter);
    setPage(1);

    await fetchData(nextFilter, 1);
  };

  useEffect(() => {
    fetchData(appliedFilter, page);
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
    <>
      <div className="w-full flex flex-col h-full">
        <ChartFilter filter={filter} setFilter={setFilter} onSearch={handleSearch} />

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
        <div className="flex flex-col gap-4 max-h-[calc(100%-172px)] flex-1 justify-between overflow-x-auto">
          <Table className="h-full min-w-max">
            <TableHeader className="sticky top-0 left-0 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)] shrink-0">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id} className={`text-muted-foreground! ${header.id === "rankHistory" ? "w-40" : null}`}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading
                ? null
                : table.getRowModel().rows.length
                  ? table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="h-12.25"
                        onClick={() => {
                          setDetailOpen(true);
                          setSelectRow(row.original.id);
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  : null}
            </TableBody>
          </Table>
          {loading ? (
            <LoadingUi message="데이터 조회중 입니다" />
          ) : table.getRowModel().rows.length ? (
            ""
          ) : (
            <div className="h-full flex items-center justify-center">
              {isError ? (
                <div className="flex flex-col gap-2 items-center">
                  <span className="text-center text-sm text-muted-foreground">조회중 오류가 발생했습니다</span>
                  <Button onClick={() => fetchData(appliedFilter, page)} className="w-fit">
                    재조회
                  </Button>
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  <span>데이터가 없습니다.</span>
                </div>
              )}
            </div>
          )}
          {!loading && tableData?.totalCount && tableData?.totalCount > 0 ? (
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
      {detailOpen && <LiveChartDetail onClose={() => setDetailOpen(false)} detailInfo={selectRow} />}
    </>
  );
}
