import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCoreRowModel, useReactTable, flexRender, type ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import IssueDetailModal from "./issueTheme/IssueDetailModal";
import { IssueThemePagination } from "./issueTheme/IssueThemePagination";
import { format } from "date-fns";

import { getIssueTheme } from "@/api/issueTheme";
import type { IssueThemeApiResponse, IssueTheme } from "@/types/api/issueTheme";

interface IssueThemeRow {
  themeCode: number;
  rank: string;
  themeName: string;
  stats: number[];
  original: IssueTheme;
}

export function IssueTheme() {
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [basicData, setBasicData] = useState<IssueThemeApiResponse>();
  const [leftRows, setLeftRows] = useState<IssueThemeRow[]>([]);
  const [rightRows, setRightRows] = useState<IssueThemeRow[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectIssue, setSelectIssue] = useState<IssueTheme>();

  const getIssueData = async () => {
    try {
      const res = await getIssueTheme(pageSize * 2, page);

      const mapped: IssueThemeRow[] = res.themes.map((item) => ({
        themeCode: item.themeCode,
        rank: String(item.rank),
        themeName: item.themeName,
        stats: [item.totalCount, item.risingCount, item.totalCount - item.risingCount, 0],
        original: item,
      }));

      const left = mapped.slice(0, pageSize);
      const right = mapped.slice(pageSize, pageSize * 2);

      setLeftRows(left);
      setRightRows(right);
      setBasicData(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getIssueData();
  }, [page, pageSize]);

  const columns: ColumnDef<IssueThemeRow>[] = [
    {
      id: "bookmark",
      header: "즐겨찾기",
      cell: ({ row }) => {
        const themeCode = row.original.themeCode;
        const isBookmarked = bookmarks[themeCode];

        return (
          <div className="w-8 flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setBookmarks((prev) => ({
                  ...prev,
                  [themeCode]: !prev[themeCode],
                }));
              }}
            >
              <i className={`icon ${isBookmarked ? "icon-star-fill" : "icon-star"}`} />
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: "rank",
      header: "순위",
      cell: ({ row }) => {
        return <div className="w-8">{row.original.rank}</div>;
      },
    },
    {
      id: "themeName",
      accessorKey: "themeName",
      header: "테마명",
      cell: ({ row }) => <div className="w-full truncate text-slate-800 font-semibold">{row.getValue("themeName")}</div>,
    },
    {
      accessorKey: "stats",
      header: "현황",
      cell: ({ row }) => {
        const value = row.getValue("stats") as number[];
        return (
          <div className="flex items-center text-sm min-w-50">
            {value[0]}개중
            <span className="text-red-500 ml-2">{value[1]}</span>상승
            <span className="text-muted-foreground ml-2">{value[2]}</span>보합
            <span className="text-blue-500 ml-2">{value[3]}</span>하락
          </div>
        );
      },
    },
  ];

  const leftTable = useReactTable({
    data: leftRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rightTable = useReactTable({
    data: rightRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col h-[calc(100%-36px)]">
      <div className="flex justify-between gpa-4 mb-4">
        <div className="flex gap-2 items-center max-h-8 text-muted-foreground text-xs">
          <div className="bg-muted p-2 rounded-sm flex align-middle gap-1">
            <span>조회기간: --</span>
            <span>
              ({basicData?.updatedAt ? format(new Date(basicData.updatedAt), "yyyy-MM-dd HH:mm:ss") : "-"}
              업데이트)
            </span>
          </div>
          <span className="text-sm">전체 {basicData?.total ?? 0}건</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {pageSize}
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
      <div className="flex overflow-x-auto">
        <div className="grid grid-cols-2 h-full w-full">
          {/* 왼쪽 */}
          <Table>
            <TableBody>
              {leftTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="h-12.25 flex"
                  onClick={() => {
                    setDetailOpen(true);
                    setSelectIssue(row.original.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.id === "themeName" ? "w-full" : ""}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 오른쪽 */}
          <Table>
            <TableBody>
              {rightTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="h-12.25 flex"
                  onClick={() => {
                    setDetailOpen(true);
                    setSelectIssue(row.original.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.id === "themeName" ? "w-full" : ""}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-muted-foreground shrink-0 mt-4">이슈 테마에 포함된 종목은 실시간 차트에서 조회되는 종목에 한해 제공됩니다.</p>
        <IssueThemePagination page={page} total={basicData?.total ?? 0} pageSize={pageSize} onChange={(next) => setPage(next)} />
      </div>

      {detailOpen && selectIssue && <IssueDetailModal onClose={() => setDetailOpen(false)} selectIssue={selectIssue} />}
    </div>
  );
}
