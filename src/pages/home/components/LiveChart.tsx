"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import ChartFilter from "./ChartFilter";

const data: StockRow[] = [
  {
    id: "stk-001",
    rank: 1,
    companyName: "삼성전자",
    currentPrice: 72800,
    exchange: "KOSPI",
    relativeStrengthScore: 92,
    isHighPrice: true,
    investmentIndicators: "변동성 축소",
    investmentIndicatorsDtl: "강도 지속(7/10)",
    theme: "반도체",
    rankChange3Days: [1, 2, 1],
  },
  {
    id: "stk-002",
    rank: 2,
    companyName: "SK하이닉스",
    currentPrice: 184500,
    exchange: "KOSPI",
    relativeStrengthScore: 88,
    isHighPrice: false,
    investmentIndicators: "변동성 축소",
    investmentIndicatorsDtl: "강도 지속(7/10)",
    theme: "AI · 반도체",
    rankChange3Days: [2, 1, 3],
  },
  {
    id: "stk-003",
    rank: 3,
    companyName: "에코프로비엠",
    currentPrice: 241000,
    exchange: "KOSDAQ",
    relativeStrengthScore: 81,
    isHighPrice: false,
    investmentIndicators: "변동성 축소",
    investmentIndicatorsDtl: "강도 지속(7/10)",
    theme: "2차전지",
    rankChange3Days: [1, 2, 1],
  },
  {
    id: "stk-004",
    rank: 4,
    companyName: "LG에너지솔루션",
    currentPrice: 412000,
    exchange: "KOSPI",
    relativeStrengthScore: 85,
    isHighPrice: true,
    investmentIndicators: "변동성 축소",
    investmentIndicatorsDtl: "강도 지속(7/10)",
    theme: "2차전지",
    rankChange3Days: [1, 2, 1],
  },
  {
    id: "stk-005",
    rank: 5,
    companyName: "카카오",
    currentPrice: 58200,
    exchange: "KOSPI",
    relativeStrengthScore: 74,
    isHighPrice: false,
    investmentIndicators: "변동성 축소",
    investmentIndicatorsDtl: "강도 지속(7/10)",
    theme: "플랫폼",
    rankChange3Days: [1, 2, 1],
  },
];

export interface StockRow {
  id: string;
  rank: number;
  companyName: string;
  currentPrice: number;
  exchange: "KOSPI" | "KOSDAQ";
  relativeStrengthScore: number;
  isHighPrice: boolean;
  investmentIndicators: string;
  investmentIndicatorsDtl: string;
  theme: string;
  rankChange3Days: number[];
}

const columns: ColumnDef<StockRow>[] = [
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
    cell: ({ row }) => (
      <div>
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
    accessorKey: "investmentIndicators",
    header: "투자 중요지표",
    cell: ({ row }) => {
      const { investmentIndicators, investmentIndicatorsDtl } = row.original;

      return (
        <div>
          <div>{investmentIndicators}</div>
          <div>{investmentIndicatorsDtl}</div>
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
      <div className="flex flex-col item text-center">
        <span className="text-xs">최근 3일 순위변동</span>
        <div className="flex">
          <span className="flex-1">D-1</span>
          <span className="flex-1">D-2</span>
          <span className="flex-1">D-3</span>
        </div>
      </div>
    ),
    cell: ({ row }) => {
      const values = (row.getValue("rankChange3Days") as number[]) ?? [];

      return (
        <div className="flex">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex-1 text-center">
              {values[i] !== undefined ? `${values[i]}` : "-"}
            </span>
          ))}
        </div>
      );
    },
  },
];

export function LiveChart() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <ChartFilter />
      <div className="flex justify-between items-center py-4">
        <div className="flex gap-2 items-center max-h-8 text-muted-foreground text-xs">
          <div className="bg-muted p-2 rounded-sm flex align-middle gap-1">
            <span>조회기간:</span>
            <span>2026-01-01 ~ 2026-01-14 (2026-01-14 22:47:12 업데이트)</span>
          </div>
          <span className="text-sm">전체 2,100건</span>
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
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="name-1">Name</Label>
                    <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                  </Field>
                  <Field>
                    <Label htmlFor="username-1">Username</Label>
                    <Input id="username-1" name="username" defaultValue="@peduarte" />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
          <Button variant="outline" size="sm">
            <DownloadIcon />
            엑셀 다운로드
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                10 <ChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-35">
              <DropdownMenuGroup>
                {[10, 20, 30, 50].map((size) => (
                  <DropdownMenuCheckboxItem
                    key={size}
                    checked={table.getState().pagination.pageSize === size}
                    onCheckedChange={() => {
                      table.setPageSize(size);
                      table.setPageIndex(0);
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
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-muted-foreground text-sm" key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            이전
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
