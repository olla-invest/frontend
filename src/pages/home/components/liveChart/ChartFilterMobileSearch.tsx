import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

import { useState } from "react";

export default function ChartFilterMobileSearch() {
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  return (
    <div className="flex gap-2 items-center max-h-8">
      <InputGroup className="h-8 w-80">
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-sm">
            RS점수 높은 순
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {["RS점수 높은 순", "등락률 높은 순", "등락률 낮은 순", "거래대금 많은 순", "거래대금 적은 순", "순위변동 높은 순", "순위변동 낮은 순"].map((option) => (
              <DropdownMenuCheckboxItem
                key={option}
                checked={sortOption === option}
                onCheckedChange={() => {
                  setSortOption(option);
                }}
              >
                {option}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
