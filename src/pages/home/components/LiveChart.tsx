"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useChartSocket } from "@/hooks/useChartSocket";
import { useLiveStore } from "@/store/liveChartStore";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
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

import type { StockRankingApiResponse, StockRankingApiItem } from "@/types/api/stocks";
import type { GetRealTimeChartRequest } from "@/api/stocks";
import type { MetricsUpdatedPayload } from "@/soket/socketTypes";

import { format } from "date-fns";

import { getRealTimeChart } from "@/api/stocks";
import { LoadingUi } from "@/components/LoadingUi";

import InvestmentIndicatorGuide from "./liveChart/InvestmentIndicatorGuideDialog";
import ChartFilter from "./liveChart/ChartFilter";
import LiveChartDetail from "./liveChart/LiveChartDetail";
import { getStockDetailUrl, openStockDetailInNewTab, resolveStockDetailPageTarget, type StockDetailOpenMode, type StockDetailPageTarget } from "./liveChart/stockDetailTypes";
import { useIsMobile } from "@/hooks/use-mobile";

/* page: 상세 정보 페이지 모드 | modal: 상세 정보 모달 모드 */
const STOCK_DETAIL_OPEN_MODE: StockDetailOpenMode = "page";
/** page 모드일 때 새 탭 또는 이동 방식 */
const STOCK_DETAIL_PAGE_TARGET: StockDetailPageTarget = "auto";

const DESKTOP_DEFAULT_PAGE_SIZE = 10;
const MOBILE_PAGE_SIZE = 50;

const MOBILE_COLUMN_KEYS = new Set(["rank", "companyName", "currentPrice", "relativeStrengthScore"]);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getStockImageUrl = (stockCode: string) => {
  return `${BASE_URL}/stock-image/${stockCode}.png`;
};

export const formatNumber = (value?: number | string) => (value == null ? "-" : Number(value).toLocaleString());

/* =========================
  컬럼 정의
========================= */
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
interface LivePriceCellProps {
  stockCode: string;
  basePrice: number;
  baseRate: string;
}

function LivePriceCell({ stockCode, basePrice, baseRate }: LivePriceCellProps) {
  const livePrice = useLiveStore((state) => state.prices[stockCode]);

  const displayPrice = livePrice?.price ?? basePrice;
  const rate = livePrice?.changeRate ?? baseRate;

  const prevPriceRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [highlight, setHighlight] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (prevPriceRef.current === null) {
      prevPriceRef.current = displayPrice;
      return;
    }

    if (displayPrice === prevPriceRef.current) return;

    const direction = displayPrice > prevPriceRef.current ? "up" : "down";
    prevPriceRef.current = displayPrice;

    requestAnimationFrame(() => {
      setHighlight(direction);
    });

    //이전 타이머 제거
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setHighlight(null);
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayPrice]);

  return (
    <div
      className={`flex gap-1 items-end min-w-0 justify-end flex-col md:min-w-40 md:flex-row
      transition-colors duration-300
      ${highlight === "up" ? "bg-rose-100" : highlight === "down" ? "bg-blue-100" : ""}`}
    >
      <div>
        {formatNumber(displayPrice)}
        <span className="md:hidden inline">원</span>
      </div>

      <div className={`w-14 shrink-0 text-sm text-right ${rate?.startsWith("+") ? "text-rose-500" : rate?.startsWith("-") ? "text-blue-500" : "text-muted-foreground"}`}>{rate}</div>
    </div>
  );
}

const renderIndicators = (row: Row<StockRankingApiItem>) => {
  const { isVolatilityContraction, strengthContinuationDays, isPriceCompression } = row.original;

  const hasAny = isVolatilityContraction || isPriceCompression;

  return (
    <div className="flex flex-col items-end text-xs text-slate-700">
      <div>
        {hasAny ? (
          <>
            {isVolatilityContraction && <div>변동성 축소</div>}
            {isPriceCompression && <div>가격 압축</div>}
          </>
        ) : (
          "-"
        )}
      </div>
      <div>{strengthContinuationDays !== null ? `강도 지속(${strengthContinuationDays}/10)` : ""}</div>
    </div>
  );
};

