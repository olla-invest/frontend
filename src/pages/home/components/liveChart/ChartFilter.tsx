import { useState, useEffect, useCallback, useRef } from "react";
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
import RSSetting from "../../../../components/RSSettingDropdownContent";
import type { ChartFilterState } from "@/pages/home/components/LiveChart";
import type { RSPeriod } from "@/components/RSSettingDropdownContent";
import { v4 as uuid } from "uuid";

import { getDefaultRSRange } from "@/utils/tradingDay";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import ChartFilterBottomSheet from "./ChartFilterBottomSheet";
import ChartFilterMobilePanels, { type MobileFilterDraft, type MobileFilterTab } from "./ChartFilterMobilePanels";

interface ChartFilterProps {
  filter: ChartFilterState;
  themeList?: {
    sourceThemeNo: string;
    themeCode: number;
    themeName: string;
  }[];
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
  if (!value) return "전체";
  return value.name;
}

const formatWithComma = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const HIGH_PRICE_OPTIONS = [
  { value: "true", name: "신고가" },
  { value: "false", name: "신고가 미해당(-표시)" },
];

const DEFAULT_PRICE_INPUT = "1,000,000,000";

function buildRsFromPeriods(periods: RSPeriod[]) {
  return periods
    .filter((p) => p.date?.from && p.date?.to)
    .map((p) => ({
      from: format(p.date!.from!, "yyyy-MM-dd"),
      to: format(p.date!.to!, "yyyy-MM-dd"),
      ratio: p.ratio,
    }));
}

