"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { TableDetail, TableDetailItem } from "@/types/api/chartDetails";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { subDays } from "date-fns";
import { getChartTableDetailData } from "@/api/ChartDetails";
import { TablePagination } from "@/components/TablePagination";

export default function DetailChart({ stockCode }: { stockCode: string }) {
  const [tableData, setTableData] = useState<TableDetail | null>(null);
  const [loading] = useState(false);

  const [period, setPeriod] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const getDetailTable = async () => {
    try {
      const res = await getChartTableDetailData({
        stockCode,
        startDate: period.from.toISOString(),
        endDate: period.to.toISOString(),
      });

      if (res) {
        setTableData(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDetailTable();
  }, [period]);

  const columns: ColumnDef<TableDetailItem>[] = [
    {
      accessorKey: "time",
      header: () => <div>일자</div>,
      cell: ({ row }) => <div className="text-slate-700">{row.getValue("time")}</div>,
    },
    {
      accessorKey: "close",
      header: () => <div className="text-right">종가</div>,
      cell: ({ row }) => <div className="text-right font-semibold text-slate-800">{(row.getValue("close") as number)?.toLocaleString()}</div>,
    },
    {
      accessorKey: "isHighPrice",
      header: () => <div className="text-right">등락률</div>,
      cell: ({ row }) => <div className="text-right">{row.getValue("isHighPrice")}</div>,
    },
    {
      accessorKey: "volume",
      header: () => <div className="text-right">거래량(주)</div>,
      cell: ({ row }) => <div className="text-right">{(row.getValue("volume") as number)?.toLocaleString()}</div>,
    },
    {
      accessorKey: "volume",
      header: () => <div className="text-right">거래대금</div>,
      cell: ({ row }) => <div className="text-right">{(row.getValue("volume") as number)?.toLocaleString()}</div>,
    },
    {
      accessorKey: "open",
      header: () => <div className="text-right">시가</div>,
      cell: ({ row }) => <div className="text-right">{(row.getValue("open") as number)?.toLocaleString()}</div>,
    },
    {
      accessorKey: "high",
      header: () => <div className="text-right">고가</div>,
      cell: ({ row }) => <div className="text-right">{(row.getValue("high") as number)?.toLocaleString()}</div>,
    },
    {
      accessorKey: "low",
      header: () => <div className="text-right">저가</div>,
      cell: ({ row }) => <div className="text-right">{(row.getValue("low") as number)?.toLocaleString()}</div>,
    },
  ];

  const table = useReactTable({
    data: tableData?.candles ?? [],
    columns,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading
              ? null
              : table.getRowModel().rows.length
                ? table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="h-12">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : null}
          </TableBody>
        </Table>

        {table.getPageCount() > 1 && <TablePagination table={table} />}
      </div>
    </div>
  );
}
