import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import type { IssueThemeFilterCounts } from "@/types/api/issueTheme";
import { useIsMobile } from "@/hooks/use-mobile";

interface IssueThemeFilterProps {
  filterCounts?: IssueThemeFilterCounts;
}

interface IssueThemeFilterType {
  viewType: "rank" | "heatmap";
  sortType: "rs" | "momentum";
  filterOption: string[];
  myTheme: boolean;
}

export default function IssueThemeFilter({ filterCounts }: IssueThemeFilterProps) {
  const [filterValue, setFilterValue] = useState<IssueThemeFilterType>({
    viewType: "rank",
    sortType: "rs",
    filterOption: ["all"],
    myTheme: false,
  });

  const isMobile = useIsMobile();

  const isActive = (option: string) => {
    // "전체"가 활성화된 상태에서는 개별 항목은 무조건 비활성 UI
    if (option !== "all" && filterValue.filterOption.includes("all")) {
      return false;
    }
    return filterValue.filterOption.includes(option);
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
    setFilterValue((prev) => {
      // "전체"를 직접 클릭한 경우
      if (key === "all") {
        // 이미 "전체"가 켜져있으면 끄지 않고 유지 (아무것도 선택 안 된 상태 방지)
        return {
          ...prev,
          filterOption: ["all"],
        };
      }

      // 개별 항목을 클릭한 경우
      const isCurrentlyActive = prev.filterOption.includes(key);
      let nextOptions = isCurrentlyActive ? prev.filterOption.filter((i) => i !== key) : [...prev.filterOption, key];

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

      return {
        ...prev,
        filterOption: nextOptions,
      };
    });
  };

  return (
    <div className="pb-4 pt-1 md:border-b md:mb-4 flex items-center justify-between w-full overflow-hidden">
      <div className="flex gap-2 flex-wrap items-center md:w-fit w-full">
        <Tabs
          value={filterValue.viewType}
          onValueChange={(value) => {
            setFilterValue((prev) => ({
              ...prev,
              viewType: value as IssueThemeFilterType["viewType"],
            }));
          }}
          className="w-full flex-1 md:flex-none md:w-fit "
        >
          <TabsList className="p-0.75 w-full md:w-fit">
            <TabsTrigger value="rank">순위</TabsTrigger>
            <TabsTrigger value="heatmap">히트맵</TabsTrigger>
          </TabsList>
        </Tabs>
        {!isMobile && <div className="w-px h-6 bg-border" />}
        {!isMobile && (
          <Tabs
            value={filterValue.sortType}
            onValueChange={(value) => {
              setFilterValue((prev) => ({
                ...prev,
                sortType: value as IssueThemeFilterType["sortType"],
              }));
            }}
            className="w-full flex-1 md:flex-none md:w-fit "
          >
            <TabsList className="p-0.75 w-full md:w-fit">
              <TabsTrigger value="rs">RS순</TabsTrigger>
              <TabsTrigger value="momentum">모멘텀순</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="flex items-center gap-2 md:w-fit w-full overflow-x-scroll">
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
      {!isMobile && (
        <div className="shrink-0">
          <Field orientation="horizontal" className="gap-2">
            <Checkbox
              id="my-theme-checkbox"
              name="my-theme-checkbox"
              checked={filterValue.myTheme}
              onClick={() =>
                setFilterValue((prev) => ({
                  ...prev,
                  myTheme: !prev.myTheme,
                }))
              }
            />
            <Label htmlFor="my-theme-checkbox" className="text-slate-800 cursor-pointer">
              내 관심 테마만 보기
            </Label>
          </Field>
        </div>
      )}
    </div>
  );
}
