import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import RSSetting from "../components/RSSettingDropdownContent";
import type { ChartFilterState } from "@/pages/home/components/LiveChart";
import type { RSPeriod } from "@/pages/home/components/RSSettingDropdownContent";
import { v4 as uuid } from "uuid";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { THEME_CODES } from "@/constants/theme";

interface ChartFilterProps {
  filter: ChartFilterState;
  setFilter: React.Dispatch<React.SetStateAction<ChartFilterState>>;
  onSearch: (filter: ChartFilterState) => void;
}

function getThemeLabel(themes: ({ code: number; name: string } | null)[]) {
  const validThemes = themes.filter(Boolean) as { code: number; name: string }[];

  if (validThemes.length === 0) return "전체";
  if (validThemes.length === 1) return validThemes[0].name;
  return `${validThemes[0].name} 외 ${validThemes.length - 1}개`;
}

function getHighPriceLabel(value: { value: string; name: string } | null) {
  if (!value) return "전체기간";
  return value.name;
}

const formatWithComma = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const HIGH_PRICE_OPTIONS = [
  { value: "true", name: "신고가" },
  { value: "false", name: "신고가 미해당(-표시)" },
];

export default function ChartFilter(props: ChartFilterProps) {
  const filterValue = { ...props.filter };
  const filterSetter = props.setFilter;
  const [priceInput, setPriceInput] = useState("1,000,000,000");
  const [priceChange, setPriceChange] = useState(false);
  const [rsOpen, setRsOpen] = useState(false);
  /** 기본 기간: 오늘 기준 최근 63일 */
  const DEFAULT_RANGE: DateRange = {
    from: subDays(new Date(), 62),
    to: new Date(),
  };
  const [rsPeriods, setRsPeriods] = useState<RSPeriod[]>([
    {
      id: uuid(),
      date: DEFAULT_RANGE,
      ratio: 100,
    },
  ]);

  return (
    <div className="mt-2 pb-4 border-b">
      <form className="flex gap-2">
        <Tabs
          value={filterValue.market}
          onValueChange={(value) =>
            filterSetter((prev) => ({
              ...prev,
              market: value,
            }))
          }
        >
          <TabsList className="p-0.75">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="0">코스피</TabsTrigger>
            <TabsTrigger value="10">코스닥</TabsTrigger>
          </TabsList>
        </Tabs>
        <DropdownMenu open={rsOpen} onOpenChange={setRsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`${filterValue.rs && "border-muted-foreground!"}`}>
              RS 상세설정 <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-93.75 p-0" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="border-b p-4">
                <div className="text-base font-medium mb-2">RS 상세 설정</div>
                <div className="text-sm text-muted-foreground">시장 대비 강도 기간 및 비중을 설정할 수 있습니다.</div>
              </DropdownMenuLabel>

              <RSSetting value={rsPeriods} onChange={setRsPeriods} />
              <div className="p-4 text-right">
                <Button
                  onClick={() => {
                    filterSetter((prev) => ({
                      ...prev,
                      rs: rsPeriods
                        .filter((p) => p.date?.from && p.date?.to)
                        .map((p) => ({
                          from: format(p.date!.from!, "yyyy-MM-dd"),
                          to: format(p.date!.to!, "yyyy-MM-dd"),
                          ratio: p.ratio,
                        })),
                    }));
                    setRsOpen(false);
                  }}
                >
                  적용
                </Button>
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`${filterValue.isHighPrice && "border-muted-foreground!"}`}>
              신고가 여부 <div className="size-0.5 bg-muted-foreground rounded-full" />
              <span className="text-primary">{getHighPriceLabel(filterValue.isHighPrice)}</span> <ChevronDown />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52 p-0" align="start">
            <DropdownMenuLabel className="border-b p-1">
              <div className="px-2 py-1.5">신고가 여부</div>
            </DropdownMenuLabel>

            <DropdownMenuRadioGroup
              value={filterValue.isHighPrice?.value ?? "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  filterSetter((prev) => ({
                    ...prev,
                    isHighPrice: null,
                  }));
                  return;
                }

                const selected = HIGH_PRICE_OPTIONS.find((o) => o.value === value);

                filterSetter((prev) => ({
                  ...prev,
                  isHighPrice: selected ?? null,
                }));
              }}
            >
              <div className="px-2 py-1.5 flex flex-col gap-1">
                {/* 전체 */}
                <DropdownMenuRadioItem value="all">전체기간</DropdownMenuRadioItem>

                {HIGH_PRICE_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.name}
                  </DropdownMenuRadioItem>
                ))}
              </div>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`${filterValue.theme.length !== 0 && "border-muted-foreground!"}`}>
              테마
              <div className="size-0.5 bg-muted-foreground rounded-full" />
              <span className="text-primary">{getThemeLabel(filterValue.theme)}</span> <ChevronDown />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52 p-0" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="border-b p-1">
                <div className="px-2 py-1.5">테마</div>
              </DropdownMenuLabel>

              <div className="px-2 py-1.5 flex flex-col gap-1 max-h-62.5 overflow-y-auto">
                {/* 전체 */}
                <DropdownMenuCheckboxItem
                  checked={filterValue.theme.length === 0}
                  onCheckedChange={() => {
                    filterSetter((prev) => ({
                      ...prev,
                      theme: [],
                    }));
                  }}
                >
                  전체
                </DropdownMenuCheckboxItem>

                {THEME_CODES?.map((theme) => {
                  const checked = filterValue.theme.some((t) => t?.code === theme.code);

                  return (
                    <DropdownMenuCheckboxItem
                      key={theme.code}
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        filterSetter((prev) => ({
                          ...prev,
                          theme: isChecked ? [...prev.theme, theme] : prev.theme.filter((t) => t?.code !== theme.code),
                        }));
                      }}
                    >
                      {theme.name}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <ButtonGroup>
          <ButtonGroupText className="bg-white text-foreground">거래대금</ButtonGroupText>
          <Input
            className={`${priceChange ? "text-foreground" : "text-muted-foreground"} text-right`}
            placeholder="금액을 입력해 주세요"
            inputMode="numeric"
            pattern="[0-9]*"
            value={priceInput}
            onChange={(e) => {
              setPriceChange(true);
              const raw = e.target.value.replace(/[^0-9]/g, "");
              const formatted = formatWithComma(raw);
              setPriceInput(formatted);
              filterSetter((prev) => ({
                ...prev,
                price: raw === "" ? null : Number(raw),
              }));
            }}
          />

          <ButtonGroupText className="bg-white text-foreground">원</ButtonGroupText>
        </ButtonGroup>
        <Button type="button" variant="outline" className="text-primary" onClick={() => props.onSearch(filterValue)}>
          조회
        </Button>
      </form>
    </div>
  );
}
