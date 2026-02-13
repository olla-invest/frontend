import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import type { DateRange } from "react-day-picker";

export interface RSPeriod {
  id: string;
  date: DateRange | undefined;
  ratio: number;
}

interface RSSettingProps {
  value: RSPeriod[];
  onChange: React.Dispatch<React.SetStateAction<RSPeriod[]>>;
}

/** 항상 합계 100 유지 */
function normalize(periods: RSPeriod[]): RSPeriod[] {
  if (periods.length === 0) return periods;

  if (periods.length === 1) {
    return [{ ...periods[0], ratio: 100 }];
  }

  const lastIndex = periods.length - 1;
  const manualSum = periods.slice(0, lastIndex).reduce((acc, cur) => acc + cur.ratio, 0);

  return periods.map((p, idx) => {
    if (idx === lastIndex) {
      return {
        ...p,
        ratio: Math.max(0, 100 - manualSum),
      };
    }
    return p;
  });
}

export default function RSSetting({ value, onChange }: RSSettingProps) {
  const updatePeriods = (updater: (prev: RSPeriod[]) => RSPeriod[]) => {
    onChange((prev) => normalize(updater(prev)));
  };

  const updateRatio = (id: string, ratio: number) => {
    updatePeriods((prev) => prev.map((p) => (p.id === id ? { ...p, ratio: Math.max(0, Math.min(100, ratio)) } : p)));
  };

  const updateDate = (id: string, date: DateRange | undefined) => {
    updatePeriods((prev) => prev.map((p) => (p.id === id ? { ...p, date } : p)));
  };

  const addPeriod = () => {
    updatePeriods((prev) => [
      ...prev,
      {
        id: uuid(),
        date: undefined,
        ratio: 0,
      },
    ]);
  };

  const removePeriod = (id: string) => {
    updatePeriods((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-4 flex flex-col gap-4 border-b">
      {value.map((period, idx) => {
        const isLast = idx === value.length - 1;

        return (
          <Field key={period.id} className="mx-auto">
            {idx === 0 && (
              <FieldLabel className="flex justify-between items-center">
                기간
                <span className="text-xs text-muted-foreground">* 선택한 기간 내 영업일 기준</span>
              </FieldLabel>
            )}

            <div className="w-full flex gap-2 items-center">
              <Popover>
                {idx > 0 && (
                  <Button variant="outline" size="icon" onClick={() => removePeriod(period.id)} className="flex-1 max-w-9 shrink-0">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}

                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start px-2 font-normal flex-1 text-sm">
                    <CalendarDays className="mr-1 h-4 w-4 text-muted-foreground" />
                    {period.date?.from ? (
                      period.date.to ? (
                        <>
                          {format(period.date.from, "yyyy-MM-dd")} ~ {format(period.date.to, "yyyy-MM-dd")}
                        </>
                      ) : (
                        format(period.date.from, "yyyy-MM-dd")
                      )
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="range" selected={period.date} disabled={{ after: new Date() }} onSelect={(date) => updateDate(period.id, date)} numberOfMonths={2} />
                </PopoverContent>
              </Popover>

              <div className="relative max-w-18">
                <Input type="number" min={0} max={100} disabled={isLast} value={period.ratio} onChange={(e) => updateRatio(period.id, Number(e.target.value))} className="pr-7" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">%</span>
              </div>
            </div>
          </Field>
        );
      })}

      <Button variant="outline" className="text-primary" onClick={addPeriod}>
        기간(일) 추가
      </Button>
    </div>
  );
}
