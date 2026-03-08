"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";

import type { TableDetail, TableDetailItem, GraphDetail } from "@/types/api/chartDetails";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { subDays, subYears } from "date-fns";
import { getChartTableDetailData, getChartGraphDetailData } from "@/api/chartDetails";
import { TablePagination } from "@/components/TablePagination";
import DetailChartGraph from "./DetailChartGraph";

export default function DetailChart({ stockCode }: { stockCode: string }) {
  const [tableData, setTableData] = useState<TableDetail | null>(null);
  const [graphData, setGraphData] = useState<GraphDetail | null>(null);
  const [loading] = useState(false);

  // 차트 필터
  const minuteRef = useRef<HTMLButtonElement | null>(null);
  const [chartPeriod, setChartPeriod] = useState<"minute" | "day" | "week" | "month" | "year">("day");
  const [minuteOpen, setMinuteOpen] = useState(false);
  const [minutClick, setMinutClick] = useState(0);
  const [minute, setMinute] = useState("30");
  const minutes = ["1", "3", "5", "10", "15", "30", "60"];

  const handleChartPeriod = () => {
    if (minutClick === 0) {
      setMinuteOpen(false);
      setMinutClick((prev) => prev + 1);
      return;
    }
    if (minutClick === 1) {
      setMinuteOpen(true);
      setMinutClick(0);
      return;
    }
  };

  // 테이블 필터
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
      console.log("테이블 데이터 호출 오류", err);
    }
  };

  const getDetailGraph = async () => {
    const today = new Date();

    const periodMap = {
      minute: subDays(today, 1),
      day: subYears(today, 1),
      week: subYears(today, 5),
      month: subYears(today, 10),
      year: subYears(today, 30),
    };

    try {
      const res = await getChartGraphDetailData({
        stockCode,
        chartType: chartPeriod,
        interval: chartPeriod === "minute" ? minute : undefined,
        startDate: periodMap[chartPeriod].toISOString(),
        endDate: today.toISOString(),
      });

      if (res) {
        setGraphData(res);
      }
    } catch (err) {
      console.log("그래프 데이터 호출 오류", err);
    }
  };

  useEffect(() => {
    getDetailGraph();
  }, [chartPeriod, minute]);

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
      accessorKey: "changeRate",
      header: () => <div className="text-right">등락률</div>,
      cell: ({ row }) => {
        const value = String(row.getValue("changeRate") ?? "");
        const isNegative = value.startsWith("-") && value.length >= 2;
        const displayValue = value === "0.00" ? "0%" : value.length >= 2 && !isNegative ? `+${value}` : value;

        return <div className={`text-right ${value !== "-" && value !== "0.00" ? (isNegative ? "text-blue-500" : "text-rose-500") : ""}`}>{displayValue}</div>;
      },
    },
    {
      accessorKey: "volume",
      header: () => <div className="text-right">거래량(주)</div>,
      cell: ({ row }) => <div className="text-right">{(row.getValue("volume") as number)?.toLocaleString()}</div>,
    },
    {
      accessorKey: "tradingValue",
      header: () => <div className="text-right">거래대금</div>,
      cell: ({ row }) => <div className="text-right">{(row.getValue("tradingValue") as number)?.toLocaleString()}</div>,
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
      <div className="w-full py-2 flex flex-col gap-4">
        <div className="relative">
          <Tabs value={chartPeriod} onValueChange={(val) => setChartPeriod(val as "minute" | "day" | "week" | "month" | "year")}>
            <TabsList className="p-0.75">
              <TabsTrigger ref={minuteRef} className="w-17" value="minute" onClick={handleChartPeriod}>
                {minute}분 <ChevronDown className="ml-1 h-4 w-4" />
              </TabsTrigger>

              <TabsTrigger value="day">일</TabsTrigger>
              <TabsTrigger value="week">주</TabsTrigger>
              <TabsTrigger value="month">월</TabsTrigger>
              <TabsTrigger value="year">년</TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu open={minuteOpen} onOpenChange={setMinuteOpen}>
            <DropdownMenuTrigger className="sr-only">시간선택</DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-24 z-1001">
              <DropdownMenuRadioGroup
                value={minute}
                onValueChange={(val) => {
                  setMinute(val);
                  setChartPeriod("minute");
                  setMinuteOpen(false);
                }}
              >
                {minutes.map((m) => (
                  <DropdownMenuRadioItem value={m} key={m}>
                    {m === "60" ? "1시간" : `${m}분`}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DetailChartGraph data={graphData?.candles ?? []} chartPeriod={chartPeriod} />
      </div>

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
