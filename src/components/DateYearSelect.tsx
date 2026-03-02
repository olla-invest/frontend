import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const years = Array.from({ length: 50 }, (_, i) => 1990 + i);

export function DateYearSelect() {
  return (
    <Select defaultValue="2026">
      <SelectTrigger>
        <SelectValue placeholder="연도 선택" />
      </SelectTrigger>
      <SelectContent className="z-1001">
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