const columns: ColumnDef<StockRankingApiItem>[] = [
  {
    accessorKey: "rank",
    header: () => <div className="text-left md:w-12">순위</div>,
    cell: ({ row }) => <div>{row.getValue("rank")}</div>,
  },
  {
    accessorKey: "companyName",
    header: () => <div className="md:min-w-40">종목명</div>,
    cell: ({ row }) => (
      <div className="flex gap-2 items-center w-28 md:w-40">
        <div className="size-8 shrink-0 bg-[#D9D9D9] rounded-full overflow-hidden hidden md:block">
          <img src={getStockImageUrl(row.original.id)} alt={row.original.companyName} className="w-full h-full object-cover" />
        </div>
        <p className="min-w-0 flex-1 font-semibold text-slate-800 line-clamp-2">{row.getValue("companyName")}</p>
      </div>
    ),
  },
  {
    accessorKey: "currentPrice",
    header: () => <div className="text-right md:min-w-40">현재가</div>,
    cell: ({ row }) => <LivePriceCell stockCode={row.original.id} basePrice={row.getValue<number>("currentPrice")} baseRate={row.original.investmentIndicators} />,
  },
  {
    accessorKey: "exchange",
    header: () => <div className="text-right min-w-32">거래소</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue("exchange")}</div>,
  },
  {
    accessorKey: "relativeStrengthScore",
    header: () => (
      <>
        <div className="text-right md:min-w-32 hidden md:block">시장대비 강도점수</div>
        <div className="text-right md:min-w-32 md:hidden">
          시장대비 <br /> 강도점수
        </div>
      </>
    ),
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
    header: () => <div className="text-right min-w-32">투자 주요지표</div>,
    cell: ({ row }) => <div className="text-right">{renderIndicators(row)}</div>,
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

export function LiveChart() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [tableData, setTableData] = useState<StockRankingApiResponse | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // 상세 정보 (모달 — 추후 재사용 시 openStockDetailModal 호출)
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectRow, setSelectRow] = useState({
    id: "",
    companyName: "",
    investmentIndicators: "",
    currentPrice: 0,
  });

  const openStockDetailModal = (row: StockRankingApiItem) => {
    setSelectRow({
      id: row.id,
      companyName: row.companyName,
      investmentIndicators: row.investmentIndicators,
      currentPrice: row.currentPrice,
    });
    setDetailOpen(true);
  };

  const openStockDetail = (row: StockRankingApiItem) => {
    if (STOCK_DETAIL_OPEN_MODE === "modal") {
      openStockDetailModal(row);
      return;
    }

    const pageTarget = resolveStockDetailPageTarget(STOCK_DETAIL_PAGE_TARGET, isMobile);

    if (pageTarget === "navigate") {
      navigate(getStockDetailUrl(row.id));
      return;
    }

    openStockDetailInNewTab(row.id);
  };

  //페이지 네이션 (데스크톱)
  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(DESKTOP_DEFAULT_PAGE_SIZE);

  //로딩 상태관리
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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

  const effectivePageSize = isMobile ? MOBILE_PAGE_SIZE : pageSize;

  const getColumnKey = (col: ColumnDef<StockRankingApiItem>) => {
    if ("accessorKey" in col && col.accessorKey != null) return String(col.accessorKey);
    if ("id" in col && col.id) return col.id;
    return undefined;
  };

  const activeColumns = useMemo(
    () =>
      columns.filter((col) => {
        if (!isMobile) return true;
        const key = getColumnKey(col);
        return key != null && MOBILE_COLUMN_KEYS.has(key);
      }),
    [isMobile],
  );

  const buildRequest = (filter: ChartFilterState, targetPage: number): GetRealTimeChartRequest => {
    const themes = filter.theme.map((t) => t?.code).filter((v): v is number => Boolean(v));

    return {
      marketType: filter.market === "0" ? "0" : filter.market,
      page: targetPage,
      pageSize: effectivePageSize,

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

  const fetchData = async (targetFilter: ChartFilterState, targetPage: number, options?: { append?: boolean }) => {
    const append = Boolean(options?.append && isMobile);

    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const requestBody = buildRequest(targetFilter, targetPage);

      const res = await getRealTimeChart(requestBody);

      setTableData((prev) => {
        if (append && prev) {
          return {
            ...res.data,
            stocks: [...prev.stocks, ...res.data.stocks],
          };
        }
        return res.data;
      });
      setUpdateTime(format(new Date(res.data.meta.lastUpdatedAt), "yyyy-MM-dd HH:mm:ss"));
      setDataDate(`${res.data.meta.queryStartDate}  ~  ${res.data.meta.queryEndDate}`);
      setIsError(false);
    } catch (error) {
      if (!append) {
        setIsError(true);
      }
      console.error("API 실패:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = async () => {
    if (!tableData || loadingMore || loading) return;

    const nextPage = tableData.page + 1;
    if (nextPage > tableData.totalPages) return;

    await fetchData(appliedFilter, nextPage, { append: true });
  };

  const hasMoreMobile = Boolean(isMobile && tableData && tableData.page < tableData.totalPages);

  const handleSearch = async (searchFilter?: ChartFilterState) => {
    const nextFilter = searchFilter ?? filter;

    setFilter(nextFilter);
    setAppliedFilter(nextFilter);
    setPage(1);

    // 모바일은 appliedFilter 변경 시 useEffect에서 조회
    if (!isMobile) {
      await fetchData(nextFilter, 1);
    }
  };

  const refetch = useCallback(async () => {
    if (loading || loadingMore) return;
    await fetchData(appliedFilter, isMobile ? 1 : page);
  }, [appliedFilter, page, loading, loadingMore, isMobile]);

  const lastReloadRef = useRef<string | null>(null);

  const handleMetricsUpdated = useCallback(
    (data: MetricsUpdatedPayload) => {
      if (data.tradeDate !== dataDate) return;
      if (lastReloadRef.current === data.tradeDate) return;

      lastReloadRef.current = data.tradeDate;
      refetch();
    },
    [dataDate, refetch],
  );

  useChartSocket(handleMetricsUpdated);

  useEffect(() => {
    if (isMobile) return;
    fetchData(appliedFilter, page);
  }, [page, pageSize, appliedFilter, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    fetchData(appliedFilter, 1);
  }, [appliedFilter, isMobile]);

  const table = useReactTable({
    data: tableData?.stocks ?? [],
    manualPagination: true,
    pageCount: tableData?.totalPages ?? -1,
    columns: activeColumns,
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
      <div className="w-full flex flex-col h-full relative">
        <ChartFilter filter={filter} setFilter={setFilter} onSearch={handleSearch} themeList={tableData?.themeList} />

        <div className="justify-between items-center py-4 hidden md:flex">
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
        <div className="flex flex-col gap-4 justify-between bg-white pt-4 shrink-0">
          <Table className={`${isMobile ? "w-full" : "min-w-max"}`}>
            <TableHeader className="bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="hover:bg-transparent">
                  {hg.headers.map((header) => (
                    <TableHead key={header.id} className={`text-muted-foreground! ${header.id === "rankHistory" ? "w-40 px-4" : null}`}>
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
                      <TableRow key={row.id} className="h-12.25" onClick={() => openStockDetail(row.original)}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className={cell.column.id === "companyName" ? "whitespace-normal text-slate-700" : "text-slate-700"}>
                            {cell.column.id === "theme" ? (
                              <div className="h-8 flex items-center justify-end" title={row.original.themeFull}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            ) : (
                              flexRender(cell.column.columnDef.cell, cell.getContext())
                            )}
                          </TableCell>
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
                  <Button onClick={() => fetchData(appliedFilter, isMobile ? 1 : page)} className="w-fit">
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
          {isMobile && hasMoreMobile ? (
            <div className="flex justify-center py-2">
              <Button type="button" variant="secondary" className="w-full" disabled={loadingMore} onClick={handleLoadMore}>
                {loadingMore ? "불러오는 중..." : "더보기"}
              </Button>
            </div>
          ) : null}
          {!isMobile && !loading && tableData?.totalCount && tableData?.totalCount > 0 ? (
            <Pagination className="justify-end hidden md:flex">
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
