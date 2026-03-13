import { useState } from "react";
import { TablePagination } from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, useReactTable, flexRender, type ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import IssueDetailModal from "./issueTheme/IssueDetailModal";

interface Invoice {
  invoice: boolean;
  paymentStatus: string;
  totalAmount: string;
  paymentMethod: number[];
}

const invoices: Invoice[] = [
  {
    invoice: false,
    paymentStatus: "1",
    totalAmount: "테마명",
    paymentMethod: [34, 28, 2, 4],
  },
  {
    invoice: false,
    paymentStatus: "1",
    totalAmount: "테마명",
    paymentMethod: [34, 28, 2, 4],
  },
  {
    invoice: false,
    paymentStatus: "1",
    totalAmount: "테마명",
    paymentMethod: [34, 28, 2, 4],
  },
  {
    invoice: false,
    paymentStatus: "1",
    totalAmount: "테마명",
    paymentMethod: [34, 28, 2, 4],
  },
  {
    invoice: false,
    paymentStatus: "1",
    totalAmount: "테마명",
    paymentMethod: [34, 28, 2, 4],
  },
  {
    invoice: false,
    paymentStatus: "1",
    totalAmount: "테마명",
    paymentMethod: [34, 28, 2, 4],
  },
  {
    invoice: false,
    paymentStatus: "1",
    totalAmount: "테마명",
    paymentMethod: [34, 28, 2, 4],
  },
  {
    invoice: false,
    paymentStatus: "1",
    totalAmount: "온실가스(탄소배출권)/탄소 포집·활용·저장(CCUS)",
    paymentMethod: [34, 28, 2, 4],
  },
  {
    invoice: false,
    paymentStatus: "1",
    totalAmount: "스마트그리드(지능형전력망)",
    paymentMethod: [34, 28, 2, 4],
  },
  {
    invoice: false,
    paymentStatus: "100",
    totalAmount: "컴퓨터와 주변기기",
    paymentMethod: [34, 28, 2, 4],
  },
];

export function IssueTheme() {
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tableData] = useState();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectIssue, setSelectIssue] = useState<any>(null);

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoice",
      header: "Invoice",
      cell: ({ row }) => {
        const id = row.index;
        const isBookmarked = bookmarks[id];

        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBookmarks((prev) => ({
                ...prev,
                [id]: !prev[id],
              }));
            }}
          >
            <i className={`icon ${isBookmarked ? "icon-star-fill" : "icon-star"}`} />
          </button>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Status",
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => <div className="truncate max-w-[288px] text-slate-800 font-semibold">{row.getValue("totalAmount")}</div>,
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => {
        const value = row.getValue("paymentMethod") as number[];
        return (
          <div className="flex items-center text-sm">
            {value[0]}개중
            <span className="text-red-500 ml-2">{value[1]}</span>상승
            <span className="text-muted-foreground ml-2">{value[2]}</span>보합
            <span className="text-blue-500 ml-2">{value[3]}</span>하락
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: invoices,
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
    <div className="flex flex-col h-[calc(100%-36px)]">
      <div className="flex justify-between gpa-4 mb-4">
        <div className="flex gap-2 items-center max-h-8 text-muted-foreground text-xs">
          <div className="bg-muted p-2 rounded-sm flex align-middle gap-1">
            <span>조회기간:</span>
            <span>dddd (업데이트)</span>
          </div>
          <span className="text-sm">전체 {tableData ?? 0}건</span>
        </div>
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
      <div className="flex overflow-x-auto">
        <Table className="h-full">
          <TableBody className="w-[50%]">
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="h-12.25"
                onClick={() => {
                  setDetailOpen(true);
                  setSelectIssue(row.original);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table className="h-full">
          <TableBody className="w-[50%]">
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="h-12.25">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground shrink-0 mt-4">이슈 테마에 포함된 종목은 실시간 차트에서 조회되는 종목에 한해 제공됩니다.</p>
        <TablePagination table={table} />
      </div>
      {detailOpen && selectIssue && <IssueDetailModal onClose={() => setDetailOpen(false)} selectIssue={selectIssue} />}
    </div>
  );
}
