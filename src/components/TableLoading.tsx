interface TableLoadingProps {
  colSpan: number;
  rowSpan?: number;
  message?: string;
  style?: string;
}

export function TableLoading({ colSpan, rowSpan, message = "데이터 준비 중입니다...", style = "" }: TableLoadingProps) {
  return (
    <tr>
      <td colSpan={colSpan} rowSpan={rowSpan} className={`py-12 ${style}`}>
        <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
          {/* Spinner */}
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          {/* Message */}
          <span className="text-sm">{message}</span>
        </div>
      </td>
    </tr>
  );
}