export default function ChartFilter(props: ChartFilterProps) {
  const isMobile = useIsMobile();
  const filterValue = { ...props.filter };
  const themeList = props.themeList;
  const filterSetter = props.setFilter;
  const [priceInput, setPriceInput] = useState(DEFAULT_PRICE_INPUT);
  const [priceChange, setPriceChange] = useState(false);
  const [rsOpen, setRsOpen] = useState(false);

  const [mobileRsOpen, setMobileRsOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileFilterTab, setMobileFilterTab] = useState<MobileFilterTab>("highPrice");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const sheetContentRef = useRef<HTMLDivElement>(null);

  const [rsPeriods, setRsPeriods] = useState<RSPeriod[]>([
    {
      id: uuid(),
      date: getDefaultRSRange(63),
      ratio: 100,
    },
  ]);

  const [draftRsPeriods, setDraftRsPeriods] = useState<RSPeriod[]>(rsPeriods);
  const [draftFilters, setDraftFilters] = useState<MobileFilterDraft>({
    isHighPrice: null,
    theme: [],
    price: null,
    priceInput: DEFAULT_PRICE_INPUT,
    priceChange: false,
  });

  const createFilterDraft = useCallback(
    (): MobileFilterDraft => ({
      isHighPrice: filterValue.isHighPrice,
      theme: [...filterValue.theme],
      price: filterValue.price,
      priceInput,
      priceChange,
    }),
    [filterValue.isHighPrice, filterValue.theme, filterValue.price, priceInput, priceChange],
  );

  const openMobileFilters = (tab: MobileFilterTab) => {
    setDraftFilters(createFilterDraft());
    setMobileFilterTab(tab);
    setKeyboardOpen(false);
    setMobileFiltersOpen(true);
  };

  const openMobileRs = () => {
    setDraftRsPeriods(rsPeriods);
    setMobileRsOpen(true);
  };

  const commitRsFilter = (periods: RSPeriod[], shouldSearch: boolean) => {
    const rs = buildRsFromPeriods(periods);
    const rsValue = rs.length > 0 ? rs : null;
    setRsPeriods(periods);
    const nextFilter: ChartFilterState = { ...props.filter, rs: rsValue };
    filterSetter(nextFilter);
    if (shouldSearch) {
      props.onSearch(nextFilter);
    }
  };

  const applyMobileFilters = () => {
    setPriceInput(draftFilters.priceInput);
    setPriceChange(draftFilters.priceChange);
    const nextFilter: ChartFilterState = {
      ...props.filter,
      isHighPrice: draftFilters.isHighPrice,
      theme: draftFilters.theme,
      price: draftFilters.price,
    };
    filterSetter(nextFilter);
    props.onSearch(nextFilter);
  };

  useEffect(() => {
    if (!mobileFiltersOpen) return;

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        setKeyboardOpen(true);
      }
    };

    const onFocusOut = () => {
      requestAnimationFrame(() => {
        const active = document.activeElement as HTMLElement | null;
        if (!active || (active.tagName !== "INPUT" && active.tagName !== "TEXTAREA")) {
          setKeyboardOpen(false);
        }
      });
    };

    const viewport = window.visualViewport;
    const onViewportResize = () => {
      if (!viewport) return;
      const keyboardLikely = window.innerHeight - viewport.height > 120;
      setKeyboardOpen(keyboardLikely);
    };

    const root = sheetContentRef.current;
    root?.addEventListener("focusin", onFocusIn);
    root?.addEventListener("focusout", onFocusOut);
    viewport?.addEventListener("resize", onViewportResize);

    return () => {
      root?.removeEventListener("focusin", onFocusIn);
      root?.removeEventListener("focusout", onFocusOut);
      viewport?.removeEventListener("resize", onViewportResize);
    };
  }, [mobileFiltersOpen]);

  const filterTriggerClass = (active: boolean) => `shrink-0 ${active ? "border-muted-foreground!" : ""}`;

  const renderDesktopFilters = () => (
    <>
      <DropdownMenu open={rsOpen} onOpenChange={setRsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={filterTriggerClass(!!filterValue.rs)}>
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
                  commitRsFilter(rsPeriods, false);
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
          <Button variant="outline" className={filterTriggerClass(!!filterValue.isHighPrice)}>
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
                filterSetter((prev) => ({ ...prev, isHighPrice: null }));
                return;
              }
              const selected = HIGH_PRICE_OPTIONS.find((o) => o.value === value);
              filterSetter((prev) => ({ ...prev, isHighPrice: selected ?? null }));
            }}
          >
            <div className="px-2 py-1.5 flex flex-col gap-1">
              <DropdownMenuRadioItem value="all">전체</DropdownMenuRadioItem>
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
          <Button variant="outline" className={filterTriggerClass(filterValue.theme.length !== 0)}>
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
              <DropdownMenuCheckboxItem checked={filterValue.theme.length === 0} onCheckedChange={() => filterSetter((prev) => ({ ...prev, theme: [] }))}>
                전체
              </DropdownMenuCheckboxItem>

              {themeList?.map((theme) => {
                const checked = filterValue.theme.some((t) => t?.code === theme.themeCode);
                return (
                  <DropdownMenuCheckboxItem
                    key={theme.themeCode}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      filterSetter((prev) => ({
                        ...prev,
                        theme: isChecked
                          ? [
                              ...prev.theme,
                              {
                                code: theme.themeCode,
                                name: theme.themeName,
                                description: "",
                              },
                            ]
                          : prev.theme.filter((t) => t?.code !== theme.themeCode),
                      }));
                    }}
                  >
                    {theme.themeName}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ButtonGroup>
        <ButtonGroupText className="bg-white text-foreground shrink-0">거래대금</ButtonGroupText>
        <Input
          className={`${priceChange ? "text-foreground" : "text-muted-foreground"} text-right min-w-35 shrink-0`}
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
    </>
  );

  const renderMobileFilterButtons = () => (
    <>
      <Button type="button" variant="outline" className={filterTriggerClass(!!filterValue.rs)} onClick={openMobileRs}>
        RS 상세설정 <ChevronDown />
      </Button>

      <Button type="button" variant="outline" className={filterTriggerClass(!!filterValue.isHighPrice)} onClick={() => openMobileFilters("highPrice")}>
        신고가 여부 <div className="size-0.5 bg-muted-foreground rounded-full" />
        <span className="text-primary">{getHighPriceLabel(filterValue.isHighPrice)}</span> <ChevronDown />
      </Button>

      <Button type="button" variant="outline" className={filterTriggerClass(filterValue.theme.length !== 0)} onClick={() => openMobileFilters("theme")}>
        테마
        <div className="size-0.5 bg-muted-foreground rounded-full" />
        <span className="text-primary">{getThemeLabel(filterValue.theme)}</span> <ChevronDown />
      </Button>

      <Button type="button" variant="outline" className={filterTriggerClass(!!filterValue.price || priceChange)} onClick={() => openMobileFilters("price")}>
        거래대금 <ChevronDown />
      </Button>
    </>
  );

  return (
    <div className="mt-2 pb-4 border-b mb-4 md:mb-0 relative">
      <div className="absolute top-0 left-0 right-0 w-full h-full bg-[rgba(255,255,255,0.65)] z-8" />
      <form className="flex gap-2 flex-col md:flex-wrap md:flex-row">
        <Tabs
          value={filterValue.market}
          onValueChange={(value) => {
            const nextFilter: ChartFilterState = { ...props.filter, market: value };
            filterSetter((prev) => ({ ...prev, market: value }));
            if (isMobile) {
              props.onSearch(nextFilter);
            }
          }}
          className="w-full flex-1 md:flex-none md:w-fit "
        >
          <TabsList className="p-0.75 w-full md:w-fit">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="0">코스피</TabsTrigger>
            <TabsTrigger value="10">코스닥</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 overflow-x-auto md:flex-wrap">
          {isMobile ? renderMobileFilterButtons() : renderDesktopFilters()}

          <Button type="button" variant="outline" className="text-primary hidden md:block" onClick={() => props.onSearch({ ...props.filter })}>
            조회
          </Button>
        </div>
      </form>

      {isMobile && (
        <>
          <ChartFilterBottomSheet
            open={mobileRsOpen}
            onOpenChange={(open) => {
              if (!open) setDraftRsPeriods(rsPeriods);
              setMobileRsOpen(open);
            }}
            height={90}
            title="RS 상세 설정"
            description="시장 대비 강도 기간 및 비중을 설정할 수 있습니다."
            onCancel={() => setDraftRsPeriods(rsPeriods)}
            onApply={() => commitRsFilter(draftRsPeriods, true)}
          >
            <RSSetting value={draftRsPeriods} onChange={setDraftRsPeriods} isOnModal />
          </ChartFilterBottomSheet>

          <ChartFilterBottomSheet
            open={mobileFiltersOpen}
            onOpenChange={(open) => {
              if (!open) {
                setDraftFilters(createFilterDraft());
                setKeyboardOpen(false);
              }
              setMobileFiltersOpen(open);
            }}
            height={keyboardOpen ? 90 : 70}
            title="필터 설정"
            onCancel={() => setDraftFilters(createFilterDraft())}
            onApply={applyMobileFilters}
          >
            <div ref={sheetContentRef} className="h-full min-h-0">
              <ChartFilterMobilePanels tab={mobileFilterTab} onTabChange={setMobileFilterTab} draft={draftFilters} onDraftChange={setDraftFilters} formatWithComma={formatWithComma} />
            </div>
          </ChartFilterBottomSheet>
        </>
      )}
    </div>
  );
}
