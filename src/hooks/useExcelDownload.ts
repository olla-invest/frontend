// hooks/useExcelDownload.ts
import type { Table } from "@tanstack/react-table";

interface Options {
  fileName?: string;
}
export function useExcelDownload<T>(table: Table<T>, options?: Options) {
  const downloadAll = () => {
    const columns = table.getAllLeafColumns().filter((col) => col.getIsVisible());

    const rows = table.getPrePaginationRowModel().rows;
    if (!rows.length) return;

    const headerRow = columns
      .map((col) => {
        const header = col.columnDef.header;
        return typeof header === "string" ? header : col.id;
      })
      .join(",");

    const bodyRows = rows.map((row) =>
      columns
        .map((col) => {
          const value = row.getValue(col.id);

          if (value == null) return "";
          if (typeof value === "string") {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    );

    const csv = "\uFEFF" + [headerRow, ...bodyRows].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = options?.fileName ?? "table-data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    downloadAll,
  };
}
