"use client";

import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination";
import type { Table } from "@tanstack/react-table";

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));

  const pages = Array.from({ length: 3 }, (_, i) => start + i).filter((p) => p <= totalPages);

  return (
    <Pagination className="justify-end mt-4">
      <PaginationContent>
        {/* 이전 */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (table.getCanPreviousPage()) {
                table.previousPage();
              }
            }}
            className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* 페이지 번호 */}
        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              isActive={currentPage === pageNumber}
              onClick={(e) => {
                e.preventDefault();
                table.setPageIndex(pageNumber - 1);
              }}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis */}
        {totalPages > 3 && currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* 다음 */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (table.getCanNextPage()) {
                table.nextPage();
              }
            }}
            className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
