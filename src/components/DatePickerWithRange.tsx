"use client";

import { useState } from "react";
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
  allowFuture?: boolean;
}

export function DatePickerWithRange({ period, setPeriod, allowFuture = false }: DatePickerWithRangeProps) {
  const today = endOfDay(new Date());

  const fallbackRange: DateRange = {
    from: subDays(today, 7),
    to: today,
  };

  const selectedRange: DateRange = period ?? fallbackRange;

  const [draftRange, setDraftRange] = useState<DateRange>(selectedRange);

  const [open, setOpen] = useState(false);

  const handleApply = () => {
    if (draftRange?.from && draftRange?.to) {
      setPeriod({
        from: draftRange.from,
        to: draftRange.to,
      });
      setOpen(false);
    }
  };

  return (
    <Field className="w-fit">
      <Popover open={open} onOpenChange={setOpen} modal>
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

        <PopoverContent className="w-auto p-0 z-1001 space-y-3" align="end">
          <Calendar
            className="p-3 mb-0"
            mode="range"
            defaultMonth={draftRange?.from}
            selected={draftRange}
            numberOfMonths={1}
            disabled={allowFuture ? undefined : (date) => isAfter(date, today)}
            onSelect={(range) => {
              setDraftRange(range ?? fallbackRange);
            }}
          />
          <div className="flex justify-end gap-2 p-3 border-t">
            <Button onClick={handleApply}>적용</Button>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
