interface LoadingUiProps {
  boxStyle?: string;
  message?: string;
}

export function LoadingUi({ boxStyle = "", message = "데이터 준비 중입니다..." }: LoadingUiProps) {
  return (
    <div className={`w-full h-full ${boxStyle}`}>
      <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        {/* Message */}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}
