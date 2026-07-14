import { useState, useEffect, useCallback, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import type { ChartFilterState, RSFilterValue } from "@/pages/home/components/LiveChart";
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

// RS 기간 프리셋 (영업일 기준)
const RS_PERIOD_PRESETS = [
  { key: "1w", label: "1주일", days: 5 },
  { key: "1m", label: "1개월", days: 21 },
  { key: "3m", label: "3개월", days: 63 },
  { key: "12m", label: "12개월", days: 252 },
  { key: "custom", label: "직접 설정", days: null },
] as const;

type RsPresetKey = (typeof RS_PERIOD_PRESETS)[number]["key"];

//거래대금 프리셋
const PRICE_PRESETS = [
  { value: 1000000000, label: "10억" },
  { value: 5000000000, label: "50억" },
  { value: 10000000000, label: "100억" },
  { value: 30000000000, label: "300억" },
  { value: 50000000000, label: "500억" },
  { value: 100000000000, label: "1000억" },
];

function buildPresetPeriod(days: number): RSPeriod[] {
  return [
    {
      id: uuid(),
      date: getDefaultRSRange(days),
      ratio: 100,
    },
  ];
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

/**
 * 실제로 조회까지 적용된 거래대금 값이 있을 때만 라벨을 보여준다.
 * 프리셋과 값이 일치하면 프리셋 라벨("10억" 등)을, 아니면 직접 입력한 숫자를 "원" 단위로 보여준다.
 */
function getPriceLabel(price: number | null) {
  if (price === null || price === undefined) return null;
  const preset = PRICE_PRESETS.find((p) => p.value === price);
  if (preset) return preset.label;
  return `${price.toLocaleString()}원`;
}

/** 실제로 적용(조회)된 RS 값이 있을 때만 프리셋 라벨을 보여준다. 없으면 null(=전체 취급). */
function getRsLabel(rs: RSFilterValue[] | null, presetKey: RsPresetKey | null) {
  if (!rs || rs.length === 0) return null;
  const preset = RS_PERIOD_PRESETS.find((p) => p.key === presetKey);
  return preset?.label ?? RS_PERIOD_PRESETS.find((p) => p.key === "custom")!.label;
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
  const [priceOpen, setPriceOpen] = useState(false);
  // 실제로 "조회" 버튼을 눌러 반영된 거래대금 값만 추적한다. (입력/프리셋 클릭만으로는 갱신하지 않음)
  const [committedPrice, setCommittedPrice] = useState<number | null>(null);
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
  const [rsPresetKey, setRsPresetKey] = useState<RsPresetKey>("3m");

  // (직접입력은 조회 버튼을 눌러야 반영되므로, 버튼 라벨이 미리 바뀌는 걸 방지)
  const [committedRsPresetKey, setCommittedRsPresetKey] = useState<RsPresetKey | null>(null);

  // 프리셋 변경 핸들러
  const handleRsPresetChange = (key: string) => {
    const nextKey = key as RsPresetKey;
    setRsPresetKey(nextKey);

    const preset = RS_PERIOD_PRESETS.find((p) => p.key === nextKey);
    if (!preset || preset.days === null) return;

    const periods = buildPresetPeriod(preset.days);
    setRsPeriods(periods);
    commitRsFilter(periods, true);
    setCommittedRsPresetKey(nextKey);
  };

  const convertRsToPeriods = (rs: RSFilterValue[]): RSPeriod[] =>
    rs.map((item) => ({
      id: uuid(),
      ratio: item.ratio,
      date: {
        from: new Date(item.from),
        to: new Date(item.to),
      },
    }));

  const [draftRsPeriods, setDraftRsPeriods] = useState<RSPeriod[]>(rsPeriods);
  const [mobileRsPresetKey, setMobileRsPresetKey] = useState<RsPresetKey>("3m");
  const [draftFilters, setDraftFilters] = useState<MobileFilterDraft>({
    isHighPrice: null,
    theme: [],
    price: null,
    priceInput: DEFAULT_PRICE_INPUT,
    priceChange: false,
  });

  const handleMobileRsPresetChange = (key: string) => {
    const nextKey = key as RsPresetKey;
    setMobileRsPresetKey(nextKey);

    const preset = RS_PERIOD_PRESETS.find((p) => p.key === nextKey);
    if (!preset || preset.days === null) return;

    setDraftRsPeriods(buildPresetPeriod(preset.days));
  };

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
    setDraftRsPeriods(filterValue.rs ? convertRsToPeriods(filterValue.rs) : draftRsPeriods);
    setMobileRsPresetKey(rsPresetKey);
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
    setCommittedPrice(draftFilters.price ?? null);
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
            RS 기준
            {getRsLabel(filterValue.rs, committedRsPresetKey) && (
              <>
                <div className="size-0.5 bg-muted-foreground rounded-full" />
                <span className="text-muted-foreground">{getRsLabel(filterValue.rs, committedRsPresetKey)}</span>
              </>
            )}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-93.75 p-0" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="border-b p-1">
              <div className="text-sm px-2 py-1.5 font-medium">RS 기준</div>
            </DropdownMenuLabel>

            <div className="px-2 py-1.5 flex flex-col gap-1">
              <DropdownMenuRadioGroup value={rsPresetKey} onValueChange={handleRsPresetChange}>
                {RS_PERIOD_PRESETS.map((preset) => (
                  <DropdownMenuRadioItem
                    key={preset.key}
                    value={preset.key}
                    onSelect={(e) => {
                      // "직접입력"을 선택했을 때는 드롭다운이 자동으로 닫히지 않도록 막음
                      if (preset.key === "custom") {
                        e.preventDefault();
                      }
                    }}
                  >
                    {preset.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </div>

            {rsPresetKey === "custom" && (
              <div className="px-3 pt-0">
                <RSSetting value={rsPeriods} onChange={setRsPeriods} />
              </div>
            )}

            {rsPresetKey === "custom" && (
              <div className="p-4 text-right">
                <Button
                  onClick={() => {
                    commitRsFilter(rsPeriods, true);
                    setCommittedRsPresetKey("custom");
                    setRsOpen(false);
                  }}
                >
                  조회
                </Button>
              </div>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={filterTriggerClass(!!filterValue.isHighPrice)}>
            신고가 여부 <div className="size-0.5 bg-muted-foreground rounded-full" />
            <span className="text-muted-foreground">{getHighPriceLabel(filterValue.isHighPrice)}</span> <ChevronDown />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-52 p-0" align="start">
          <DropdownMenuLabel className="border-b p-1">
            <div className="px-2 py-1.5 text-sm font-medium">신고가 여부</div>
          </DropdownMenuLabel>

          <DropdownMenuRadioGroup
            value={filterValue.isHighPrice?.value ?? "all"}
            onValueChange={(value) => {
              let nextFilter: ChartFilterState;
              if (value === "all") {
                nextFilter = { ...props.filter, isHighPrice: null };
              } else {
                const selected = HIGH_PRICE_OPTIONS.find((o) => o.value === value);
                nextFilter = { ...props.filter, isHighPrice: selected ?? null };
              }
              filterSetter(nextFilter);
              props.onSearch(nextFilter);
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
            <span className="text-muted-foreground">{getThemeLabel(filterValue.theme)}</span> <ChevronDown />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-52 p-0" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="border-b p-1">
              <div className="px-2 py-1.5 text-sm font-medium">테마</div>
            </DropdownMenuLabel>

            <div className="px-2 py-1.5 flex flex-col gap-1 max-h-62.5 overflow-y-auto">
              <DropdownMenuCheckboxItem
                checked={filterValue.theme.length === 0}
                onCheckedChange={() => {
                  const nextFilter: ChartFilterState = { ...props.filter, theme: [] };
                  filterSetter(nextFilter);
                  props.onSearch(nextFilter);
                }}
              >
                전체
              </DropdownMenuCheckboxItem>

              {themeList?.map((theme) => {
                const checked = filterValue.theme.some((t) => t?.code === theme.themeCode);
                return (
                  <DropdownMenuCheckboxItem
                    key={theme.themeCode}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const nextTheme = isChecked
                        ? [
                            ...filterValue.theme,
                            {
                              code: theme.themeCode,
                              name: theme.themeName,
                              description: "",
                            },
                          ]
                        : filterValue.theme.filter((t) => t?.code !== theme.themeCode);
                      const nextFilter: ChartFilterState = { ...props.filter, theme: nextTheme };
                      filterSetter(nextFilter);
                      props.onSearch(nextFilter);
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

      <DropdownMenu open={priceOpen} onOpenChange={setPriceOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={filterTriggerClass(committedPrice !== null)}>
            거래 대금
            {getPriceLabel(committedPrice) && (
              <>
                <div className="size-0.5 bg-muted-foreground rounded-full" />
                <span className="text-muted-foreground">{getPriceLabel(committedPrice)}</span>
              </>
            )}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-93.75 p-0" align="start">
          <DropdownMenuLabel className="border-b p-1">
            <div className="px-2 py-1.5 text-sm font-medium">거래 대금</div>
          </DropdownMenuLabel>
          <div className="flex flex-col p-3 gap-4">
            <Input
              className={`${priceChange ? "text-foreground" : "text-muted-foreground"} min-w-35 shrink-0`}
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
            <div className="grid grid-cols-3 gap-2">
              {PRICE_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  variant="secondary"
                  className="cursor-pointer shadow-xs"
                  onClick={() => {
                    setPriceChange(true);
                    const raw = preset.value.toString();
                    setPriceInput(formatWithComma(raw));
                    filterSetter((prev) => ({
                      ...prev,
                      price: preset.value,
                    }));
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                className="w-fit cursor-pointer"
                onClick={() => {
                  props.onSearch({ ...props.filter });
                  setCommittedPrice(props.filter.price ?? null);
                  setPriceOpen(false);
                }}
              >
                조회
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  const renderMobileFilterButtons = () => (
    <>
      <Button type="button" variant="outline" className={filterTriggerClass(!!filterValue.rs)} onClick={openMobileRs}>
        RS 기준
        {getRsLabel(filterValue.rs, committedRsPresetKey) && (
          <>
            <div className="size-0.5 bg-muted-foreground rounded-full" />
            <span className="text-muted-foreground">{getRsLabel(filterValue.rs, committedRsPresetKey)}</span>
          </>
        )}
        <ChevronDown />
      </Button>

      <Button type="button" variant="outline" className={filterTriggerClass(!!filterValue.isHighPrice)} onClick={() => openMobileFilters("highPrice")}>
        신고가 여부 <div className="size-0.5 bg-muted-foreground rounded-full" />
        <span className="text-muted-foreground">{getHighPriceLabel(filterValue.isHighPrice)}</span> <ChevronDown />
      </Button>

      <Button type="button" variant="outline" className={filterTriggerClass(filterValue.theme.length !== 0)} onClick={() => openMobileFilters("theme")}>
        테마
        <div className="size-0.5 bg-muted-foreground rounded-full" />
        <span className="text-muted-foreground">{getThemeLabel(filterValue.theme)}</span> <ChevronDown />
      </Button>

      <Button type="button" variant="outline" className={filterTriggerClass(committedPrice !== null)} onClick={() => openMobileFilters("price")}>
        거래대금
        {getPriceLabel(committedPrice) && (
          <>
            <div className="size-0.5 bg-muted-foreground rounded-full" />
            <span className="text-muted-foreground">{getPriceLabel(committedPrice)}</span>
          </>
        )}
        <ChevronDown />
      </Button>
    </>
  );

  return (
    <div className="mt-2 pb-4 border-b mb-4 md:mb-0 relative">
      {/* 필터 비활성화용 ui */}
      {/* <div className="absolute top-0 left-0 right-0 w-full h-full bg-[rgba(255,255,255,0.65)] z-8" /> */}
      <form className="flex gap-2 flex-col md:flex-wrap md:flex-row">
        <Tabs
          value={filterValue.market}
          onValueChange={(value) => {
            const nextFilter: ChartFilterState = { ...props.filter, market: value };
            filterSetter(nextFilter);
            props.onSearch(nextFilter);
          }}
          className="w-full flex-1 md:flex-none md:w-fit "
        >
          <TabsList className="p-0.75 w-full md:w-fit">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="0">코스피</TabsTrigger>
            <TabsTrigger value="10">코스닥</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 overflow-x-auto md:flex-wrap">{isMobile ? renderMobileFilterButtons() : renderDesktopFilters()}</div>
      </form>

      {isMobile && (
        <>
          <ChartFilterBottomSheet
            open={mobileRsOpen}
            onOpenChange={(open) => {
              if (!open) {
                setDraftRsPeriods(rsPeriods);
                setMobileRsPresetKey(rsPresetKey);
              }
              setMobileRsOpen(open);
            }}
            height={90}
            title="RS 기준"
            description="시장 대비 강도 기간 및 비중을 설정할 수 있습니다."
            onCancel={() => {
              setDraftRsPeriods(rsPeriods);
              setMobileRsPresetKey(rsPresetKey);
            }}
            onApply={() => {
              setRsPresetKey(mobileRsPresetKey);
              commitRsFilter(draftRsPeriods, true);
              setCommittedRsPresetKey(mobileRsPresetKey);
            }}
          >
            <div className="p-4 border-b">
              <Tabs value={mobileRsPresetKey} onValueChange={handleMobileRsPresetChange}>
                <TabsList className="w-full flex-wrap h-auto">
                  {RS_PERIOD_PRESETS.map((preset) => (
                    <TabsTrigger key={preset.key} value={preset.key} className="flex-1">
                      {preset.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {mobileRsPresetKey === "custom" && <RSSetting value={draftRsPeriods} onChange={setDraftRsPeriods} isOnModal />}
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
              <ChartFilterMobilePanels
                tab={mobileFilterTab}
                onTabChange={setMobileFilterTab}
                draft={draftFilters}
                onDraftChange={setDraftFilters}
                formatWithComma={formatWithComma}
                themeList={themeList}
              />
            </div>
          </ChartFilterBottomSheet>
        </>
      )}
    </div>
  );
}
