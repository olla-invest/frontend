import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function ChartFilter() {
  return (
    <div className="mt-2 pb-4 border-b">
      <form className="flex gap-2">
        <Tabs defaultValue="all">
          <TabsList className="p-0.75">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="kospi">코스피</TabsTrigger>
            <TabsTrigger value="kosdaq">코스닥</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline">
          RS 상세설정 <ChevronDown />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              신고가 여부 <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 p-0" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="border-b p-1">
                <div className="px-2 py-1.5">신고가 여부</div>
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={"all"} className="px-2 py-1.5">
                <DropdownMenuRadioItem value="all">전체기간</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="true">신고가</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="false">신고가 미해당(-표시)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              태마 <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 p-0" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="border-b p-1">
                <div className="px-2 py-1.5">테마</div>
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={"all"} className="px-2 py-1.5">
                <DropdownMenuRadioItem value="all">전체</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="semiconductor">반도체</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ai">AI</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <ButtonGroup>
          <ButtonGroupText className="bg-white text-foreground">거래대금</ButtonGroupText>
          <Input className="text-muted-foreground text-right" placeholder="1,000,000,000" />
          <ButtonGroupText className="bg-white text-foreground">원</ButtonGroupText>
        </ButtonGroup>
        <Button type="button" variant="outline" className="text-primary">
          조회
        </Button>
      </form>
    </div>
  );
}
