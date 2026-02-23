"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, isAfter, endOfDay } from "date-fns";
import { CalendarDays } from "lucide-react";
import { type DateRange } from "react-day-picker";

interface DatePickerWithRangeProps {
  period?: {
    from: Date;
    to: Date;
  };
  setPeriod: (range: { from: Date; to: Date }) => void;

  /** 미래 날짜 선택 허용 여부 (기본 false) */
  allowFuture?: boolean;
}

export function DatePickerWithRange({
  period,
  setPeriod,
  allowFuture = false, // ✅ 기본값 false
}: DatePickerWithRangeProps) {
  const today = endOfDay(new Date());

  const fallbackRange: DateRange = {
    from: subDays(today, 7),
    to: today,
  };

  const selectedRange: DateRange = period ?? fallbackRange;

  return (
    <Field className="w-fit">
      <Popover modal>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start px-2 font-normal flex-1 text-sm">
            <CalendarDays className="mr-1 h-4 w-4 text-muted-foreground" />

            {selectedRange.from && selectedRange.to ? (
              <>
                {format(selectedRange.from, "yyyy-MM-dd")} ~ {format(selectedRange.to, "yyyy-MM-dd")}
              </>
            ) : (
              <span>날짜 선택</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 z-1001" align="start">
          <Calendar
            mode="range"
            defaultMonth={selectedRange.from}
            selected={selectedRange}
            numberOfMonths={1}
            disabled={allowFuture ? undefined : (date) => isAfter(date, today)}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setPeriod({
                  from: range.from,
                  to: range.to,
                });
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
