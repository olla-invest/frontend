import { Badge } from "@/components/ui/badge";
import { CircleCheckIcon } from "lucide-react";

export function ThemeFocus() {
  return (
    <div className="bg-slate-50 rounded-md p-4 flex-1">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex flex-col gap-1">
            <div className="size-16 rounded-md bg-[#d9d9d9] shrink-0"></div>
            <span className="text-slate-800 font-semibold">우주항공</span>
          </div>
          <div className="text-slate-700 text-sm flex gap-1 pr-2 flex-wrap">
            <span>태마 순위가</span>
            <span className="font-semibold">NN → NN</span>
            <span>으로 상승했어요.</span>
            <span className="text-rose-500 flex items-center">
              <i className="icon icon-arrow-up" />2
            </span>
          </div>
        </div>
        <div className="h-px w-full border-t" />
        <div className="flex gap-2 text-slate-700 text-sm items-center flex-wrap">
          <span>34개 중</span>
          <span>
            <span className="text-rose-500">28</span>
            상승
          </span>
          <span>
            <span className="text-muted-foreground">2</span>
            보합
          </span>
          <span>
            <span className="text-blue-500">4</span>
            하락
          </span>
        </div>
      </div>
    </div>
  );
}

export function StockFocus() {
  return (
    <div className="border-b bg-white px-2 py-3 flex gap-2">
      <div className="size-12 rounded-full bg-[#d9d9d9] shrink-0"></div>
      <div className="flex flex-col gap-1">
        <span className="text-slate-800 font-semibold">금융</span>
        <div className="flex gap-1 items-center flex-wrap">
          <div className="text-slate-700 text-sm flex gap-1 pr-2">
            <span>태마 순위가</span>
            <span className="font-semibold">NN → NN</span>
            <span>으로 상승했어요.</span>
            <span className="text-rose-500 flex items-center">
              <i className="icon icon-arrow-up" />2
            </span>
          </div>
          <div className="flex flex-wrap gap-1 text-slate-700 text-sm items-center">
            <Badge variant="outline">
              <CircleCheckIcon className="text-red-400" />
              신고가
            </Badge>
            <Badge variant="outline">변동성 축소</Badge>
            <Badge variant="outline">가격압축</Badge>
            <Badge variant="outline">트렌드템플레이트</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
