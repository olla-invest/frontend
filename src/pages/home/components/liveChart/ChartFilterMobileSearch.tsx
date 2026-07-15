import { ChevronDown } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import ChartFilterBottomSheet from "./ChartFilterBottomSheet";
import { FilterCheckMenuItem } from "./ChartFilterMobilePanels";
import type { StockSuggestItem } from "@/api/stocks";
import type { SortOption } from "@/pages/home/components/LiveChart";

import { useRef, useState } from "react";

const SORT_OPTIONS: SortOption[] = ["RS점수 높은 순", "등락률 높은 순", "등락률 낮은 순", "거래대금 많은 순", "거래대금 적은 순", "순위변동 높은 순", "순위변동 낮은 순"];

interface ChartFilterMobileSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchCommit: (value: string) => void;
  suggestions: StockSuggestItem[];
  suggestLoading: boolean;
  suggestOpen: boolean;
  onSuggestOpenChange: (open: boolean) => void;
  onSelectSuggestion: (item: StockSuggestItem) => void;
  sortOption: SortOption;
  onSortOptionChange: (option: SortOption) => void;
}

export default function ChartFilterMobileSearch({
  search,
  onSearchChange,
  onSearchCommit,
  suggestions,
  suggestLoading,
  suggestOpen,
  onSuggestOpenChange,
  onSelectSuggestion,
  sortOption,
  onSortOptionChange,
}: ChartFilterMobileSearchProps) {
  const [sortoptionOpen, setSortoptionOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex gap-2 items-center max-h-9">
      <div className="relative flex-1 min-w-0" ref={searchWrapperRef}>
        <InputGroup className="h-9 w-full">
          <InputGroupAddon align="inline-start" className="mr-0!">
            <button
              type="button"
              onClick={() => {
                onSearchCommit(search);
              }}
              className="cursor-pointer mb-1"
            >
              <i className="icon icon-search" />
            </button>
          </InputGroupAddon>
          <InputGroupInput
            placeholder="종목명을 입력해주세요."
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            onFocus={() => {
              setIsSearchFocused(true);
              onSuggestOpenChange(true);
            }}
            onBlur={() => {
              setIsSearchFocused(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearchCommit(search);
              } else if (e.key === "Escape") {
                onSuggestOpenChange(false);
              }
            }}
            value={search}
            className="text-sm"
          />
          {search.length > 0 && (
            <InputGroupAddon align="inline-end" className="mr-0!">
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                  onSearchCommit("");
                }}
                className="cursor-pointer mb-1"
              >
                <i className="icon icon-circle-x" />
              </button>
            </InputGroupAddon>
          )}
        </InputGroup>

        {suggestOpen && search.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white border rounded-md shadow-md max-h-72 overflow-y-auto">
            {suggestLoading ? (
              <div className="px-3 py-3 text-sm text-muted-foreground text-center">검색 중...</div>
            ) : (
              <div className="flex flex-col">
                <span className="py-1.5 px-2 text-xs text-muted-foreground font-medium">검색결과 - 종목명 '{search}'</span>
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <button
                      type="button"
                      key={item.stockCode}
                      onClick={() => onSelectSuggestion(item)}
                      disabled={!item.inRanking}
                      className="w-full rounded-sm flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:bg-transparent"
                    >
                      <span className="flex-1 truncate text-slate-800">{item.companyName}</span>
                      {item.inRanking && (
                        <>
                          <span className="text-popover-foreground text-sm shrink-0">
                            RS {item.relativeStrengthScore} · {item.rank}위{" "}
                          </span>
                        </>
                      )}
                      {!item.inRanking && <span className="text-sm text-muted-foreground shrink-0">현재 조건 밖</span>}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-3 text-sm text-muted-foreground text-center">검색 결과가 없습니다.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {!isSearchFocused && (
        <Button type="button" variant="outline" className="shrink-0" onClick={() => setSortoptionOpen((p) => !p)}>
          {sortOption}
          <ChevronDown />
        </Button>
      )}
      <ChartFilterBottomSheet
        open={sortoptionOpen}
        onOpenChange={(open) => {
          setSortoptionOpen(open);
        }}
        height={60}
        title="실시간 차트 정렬"
        onCancel={() => {
          setSortoptionOpen(false);
        }}
        onApply={() => setSortoptionOpen(false)}
      >
        <div className="px-2 py-1.5 flex flex-col gap-1" role="radiogroup" aria-label="RS 기준">
          {SORT_OPTIONS.map((e) => (
            <FilterCheckMenuItem key={e} role="radio" selected={sortOption === e} onClick={() => onSortOptionChange(e)}>
              {e}
            </FilterCheckMenuItem>
          ))}
        </div>
      </ChartFilterBottomSheet>
    </div>
  );
}
