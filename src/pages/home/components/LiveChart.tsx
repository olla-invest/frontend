"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, CircleCheckIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useExcelDownload } from "@/hooks/useExcelDownload";

import ChartFilter from "./ChartFilter";
import type { StockRankingApiResponse, StockRankingApiItem } from "@/types/api/stocks";
import InvestmentIndicatorGuide from "./InvestmentIndicatorGuideDialog";

interface Props {
  tableData: StockRankingApiResponse | null;
}

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

export function LiveChart({ tableData }: Props) {
  console.log(tableData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: tableData?.stocks ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const { downloadAll } = useExcelDownload(table, {
    fileName: "실시간_주식_랭킹.csv",
  });

  return (
    <div className="w-full flex flex-col h-full">
      <ChartFilter />

      <div className="flex justify-between items-center py-4">
        <div className="flex gap-2 items-center max-h-8 text-muted-foreground text-xs">
          <div className="bg-muted p-2 rounded-sm flex align-middle gap-1">
            <span>조회기간:</span>
            <span>- ~ - (- -:-:- 업데이트)</span>
          </div>
          <span className="text-sm">전체 {tableData?.stocks.length}건</span>
        </div>
        <div className="flex gap-2 items-center max-h-8">
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <i className="icon icon-info" />
                  투자 주요지표 안내
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-lg md:max-w-2xl">
                <InvestmentIndicatorGuide />
              </DialogContent>
            </form>
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
                  <DropdownMenuCheckboxItem key={size} checked={table.getState().pagination.pageSize === size} onCheckedChange={() => table.setPageSize(size)}>
                    {size}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100%-164px)]">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-end gap-2 pt-4">
          <Button size="sm" variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            이전
          </Button>
          <Button size="sm" variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
