import { DateYearSelect } from "@/components/DateYearSelect";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
export default function DetailStockInfo() {
  const sampleBasicInfo1 = [
    { title: "업종", content: "지주회사" },
    { title: "테마", content: "반도체 / ICT 투자" },
    { title: "상장일", content: "2021-11-01" },
    { title: "시가총액", content: "NNNN 조원" },
  ];
  const sampleBasicInfo2 = [
    { title: "실제 기업가치", content: "NNNN 조원" },
    { title: "주요사업", content: "반도체 투자 (SK 하이닉스 등)ICT·플랫폼·콘텐츠 기업 투자 자회사 가치 제고 및 신규 투자 발굴" },
  ];
  return (
    <div className="flex flex-col gap-4">
      {/* ai */}
      <section className="w-full py-2 flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <h3 className="font-semibold text-xl">SK하이닉스</h3>
          <div className="flex gap-1 items-center text-muted-foreground text-sm">
            <span>000660</span>
            <div className="size-0.5 bg-muted-foreground"></div>
            <span>KOSPI</span>
          </div>
        </div>
        <div className="rounded-md p-4 bg-muted flex gap-1">
          <i className="icon icon-star-four-color" />
          <div className="flex flex-col gap-1 text-sm">
            <b className="font-semibold">AI 기업 요약으로 기업정보를 확인해보세요!</b>
            <p className="text-slate-700 ">동사는 1949년 설립되어 경기도 이천시에 본사를 두고 4개의 생산기지와 3개의 연구개발법인 및 여러 해외 판매법인을 운영하는 글로벌 반도체 기업임.</p>
          </div>
        </div>
      </section>

      {/* 기본정보 */}
      <section className="w-full py-2 flex flex-col gap-4">
        <h3 className="font-semibold text-xl">기본 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="px-2 py-4 border-y flex flex-col gap-2">
            {sampleBasicInfo1.map((e, i) => {
              return (
                <div className="flex gap-1 text-sm" key={i}>
                  <span className="text-muted-foreground shrink-0 min-w-30">{e.title}</span>
                  <span className="font-semibold">{e.content}</span>
                </div>
              );
            })}
          </div>
          <div className="px-2 py-4 border-y flex flex-col gap-2">
            {sampleBasicInfo2.map((e, i) => {
              return (
                <div className="flex gap-1 text-sm" key={i}>
                  <span className="text-muted-foreground shrink-0 min-w-30">{e.title}</span>
                  <span className="font-semibold">{e.content}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 재무 퀄리티 */}
      <section className="w-full py-2 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-xl">재무 퀄리티</h3>
          <DateYearSelect />
        </div>

        <div className="flex flex-col gap-1">
          <span>손익 현황</span>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">구분</TableHead>
                <TableHead className="text-muted-foreground text-right">1Q</TableHead>
                <TableHead className="text-muted-foreground text-right">2Q</TableHead>
                <TableHead className="text-muted-foreground text-right">3Q</TableHead>
                <TableHead className="text-muted-foreground text-right">4Q</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="h-12.25">
                <TableCell className="text-muted-foreground">매출액</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
              </TableRow>
              <TableRow className="h-12.25">
                <TableCell className="text-muted-foreground">영업이익</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
              </TableRow>
              <TableRow className="h-12.25">
                <TableCell className="text-muted-foreground">당기순이익</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
                <TableCell className="text-right">NNNN억</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
