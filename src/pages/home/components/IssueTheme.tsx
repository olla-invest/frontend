import { useEffect, useState, useRef, useCallback } from "react";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getCoreRowModel, useReactTable, flexRender, type ColumnDef } from "@tanstack/react-table";

import IssueDetailModal from "./issueTheme/IssueDetailModal";
import { format } from "date-fns";

import { getIssueTheme } from "@/api/issueTheme";
import type { IssueThemeApiResponse, IssueTheme } from "@/types/api/issueTheme";

import { useWatchThemeStore } from "@/store/WatchListStore";
import { toggleWatchThemeList, isInWatchThemeList } from "@/hooks/useToggleWatchList";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { LoadingUi } from "@/components/LoadingUi";

interface IssueThemeRow {
  themeCode: number;
  rank: string;
  themeName: string;
  stats: number[];
  original: IssueTheme;
}

export function IssueTheme() {
  const themeList = useWatchThemeStore((state) => state.themeList);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // 데스크탑용
  const [page] = useState(1);
  const [pageSize] = useState(40);
  const [basicData, setBasicData] = useState<IssueThemeApiResponse>();
  const [rows, setRows] = useState<IssueThemeRow[]>([]);

  // 모바일 무한스크롤용
  const isMobile = useIsMobile();
  const [mobilePage, setMobilePage] = useState(1);
  const [mobileRows, setMobileRows] = useState<IssueThemeRow[]>([]);
  const [mobileHasMore, setMobileHasMore] = useState(true);
  const [mobileLoading, setMobileLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectIssue, setSelectIssue] = useState<IssueTheme>();

  // 데스크탑 데이터 fetch
  const getIssueData = async () => {
    setIsLoading(true);
    try {
      // 1건만 불러서 total 파악
      const probe = await getIssueTheme(1, 1);
      // total 크기로 한 번에 전체 조회
      const res = await getIssueTheme(probe.total, 1);
      setBasicData(res);
      setRows(mapToRows(res.themes));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 모바일 데이터 fetch (누적)
  const getMobileData = useCallback(
    async (nextPage: number) => {
      if (mobileLoading || !mobileHasMore) return;
      try {
        setMobileLoading(true);
        const mobilePageSize = 20;
        const res = await getIssueTheme(mobilePageSize, nextPage);
        const mapped = mapToRows(res.themes);

        setMobileRows((prev) => [...prev, ...mapped]);
        setMobilePage(nextPage);

        // 더 불러올 데이터가 없으면 중단
        const totalLoaded = nextPage * mobilePageSize;
        if (totalLoaded >= res.total) setMobileHasMore(false);
      } catch (err) {
        console.log(err);
      } finally {
        setMobileLoading(false);
      }
    },
    [mobileLoading, mobileHasMore],
  );

  const mapToRows = (themes: IssueTheme[]): IssueThemeRow[] =>
    themes.map((item) => ({
      themeCode: item.themeCode,
      rank: String(item.rank),
      themeName: item.themeName,
      stats: [item.totalCount, item.risingCount, item.totalCount - item.risingCount, 0],
      original: item,
    }));

  // 데스크탑: page/pageSize 변경 시 fetch
  useEffect(() => {
    if (!isMobile) getIssueData();
  }, [page, pageSize, isMobile]);

  // 모바일: 첫 진입 시 1페이지 fetch
  useEffect(() => {
    if (isMobile) getMobileData(1);
  }, [isMobile]);

  // IntersectionObserver: 맨 아래 감지 → 다음 페이지 fetch
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          getMobileData(mobilePage + 1);
        }
      },
      { threshold: 0.5 },
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [isMobile, mobilePage, getMobileData]);

  const bookmarkColumn: ColumnDef<IssueThemeRow> = {
    id: "bookmark",
    header: "즐겨찾기",
    cell: ({ row }) => {
      const themeCode = row.original.themeCode;
      const isBookmarked = themeList && isInWatchThemeList(themeList, themeCode);
      return (
        <div className="w-8 flex justify-center">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              const success = await toggleWatchThemeList(themeCode);
              if (!success) return;
            }}
          >
            <i className={`icon ${isBookmarked ? "icon-star-fill" : "icon-star"}`} />
          </button>
        </div>
      );
    },
  };

  const columns: ColumnDef<IssueThemeRow>[] = [
    ...(!isMobile ? [bookmarkColumn] : []),
    {
      accessorKey: "rank",
      header: "순위",
      cell: ({ row }) => <div className="w-7.5 md:w-8">{row.original.rank}</div>,
    },
    {
      id: "themeName",
      accessorKey: "themeName",
      header: "테마명",
      cell: ({ row }) => <div className="w-30 line-clamp-2 text-slate-800 font-semibold">{row.getValue("themeName")}</div>,
    },
    {
      accessorKey: "stats",
      header: "현황",
      cell: ({ row }) => {
        const value = row.getValue("stats") as number[];
        return (
          <div className="flex items-center text-sm md:min-w-50">
            <span className="md:block hidden">{value[0]}개중</span>
            <span className="text-red-500 ml-2">{value[1]}</span>상승
            <span className="text-muted-foreground ml-2">{value[2]}</span>보합
            <span className="text-blue-500 ml-2">{value[3]}</span>하락
          </div>
        );
      },
    },
  ];

  // 데스크탑용 테이블
  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });
  // 모바일용 테이블
  const mobileTable = useReactTable({ data: mobileRows, columns, getCoreRowModel: getCoreRowModel() });

  const allRows = table.getRowModel().rows;
  const leftRows = allRows.filter((_, i) => i % 2 === 0);
  const rightRows = allRows.filter((_, i) => i % 2 === 1);

  const renderRows = (rowList: ReturnType<typeof table.getRowModel>["rows"]) =>
    rowList.map((row) => (
      <TableRow
        key={row.id}
        className="h-12.25 flex items-center"
        onClick={() => {
          document.createElement("div");

          if (!isMobile) {
            setDetailOpen(true);
            setSelectIssue(row.original.original);
          } else {
            navigate(`/themeDetail/${row.original.themeCode}`, { state: { theme: row.original.original } });
          }
        }}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className={cell.column.id === "themeName" ? "whitespace-normal w-full" : ""}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));

  return (
    <div className="flex flex-col md:h-[calc(100%-36px)]">
      <div className="flex justify-between gap-4 mb-4">
        <div className="flex gap-2 items-center max-h-8 text-muted-foreground text-xs">
          <div className="bg-muted p-2 rounded-sm flex align-middle gap-1">
            <span>업데이트 일시 {basicData?.updatedAt ? format(new Date(basicData.updatedAt), "yyyy-MM-dd HH:mm:ss") : "-"}</span>
          </div>
          <span className="text-sm">전체 {basicData?.total ?? 0}건</span>
        </div>
      </div>

      <div className="overflow-x-auto w-full border-t md:border-t-0">
        {/* 모바일: 무한 스크롤 단일 테이블 */}
        <div className="md:hidden w-full">
          {isLoading ? (
            <LoadingUi boxStyle="h-[calc(100vh-195px)]!" />
          ) : (
            <>
              <Table>
                <TableBody>{renderRows(mobileTable.getRowModel().rows)}</TableBody>
              </Table>
              {/* 감지 타겟 */}
              <div ref={observerRef} className="h-10 flex items-center justify-center">
                {mobileLoading && <span className="text-muted-foreground text-sm">불러오는 중...</span>}
              </div>
            </>
          )}
        </div>

        {/* 데스크탑: 2컬럼 */}
        <div className="hidden md:flex w-full md:min-h-112.5">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center md:min-h-112.5">
              <LoadingUi message="이슈 테마 데이터를 불러오는 중입니다..." />
            </div>
          ) : (
            <>
              <Table className="flex-1">
                <TableBody>{renderRows(leftRows)}</TableBody>
              </Table>
              <Table className="flex-1">
                <TableBody>{renderRows(rightRows)}</TableBody>
              </Table>
            </>
          )}
        </div>
      </div>

      {detailOpen && selectIssue && <IssueDetailModal onClose={() => setDetailOpen(false)} selectIssue={selectIssue} />}
    </div>
  );
}
