import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import type { IssueThemeFilterCounts } from "@/types/api/issueTheme";
import { useIsMobile } from "@/hooks/use-mobile";

export interface IssueThemeFilterType {
  viewType: "rank" | "heatmap";
  sortType: "rs" | "momentum" | "rate";
  filterOption: string[];
  isFavorite: boolean;
}

interface IssueThemeFilterProps {
  filterCounts?: IssueThemeFilterCounts;
  value: IssueThemeFilterType;
  onChange: (value: IssueThemeFilterType) => void;
}

export default function IssueThemeFilter({ filterCounts, value, onChange }: IssueThemeFilterProps) {
  const isMobile = useIsMobile();

  const isActive = (option: string) => {
    // "전체"가 활성화된 상태에서는 개별 항목은 무조건 비활성 UI
    if (option !== "all" && value.filterOption.includes("all")) {
      return false;
    }
    return value.filterOption.includes(option);
  };

  const filterOptions = [
    { key: "all", label: "전체", count: filterCounts?.all },
    { key: "rs", label: "RS 80+", count: filterCounts?.rs80 },
    { key: "theme", label: "테마 5종목+", count: filterCounts?.stockCount5 },
    { key: "rate5", label: "테마 등락률 +5%", count: filterCounts?.changeRate5 },
    { key: "highPrice", label: "신고가 포함", count: filterCounts?.hasNewHigh },
  ] as const;

  // "전체"를 제외한 개별 옵션 key만 추출
  const individualKeys = filterOptions.filter((o) => o.key !== "all").map((o) => o.key);

  const toggleFilter = (key: string) => {
    // "전체"를 직접 클릭한 경우
    if (key === "all") {
      // 이미 "전체"가 켜져있으면 끄지 않고 유지 (아무것도 선택 안 된 상태 방지)
      onChange({ ...value, filterOption: ["all"] });
      return;
    }

    // 개별 항목을 클릭한 경우
    const isCurrentlyActive = value.filterOption.includes(key);
    let nextOptions = isCurrentlyActive ? value.filterOption.filter((i) => i !== key) : [...value.filterOption, key];

    // "all"은 별도로 관리 (일단 제거하고 아래서 재계산)
    nextOptions = nextOptions.filter((i) => i !== "all");

    // 개별 항목이 전부 선택되어 있으면 "all"도 활성화
    const allSelected = individualKeys.every((k) => nextOptions.includes(k));
    if (allSelected) {
      nextOptions = ["all"];
    }

    // 아무 것도 선택 안 된 상태면 "전체"로 기본 설정
    if (nextOptions.length === 0) {
      nextOptions = ["all"];
    }

    onChange({ ...value, filterOption: nextOptions });
  };

  return (
    <div className="pb-4 pt-1 border-b md:mb-4 flex items-center justify-between w-full overflow-hidden">
      <div className="flex gap-4 flex-col md:flex-row md:gap-2 flex-wrap md:w-fit w-full">
        <Tabs
          value={value.viewType}
          onValueChange={(v) => {
            const nextViewType = v as IssueThemeFilterType["viewType"];
            onChange({
              ...value,
              viewType: nextViewType,
              filterOption: nextViewType === "heatmap" ? ["rs"] : ["all"],
              sortType: nextViewType === "heatmap" ? "rate" : "rs",
            });
          }}
          className="w-full flex-1 md:flex-none md:w-fit"
        >
          <TabsList className="p-0.75 w-full md:w-fit">
            <TabsTrigger value="rank">순위</TabsTrigger>
            <TabsTrigger value="heatmap">히트맵</TabsTrigger>
          </TabsList>
        </Tabs>
        {!isMobile && <div className="w-px h-6 bg-border" />}
        {value.viewType === "rank" && (
          <div className="flex gap-2 md:w-fit w-full overflow-x-scroll">
            <Tabs value={value.sortType} onValueChange={(v) => onChange({ ...value, sortType: v as IssueThemeFilterType["sortType"] })} className="w-full flex-1 md:flex-none md:w-fit ">
              <TabsList className="p-0.75 w-full md:w-fit">
                <TabsTrigger value="rs">RS순</TabsTrigger>
                <TabsTrigger value="momentum">모멘텀순</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              {filterOptions.map(({ key, label, count }) => (
                <Button
                  key={key}
                  variant="outline"
                  className={`shadow-none gap-1 py-2 px-3 ${isActive(key) ? "text-foreground border-gray-500" : "text-muted-foreground"}`}
                  onClick={() => toggleFilter(key)}
                >
                  {label}
                  <span className="font-medium text-primary text-sm">{count}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
        {value.viewType === "heatmap" && (
          <Tabs value={value.sortType} onValueChange={(v) => onChange({ ...value, sortType: v as IssueThemeFilterType["sortType"] })} className="w-full flex-1 md:flex-none md:w-fit">
            <TabsList className="p-0.75 w-full md:w-fit">
              <TabsTrigger value="rate">등락률</TabsTrigger>
              <TabsTrigger value="rs">RS</TabsTrigger>
              <TabsTrigger value="momentum">모멘텀순</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      {!isMobile && (
        <div className="shrink-0">
          <Field orientation="horizontal" className="gap-2">
            <Checkbox id="my-theme-checkbox" name="my-theme-checkbox" checked={value.isFavorite} onClick={() => onChange({ ...value, isFavorite: !value.isFavorite })} />
            <Label htmlFor="my-theme-checkbox" className="text-slate-800 cursor-pointer">
              내 관심 테마만 보기
            </Label>
          </Field>
        </div>
      )}
    </div>
  );
}
