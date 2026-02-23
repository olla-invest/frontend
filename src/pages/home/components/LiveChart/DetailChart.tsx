import { useState } from "react";
import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { StockRankingApiResponse, StockRankingApiItem } from "@/types/api/stocks";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { subDays } from "date-fns";

export default function DetailChart() {
  const [tableData] = useState<StockRankingApiResponse | null>(null);
  const [loading] = useState(false);

  const [period, setPeriod] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  //페이지 네이션
  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(10);

  const columns: ColumnDef<StockRankingApiItem>[] = [
    {
      accessorKey: "exchange",
      header: () => <div>일자</div>,
      cell: ({ row }) => <div className="text-slate-700">{row.getValue("exchange")}</div>,
    },
    {
      accessorKey: "relativeStrengthScore",
      header: () => <div className="text-right">종가</div>,
      cell: ({ row }) => <div className="text-right font-semibold text-slate-800">{row.getValue("relativeStrengthScore")}</div>,
    },
    {
      accessorKey: "isHighPrice",
      header: () => <div className="text-right">등락률</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("isHighPrice")}</div>,
    },
    {
      id: "investmentIndicatorsDtl",
      header: () => <div className="text-right">거래량(주)</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("investmentIndicatorsDtl")}</div>,
    },
    {
      accessorKey: "theme",
      header: () => <div className="text-right">거래대금</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("theme")}</div>,
    },
    {
      accessorKey: "theme",
      header: () => <div className="text-right">시가</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("theme")}</div>,
    },
    {
      accessorKey: "theme",
      header: () => <div className="text-right">고가</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("theme")}</div>,
    },
    {
      accessorKey: "theme",
      header: () => <div className="text-right">저가</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("theme")}</div>,
    },
  ];

  const table = useReactTable({
    data: tableData?.stocks ?? [],
    manualPagination: true,
    pageCount: tableData?.totalPages ?? -1,
    columns,
    state: {
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
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-[378.59px] rounded-md border">그래프 영역</div>
      <div className="py-2">
        <div className="flex justify-between items-center mb-4">
          <span className="text-foreground font-medium">시세 변동 현황</span>
          <DatePickerWithRange period={period} setPeriod={setPeriod} />
        </div>

        <Table>
          <TableHeader className="sticky top-0 left-0 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)] shrink-0">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className={`text-muted-foreground!`}>
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
                    <TableRow key={row.id} className="h-12.25">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-slate-700 text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
