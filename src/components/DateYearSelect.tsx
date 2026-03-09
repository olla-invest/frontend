import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  selectYear: string;
  setSelectYear: (year: string) => void;
}

const currentYear = new Date().getFullYear();

const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);

export function DateYearSelect({ selectYear, setSelectYear }: Props) {
  return (
    <Select value={selectYear} onValueChange={setSelectYear}>
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
