"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import type { RSPeriod } from "@/components/RSSettingDropdownContent";
import RSSetting from "./RSSettingDropdownContent";
import { format } from "date-fns";
import { useCallback, useState } from "react";

interface RSSettingDropdownProps {
  periods: RSPeriod[];
  onChange: (periods: RSPeriod[]) => void;
  onApply: (formatted: { from: string; to: string; ratio: number }[]) => void;
  isOnModal?: boolean;
  popPosition?: "start" | "center" | "end" | undefined;
}

export default function RSSettingDropdown({ periods, onChange, onApply, isOnModal = false, popPosition = "start" }: RSSettingDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleApply = useCallback(() => {
    const formatted = periods
      .filter((p) => p.date?.from && p.date?.to)
      .map((p) => ({
        from: format(p.date!.from!, "yyyy-MM-dd"),
        to: format(p.date!.to!, "yyyy-MM-dd"),
        ratio: p.ratio,
      }));

    onApply(formatted);
    setOpen(false);
  }, [periods, onApply]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          RS 상세설정
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={`w-93.75 p-0 ${isOnModal ? "z-1001" : null}`} align={popPosition}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="border-b p-4">
            <div className="text-base font-medium mb-2">RS 상세 설정</div>
            <div className="text-sm text-muted-foreground">시장 대비 강도 기간 및 비중을 설정할 수 있습니다.</div>
          </DropdownMenuLabel>

          <RSSetting value={periods} onChange={onChange} isOnModal={isOnModal} />

          <div className="p-4 text-right">
            <Button onClick={handleApply}>적용</Button>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
