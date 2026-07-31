import { useEffect, useMemo, useRef, useState } from "react";

import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { getCoreRowModel, useReactTable, flexRender, type ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";

import { getIssueTheme } from "@/api/issueTheme";
import type { IssueThemeApiResponse, IssueTheme, StreakBadge } from "@/types/api/issueTheme";

import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { LoadingUi } from "@/components/LoadingUi";
import { getThemeIcon } from "@/utils/ThemeIcon";
import IssueThemeFilter, { type IssueThemeFilterType } from "./issueTheme/IssueThemeFilter";
import IssueDetailContent from "./issueTheme/IssueDetailContent";
import TreeMapView from "./issueTheme/TreeMapView";

interface IssueThemeRow {
  themeCode: number;
  rank: string;
  themeName: string;
  stats: number[];
  rsScore: number | null;
  shortTermRs: number | null;
  changeRate: number | null;
  streakBadge: StreakBadge | null;
  original: IssueTheme;
}

// 개별 필터 옵션 하나가 item에 대해 참/거짓인지 판단
const matchesOption = (item: IssueTheme, key: string): boolean => {
  switch (key) {
    case "rs":
      return (item.rsScore ?? 0) >= 80;
    case "theme":
      return (item.stockCount ?? 0) >= 5;
    case "rate5":
      return (item.changeRate ?? 0) >= 5;
    case "highPrice":
      return (item.newHighCount ?? 0) > 0;
    default:
      return true;
  }
};

// 검색어와 일치하는 부분을 하이라이트
const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
};

