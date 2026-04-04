import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PoliciesHeaderProps {
  title: string;
  useSelect: boolean;
  lastUpdate?: string;
}

export default function PoliciesHeader({ title, useSelect, lastUpdate = "" }: PoliciesHeaderProps) {
  const options = [{ value: "1", name: "yyyy.mm.dd" }];
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-foreground text-2xl font-semibold">{title}</h3>
      {useSelect && (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`${lastUpdate && "border-muted-foreground!"}`}>
                개정일 선택 <div className="size-0.5 bg-muted-foreground rounded-full" />
                <span className="text-muted-foreground">{lastUpdate}</span> <ChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-52 p-0" align="start">
              <DropdownMenuLabel className="border-b p-1">
                <div className="px-2 py-1.5">개정일</div>
              </DropdownMenuLabel>

              <DropdownMenuRadioGroup
                value={"all"}
                onValueChange={(value) => {
                  console.log(value);
                }}
              >
                <div className="px-2 py-1.5 flex flex-col gap-1">
                  {options.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.name}
                    </DropdownMenuRadioItem>
                  ))}
                </div>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-sm text-muted-foreground">최종 개정일 : {lastUpdate}</span>
        </div>
      )}
    </div>
  );
}
