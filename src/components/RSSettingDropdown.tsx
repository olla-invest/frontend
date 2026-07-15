"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";
import type { RSPeriod } from "@/components/RSSettingDropdownContent";
import RSSetting from "./RSSettingDropdownContent";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { v4 as uuid } from "uuid";
import { getDefaultRSRange } from "@/utils/tradingDay";

interface RSSettingDropdownProps {
  periods: RSPeriod[];
  onChange: (periods: RSPeriod[]) => void;
  onApply: (formatted: { from: string; to: string; ratio: number }[]) => void;
  isOnModal?: boolean;
  popPosition?: "start" | "center" | "end" | undefined;
}

/** 프리셋 기간 (영업일 기준) */
const PERIOD_PRESETS = [
  { key: "1w", label: "1주일", days: 5 },
  { key: "1m", label: "1개월", days: 21 },
  { key: "3m", label: "3개월", days: 63 },
  { key: "12m", label: "12개월", days: 252 },
  { key: "custom", label: "직접입력", days: null },
] as const;

type PresetKey = (typeof PERIOD_PRESETS)[number]["key"];

export default function RSSettingDropdown({ periods, onChange, onApply, isOnModal = false, popPosition = "start" }: RSSettingDropdownProps) {
  const [open, setOpen] = useState(false);
  const [presetKey, setPresetKey] = useState<PresetKey>("1w");

  const handlePresetChange = useCallback(
    (key: string) => {
      const nextKey = key as PresetKey;
      setPresetKey(nextKey);

      if (nextKey === "custom") return;

      const preset = PERIOD_PRESETS.find((p) => p.key === nextKey);
      if (!preset || preset.days === null) return;

      const nextPeriod: RSPeriod = {
        id: uuid(),
        date: getDefaultRSRange(preset.days),
        ratio: 100,
      };

      onChange([nextPeriod]);
    },
    [onChange],
  );

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

          <div className="p-4 border-b">
            <Tabs value={presetKey} onValueChange={handlePresetChange}>
              <TabsList className="w-full flex-wrap h-auto">
                {PERIOD_PRESETS.map((preset) => (
                  <TabsTrigger key={preset.key} value={preset.key} className="flex-1">
                    {preset.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {presetKey === "custom" && <RSSetting value={periods} onChange={onChange} isOnModal={isOnModal} />}

          <div className="p-4 text-right">
            <Button onClick={handleApply}>적용</Button>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
