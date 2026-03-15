import { Badge } from "@/components/ui/badge";
import { CircleCheckIcon } from "lucide-react";
export default function RelatedStocksThemes() {
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      <div className="border rounded-lg bg-white p-4 flex gap-2 items-center">
        <div className="size-12 rounded-md bg-[#d9d9d9] shrink-0"></div>
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
            <div className="flex gap-2 text-slate-700 text-sm items-center">
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
      </div>
      <div className="border rounded-lg bg-white p-4 flex gap-2 items-center">
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
    </div>
  );
}
