interface TableLoadingProps {
  colSpan: number;
  message?: string;
}

export function TableLoading({ colSpan, message = "데이터 준비 중입니다..." }: TableLoadingProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 h-72">
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
