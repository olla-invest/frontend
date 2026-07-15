import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckIcon, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChartFilterState } from "@/pages/home/components/LiveChart";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

const HIGH_PRICE_OPTIONS = [
  { value: "true", name: "신고가" },
  { value: "false", name: "신고가 미해당(-표시)" },
];

export const filterMenuItemClass =
  "focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none text-left";

export function FilterCheckMenuItem({ selected, onClick, role, children }: { selected: boolean; onClick: () => void; role: "radio" | "menuitemcheckbox"; children: React.ReactNode }) {
  return (
    <button type="button" role={role} aria-checked={selected} className={filterMenuItemClass} onClick={onClick}>
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">{selected ? <CheckIcon className="size-4" /> : null}</span>
      {children}
    </button>
  );
}

export type MobileFilterTab = "highPrice" | "theme" | "price";

export interface MobileFilterDraft {
  isHighPrice: ChartFilterState["isHighPrice"];
  theme: ChartFilterState["theme"];
  price: ChartFilterState["price"];
  priceInput: string;
  priceChange: boolean;
}

interface ChartFilterMobilePanelsProps {
  tab: MobileFilterTab;
  onTabChange: (tab: MobileFilterTab) => void;
  draft: MobileFilterDraft;
  onDraftChange: (draft: MobileFilterDraft) => void;
  formatWithComma: (value: string) => string;
  themeList?: {
    sourceThemeNo: string;
    themeCode: number;
    themeName: string;
  }[];
}

export default function ChartFilterMobilePanels({ tab, onTabChange, draft, onDraftChange, formatWithComma, themeList }: ChartFilterMobilePanelsProps) {
  const setDraft = (patch: Partial<MobileFilterDraft>) => onDraftChange({ ...draft, ...patch });

  const highPriceValue = draft.isHighPrice?.value ?? "all";

  return (
    <Tabs value={tab} onValueChange={(v) => onTabChange(v as MobileFilterTab)} className="flex h-full flex-col">
      <TabsList variant="line" className="w-full shrink-0 justify-start gap-4 border-b px-4">
        <TabsTrigger value="highPrice" className="grow-0 px-0 py-2 text-sm">
          신고가 여부
        </TabsTrigger>
        <TabsTrigger value="theme" className="grow-0 px-0 py-2 text-sm">
          테마
        </TabsTrigger>
        <TabsTrigger value="price" className="grow-0 px-0 py-2 text-sm">
          거래대금
        </TabsTrigger>
      </TabsList>

      <TabsContent value="highPrice" className="mt-0 flex-1 overflow-y-auto py-1">
        <div className="px-2 py-1.5 flex flex-col gap-1" role="radiogroup" aria-label="신고가 여부">
          <FilterCheckMenuItem role="radio" selected={highPriceValue === "all"} onClick={() => setDraft({ isHighPrice: null })}>
            전체
          </FilterCheckMenuItem>
          {HIGH_PRICE_OPTIONS.map((option) => (
            <FilterCheckMenuItem key={option.value} role="radio" selected={highPriceValue === option.value} onClick={() => setDraft({ isHighPrice: option })}>
              {option.name}
            </FilterCheckMenuItem>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="theme" className="mt-0 flex-1 overflow-y-auto py-1">
        <div className="px-2 py-1.5 flex flex-col gap-1 overflow-y-auto">
          <FilterCheckMenuItem role="menuitemcheckbox" selected={draft.theme.length === 0} onClick={() => setDraft({ theme: [] })}>
            전체
          </FilterCheckMenuItem>
          {themeList?.map((theme) => {
            const checked = draft.theme.some((t) => t?.code === theme.themeCode);
            return (
              <FilterCheckMenuItem
                key={theme.themeCode}
                role="menuitemcheckbox"
                selected={checked}
                onClick={() => {
                  setDraft({
                    theme: checked
                      ? draft.theme.filter((t) => t?.code !== theme.themeCode)
                      : [
                          ...draft.theme,
                          {
                            code: theme.themeCode,
                            name: theme.themeName,
                            description: "", // or omit if the field is optional in your type
                          },
                        ],
                  });
                }}
              >
                {theme.themeName}
              </FilterCheckMenuItem>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="price" className="mt-0 flex-1 overflow-y-auto px-4 py-3">
        <Label className="mb-2 block text-sm text-muted-foreground sr-only">거래대금</Label>
        <InputGroup className="w-full mb-2">
          <InputGroupInput
            className={cn(draft.priceChange ? "text-foreground" : "text-muted-foreground", "min-h-10")}
            placeholder="금액을 입력해 주세요"
            inputMode="numeric"
            pattern="[0-9]*"
            value={draft.priceInput}
            onFocus={() => onTabChange("price")}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              const formatted = formatWithComma(raw);
              setDraft({
                priceChange: true,
                priceInput: formatted,
                price: raw === "" ? null : Number(raw),
              });
            }}
          />
          <InputGroupAddon align="inline-end">
            {draft.priceInput !== "1,000,000,000" && (
              <InputGroupButton title="초기화" aria-label="초기화" onClick={() => setDraft({ priceInput: "1,000,000,000", price: 1000000000 })}>
                <CircleX className="size-4" />
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
        <div className="grid grid-cols-4 gap-2 font-medium text-sm">
          <Button variant="secondary" onClick={() => setDraft({ priceInput: formatWithComma("1000000000"), price: 1000000000 })}>
            10억원
          </Button>
          <Button variant="secondary" onClick={() => setDraft({ priceInput: formatWithComma("5000000000"), price: 5000000000 })}>
            50억원
          </Button>
          <Button variant="secondary" onClick={() => setDraft({ priceInput: formatWithComma("10000000000"), price: 10000000000 })}>
            100억원
          </Button>
          <Button variant="secondary" onClick={() => setDraft({ priceInput: formatWithComma("50000000000"), price: 50000000000 })}>
            500억원
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
