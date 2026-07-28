import { useEffect, useState } from "react";

import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { getCoreRowModel, useReactTable, flexRender, type ColumnDef } from "@tanstack/react-table";

import IssueDetailModal from "./issueTheme/IssueDetailModal";
import { format } from "date-fns";

import { getIssueTheme } from "@/api/issueTheme";
import type { IssueThemeApiResponse, IssueTheme, StreakBadge } from "@/types/api/issueTheme";

import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { LoadingUi } from "@/components/LoadingUi";
import { getThemeIcon } from "@/utils/ThemeIcon";
import IssueThemeFilter from "./issueTheme/IssueThemeFilter";
import IssueDetailContent from "./issueTheme/IssueDetailContent";

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

export function IssueTheme() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [page] = useState(1);
  const [basicData, setBasicData] = useState<IssueThemeApiResponse>();
  const [rows, setRows] = useState<IssueThemeRow[]>([]);

  const isMobile = useIsMobile();

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectIssue, setSelectIssue] = useState<IssueTheme | null>();

  const mapToRows = (themes: IssueTheme[]): IssueThemeRow[] =>
    themes.map((item) => ({
      themeCode: item.themeCode,
      rank: String(item.rank),
      themeName: item.themeName,
      rsScore: item.rsScore,
      shortTermRs: item.shortTermRs,
      changeRate: item.changeRate,
      streakBadge: item.streakBadge,
      stats: [item.totalCount, item.risingCount, item.totalCount - item.risingCount, 0],
      original: item,
    }));

  // 전체 데이터 fetch (모바일/데스크탑 공통)
  const getIssueData = async () => {
    setIsLoading(true);
    try {
      const probe = await getIssueTheme(1, 1);
      const res = await getIssueTheme(probe.pagination.total, 1);
      setBasicData(res);
      setRows(mapToRows(res.items));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getIssueData();
  }, [page]);

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
      {basicData?.filterCounts && <IssueThemeFilter filterCounts={basicData.filterCounts} />}
      {!isMobile && (
        <div className="flex justify-between gap-4 mb-4">
          <div className="flex gap-2 items-center max-h-8 text-muted-foreground text-xs">
            <div className="bg-muted p-2 rounded-xs flex align-middle gap-1">
              <span>업데이트 일시 {basicData?.updatedAt ? format(new Date(basicData.updatedAt), "yyyy-MM-dd HH:mm:ss") : "-"}</span>
            </div>
            <span className="text-sm">전체 {basicData?.pagination.total ?? 0}건</span>
          </div>
        </div>
      )}

      <div className="w-full border-t h-full overflow-hidden">
        {/* 모바일: 전체 데이터 단일 테이블 */}
        <div className="md:hidden w-full">
          {isLoading ? (
            <LoadingUi boxStyle="h-[calc(100vh-195px)]!" />
          ) : (
            <Table>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="font-medium">
                  {hg.headers.map((header) => (
                    <TableHead key={header.id} className="z-10 bg-background text-muted-foreground">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
              <TableBody>{renderRows(table.getRowModel().rows)}</TableBody>
            </Table>
          )}
        </div>

        {/* 데스크탑: 단일 테이블 */}
        <div className="hidden md:flex w-full h-full overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center md:min-h-112.5">
              <LoadingUi message="이슈 테마 데이터를 불러오는 중입니다..." />
            </div>
          ) : (
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
                <div className="size-full max-w-150 bg-white relative overflow-y-auto">
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
      {detailOpen && selectIssue && <IssueDetailModal onClose={() => setDetailOpen(false)} selectIssue={selectIssue} />}
    </div>
  );
}