export function IssueTheme() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [basicData, setBasicData] = useState<IssueThemeApiResponse>();
  const [items, setItems] = useState<IssueTheme[]>([]);

  const isMobile = useIsMobile();

  const [selectIssue, setSelectIssue] = useState<IssueTheme | null>();
  const [filterValue, setFilterValue] = useState<IssueThemeFilterType>({
    viewType: "rank",
    sortType: "rs",
    filterOption: ["all"],
    isFavorite: false,
  });

  // 검색 관련 state - API 호출 없이 이미 불러온 items 안에서 자동완성 처리
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // 전체 데이터 fetch (모바일/데스크탑 공통)
  const getIssueData = async () => {
    setIsLoading(true);
    try {
      const probe = await getIssueTheme(1, 1);
      const res = await getIssueTheme(probe.pagination.total, 1);
      setBasicData(res);
      setItems(res.items);
      if (res.items && res.items.length > 0) {
        setSelectIssue(res.items[0]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getIssueData();
  }, []);

  // 바깥 클릭 시 자동완성 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setSuggestOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // items 안에서 테마명 기준 자동완성 후보 계산
  const suggestions = useMemo(() => {
    const q = search.trim();
    if (!q) return [];
    return items.filter((item) => item.themeName.toLowerCase().includes(q.toLowerCase())).slice(0, 10);
  }, [items, search]);

  const commitSearch = (value?: string) => {
    const v = value !== undefined ? value : search;
    setSearchTerm(v.trim());
  };

  const handleSelectSuggestion = (item: IssueTheme) => {
    setSearch(item.themeName);
    setSearchTerm(item.themeName);
    setSuggestOpen(false);
    setSelectIssue(item);
  };

  // 필터/검색/정렬이 적용된 최종 목록
  const filteredItems = useMemo(() => {
    const activeKeys = filterValue.filterOption.filter((k) => k !== "all");

    let result = items.filter((item) => {
      // 전체가 선택되어 있으면 개별 조건은 건너뜀
      const passesOptionFilters = filterValue.filterOption.includes("all") || activeKeys.every((key) => matchesOption(item, key));
      const passesMyTheme = !filterValue.isFavorite || item.isFavorite;
      const passesSearch = !searchTerm || item.themeName.toLowerCase().includes(searchTerm.toLowerCase());

      return passesOptionFilters && passesMyTheme && passesSearch;
    });

    result = [...result].sort((a, b) => {
      if (filterValue.sortType === "momentum") {
        return (b.momentum ?? 0) - (a.momentum ?? 0);
      }
      if (filterValue.sortType === "rate") {
        return (b.changeRate ?? 0) - (a.changeRate ?? 0);
      }
      return (b.rsScore ?? 0) - (a.rsScore ?? 0);
    });

    return result;
  }, [items, filterValue, searchTerm]);

  const rows: IssueThemeRow[] = useMemo(
    () =>
      filteredItems.map((item) => ({
        themeCode: item.themeCode,
        rank: String(item.rank),
        themeName: item.themeName,
        rsScore: item.rsScore,
        shortTermRs: item.shortTermRs,
        changeRate: item.changeRate,
        streakBadge: item.streakBadge,
        stats: [item.totalCount, item.risingCount, item.totalCount - item.risingCount, 0],
        original: item,
      })),
    [filteredItems],
  );

  const columns: ColumnDef<IssueThemeRow>[] = [
    {
      accessorKey: "rank",
      header: "순위",
      cell: ({ row }) => <div className="w-7.5 md:w-8">{row.original.rank}</div>,
    },
    {
      id: "themeName",
      accessorKey: "themeName",
      header: "테마명",
      cell: ({ row }) => (
        <div className="flex md:items-center gap-2 md:w-60 w-30 md:flex-row flex-col items-start">
          {!isMobile && (
            <div className="size-8 rounded-md bg-[#D9D9D9] overflow-hidden shrink-0">
              <img src={getThemeIcon(row.original.themeCode)} alt={row.original.themeName} className="w-full" />
            </div>
          )}
          <div className="w-30 md:w-full line-clamp-2 md:line-clamp-1 text-slate-800 font-semibold">{row.getValue("themeName")}</div>
          {row.original.streakBadge && (
            <div
              className={`shrink-0 py-0.5 px-2 border rounded-lg text-xs font-medium ${row.original.streakBadge.tone === "RED" ? "text-rose-500" : row.original.streakBadge.tone === "BLUE" ? "text-blue-500" : "text-muted-foreground"}`}
            >
              {row.original.streakBadge.direction === "STRONG" && <i className="icon icon-arrow-up" />}
              {row.original.streakBadge.direction === "WEAK" && <i className="icon icon-arrow-down" />}
              {row.original.streakBadge.days || "-"}일
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "rsScore",
      header: "RS 점수",
      cell: ({ row }) => {
        return <div className="md:w-16 w-12 text-right">{row.original.rsScore}</div>;
      },
    },
    {
      accessorKey: "shortRs",
      header: "단기 RS",
      cell: ({ row }) => {
        if (isMobile) {
          return;
        } else {
          return <div className="w-16 text-right">{row.original.shortTermRs}</div>;
        }
      },
    },
    {
      accessorKey: "upDown",
      header: "등락률",
      cell: ({ row }) => {
        const rate = row.original.changeRate ?? 0;
        const colorClass = rate > 0 ? "text-rose-500" : rate < 0 ? "text-blue-500" : "text-muted-foreground";

        return <div className={`md:w-20 w-16 text-right ${colorClass}`}>{row.original.changeRate ?? "-"}%</div>;
      },
    },
    {
      accessorKey: "stockList",
      header: "주요종목",
      cell: () => {
        if (isMobile) {
          return <div className="w-0" />;
        } else {
          return <div className="text-slate-700">-</div>;
        }
      },
    },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      // 모바일: 순위 | 테마명 | RS 점수 | 등락률 만 노출
      columnVisibility: isMobile ? { shortRs: false, stockList: false } : {},
    },
  });

  const renderRows = (rowList: ReturnType<typeof table.getRowModel>["rows"]) =>
    rowList.map((row) => (
      <TableRow
        key={row.id}
        className="h-12.25"
        onClick={() => {
          if (!isMobile) {
            setSelectIssue(row.original.original);
          } else {
            navigate(`/themeDetail/${row.original.themeCode}`, { state: { theme: row.original.original } });
          }
        }}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className={cell.column.id === "themeName" ? "whitespace-normal w-60" : cell.column.id === "stockList" ? "md:w-full w-fit" : ""}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));

  return (
    <div className="flex flex-col md:h-[calc(100vh-204px)] h-full">
      {basicData?.filterCounts && <IssueThemeFilter filterCounts={basicData.filterCounts} value={filterValue} onChange={setFilterValue} />}
      <div className="flex justify-between gap-4 mb-4">
        {filterValue.viewType === "rank" && (
          <div className="flex gap-2 items-center max-h-8 w-full">
            <div className="relative w-full max-w-80" ref={searchWrapperRef}>
              <InputGroup className={`h-8 w-full ${suggestOpen && search.trim().length > 0 ? "rounded-b-none border-b-0" : ""}`}>
                <InputGroupAddon align="inline-start" className="mr-0!">
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                    }}
                    className="cursor-pointer mb-1"
                  >
                    <i className="icon icon-search" />
                  </button>
                </InputGroupAddon>
                <input
                  placeholder="테마명을 검색해주세요 (예 : AI, 2차전지 등)"
                  className="text-sm text-foreground placeholder:text-muted-foreground w-full"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSuggestOpen(true);
                  }}
                  onFocus={() => {
                    setSuggestOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitSearch();
                      setSuggestOpen(false);
                    } else if (e.key === "Escape") {
                      setSuggestOpen(false);
                    }
                  }}
                  value={search}
                />
                {search.length > 0 && (
                  <InputGroupAddon align="inline-end" className="mr-0!">
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setSearchTerm("");
                        setSuggestOpen(false);
                      }}
                      className="cursor-pointer mb-1"
                    >
                      <i className="icon icon-circle-x" />
                    </button>
                  </InputGroupAddon>
                )}
              </InputGroup>

              {suggestOpen && search.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 p-1 z-20 bg-white border rounded-md rounded-t-none shadow-md max-h-80 overflow-y-auto">
                  <div className="flex flex-col">
                    <span className="py-1.5 px-2 text-xs text-muted-foreground font-medium">검색결과 - 테마명 '{search}'</span>
                    {suggestions.length > 0 ? (
                      suggestions.map((item) => (
                        <button
                          type="button"
                          key={item.themeCode}
                          onClick={() => handleSelectSuggestion(item)}
                          className="w-full rounded-sm flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted cursor-pointer"
                        >
                          <span className="flex-1 truncate text-slate-800">{highlightMatch(item.themeName, search)}</span>
                          <span className="text-popover-foreground text-sm shrink-0">
                            RS {item.rsScore ?? "-"} · {item.rank}위
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-sm text-muted-foreground text-center">검색 결과가 없습니다.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {!isMobile && (
          <div className="flex gap-2 items-center max-h-8 text-muted-foreground text-xs shrink-0">
            <div className="bg-muted p-2 rounded-md flex align-middle gap-1">
              <span>업데이트 일시 {basicData?.updatedAt ? format(new Date(basicData.updatedAt), "yyyy-MM-dd HH:mm:ss") : "-"}</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full h-full overflow-hidden">
        {/* 모바일: 전체 데이터 단일 테이블 */}
        <div className="md:hidden w-full">
          {isLoading ? (
            <LoadingUi boxStyle="h-[calc(100vh-195px)]!" />
          ) : filterValue.viewType === "rank" ? (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="font-medium">
                    {hg.headers.map((header) => (
                      <TableHead key={header.id} className="z-10 bg-background text-muted-foreground">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>{renderRows(table.getRowModel().rows)}</TableBody>
            </Table>
          ) : (
            <div className="flex-1 h-screen overflow-hidden rounded-md">
              <TreeMapView
                items={filteredItems}
                onSelect={(item) => {
                  navigate(`/themeDetail/${item.themeCode}`, { state: { theme: item } });
                }}
              />
            </div>
          )}
        </div>

        {/* 데스크탑: 단일 테이블 */}
        <div className="hidden md:flex w-full h-full overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center md:min-h-112.5">
              <LoadingUi message="이슈 테마 데이터를 불러오는 중입니다..." />
            </div>
          ) : filterValue.viewType === "rank" ? (
            <div className="flex w-full pt-2">
              <div className="flex-1 pr-4 overflow-y-auto">
                <Table className="relative">
                  <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id} className="hover:bg-transparent">
                        {hg.headers.map((header) => (
                          <TableHead key={header.id} className={`text-muted-foreground!`}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>

                  <TableBody>{renderRows(table.getRowModel().rows)}</TableBody>
                </Table>
              </div>
              {selectIssue && (
                <div className="size-full max-w-150 bg-white relative overflow-y-auto border-l">
                  <button
                    className="absolute right-0 top-1"
                    onClick={() => {
                      setSelectIssue(null);
                    }}
                  >
                    <i className="icon icon-x-large" />
                  </button>
                  <IssueDetailContent selectIssue={selectIssue} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex w-full pt-2 gap-6">
              <div className="flex-1 overflow-hidden  rounded-md">
                <TreeMapView items={filteredItems} onSelect={setSelectIssue} />
              </div>
              {selectIssue && (
                <div className="size-full max-w-150 bg-white relative overflow-y-auto border-l">
                  <button
                    className="absolute right-0 top-1"
                    onClick={() => {
                      setSelectIssue(null);
                    }}
                  >
                    <i className="icon icon-x-large" />
                  </button>
                  <IssueDetailContent selectIssue={selectIssue} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
