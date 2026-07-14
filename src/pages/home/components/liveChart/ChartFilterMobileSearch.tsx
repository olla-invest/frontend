import { ChevronDown } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import ChartFilterBottomSheet from "./ChartFilterBottomSheet";
import { FilterCheckMenuItem } from "./ChartFilterMobilePanels";

import { useState } from "react";

export default function ChartFilterMobileSearch() {
  const [search, setSearch] = useState("");
  const [sortoptionOpen, setSortoptionOpen] = useState(false);
  const [sortOption, setSortOption] = useState("RS점수 높은 순");
  return (
    <div className="flex gap-2 items-center max-h-9">
      <InputGroup className="h-9 w-80 flex-1">
        <InputGroupAddon align="inline-start" className="mr-0!">
          <button
            type="button"
            onClick={() => {
              setSearch("");
            }}
            className="cursor-pointer mb-1"
          >
            <i className="icon icon-search" />
          </button>
        </InputGroupAddon>
        <InputGroupInput
          placeholder="종목명을 입력해주세요."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
          className="text-sm"
        />
        {search.length > 0 && (
          <InputGroupAddon align="inline-end" className="mr-0!">
            <button
              type="button"
              onClick={() => {
                setSearch("");
              }}
              className="cursor-pointer mb-1"
            >
              <i className="icon icon-circle-x" />
            </button>
          </InputGroupAddon>
        )}
      </InputGroup>
      <Button type="button" variant="outline" className="shrink-0" onClick={() => setSortoptionOpen((p) => !p)}>
        {sortOption}
        <ChevronDown />
      </Button>
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
        onApply={() => {}}
      >
        <div className="px-2 py-1.5 flex flex-col gap-1" role="radiogroup" aria-label="RS 기준">
          {["RS점수 높은 순", "등락률 높은 순", "등락률 낮은 순", "거래대금 많은 순", "거래대금 적은 순", "순위변동 높은 순", "순위변동 낮은 순"].map((e, i) => (
            <FilterCheckMenuItem key={i} role="radio" selected={sortOption === e} onClick={() => setSortOption(e)}>
              {e}
            </FilterCheckMenuItem>
          ))}
        </div>
      </ChartFilterBottomSheet>
    </div>
  );
}
