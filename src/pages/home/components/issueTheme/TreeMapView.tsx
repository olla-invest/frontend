import { Treemap, ResponsiveContainer } from "recharts";
import type { IssueTheme } from "@/types/api/issueTheme";

interface TreeMapViewProps {
  items: IssueTheme[];
  onSelect?: (item: IssueTheme) => void;
}

interface TreemapNode {
  name: string;
  size: number;
  changeRate: number;
  rsScore: number | null;
  themeCode: number;
  original: IssueTheme;
}

// RS 점수 구간별 색상
const getColorByRsScore = (score: number | null): string => {
  const rs = score ?? 0;
  if (rs >= 95) return "#f43f52";
  if (rs >= 90) return "#e8546a";
  if (rs >= 85) return "#cc6a7a";
  if (rs >= 80) return "#a9718a";
  return "#3B82F6";
};

const buildTreemapData = (items: IssueTheme[]): TreemapNode[] =>
  items.map((item) => ({
    name: item.themeName,
    // 종목수가 0/음수인 경우를 대비해 최소 1 보장
    size: Math.max(item.stockCount ?? 1, 1),
    changeRate: item.changeRate ?? 0,
    rsScore: item.rsScore,
    themeCode: item.themeCode,
    original: item,
  }));

// recharts Treemap의 content 렌더 프롭 (내부적으로 x,y,width,height + dataKey로 넘긴 값들이 함께 전달됨)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomizedContent = (props: any) => {
  const { x, y, width, height, name, changeRate, rsScore } = props;

  if (width <= 0 || height <= 0) return null;

  const fill = getColorByRsScore(rsScore);
  const textColor = "#fff";
  const showText = width > 45 && height > 30;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill,
          stroke: "#475569",
          strokeWidth: 2,
          cursor: "pointer",
        }}
      />
      {showText && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill={textColor} fontSize={12} fontWeight={600}>
            {name}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fill={textColor} fontSize={11}>
            {changeRate > 0 ? "+" : ""}
            {changeRate}%
          </text>
          {width > 70 && height > 55 && (
            <text x={x + width / 2} y={y + height / 2 + 28} textAnchor="middle" fill={textColor} fontSize={10} opacity={0.85}>
              RS {rsScore ?? "-"}
            </text>
          )}
        </>
      )}
    </g>
  );
};

export default function TreeMapView({ items, onSelect }: TreeMapViewProps) {
  const data = buildTreemapData(items);

  if (data.length === 0) {
    return <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">표시할 테마가 없습니다.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%" style={{ border: "2px solid #45556c" }}>
      <Treemap
        data={data}
        dataKey="size"
        aspectRatio={4 / 3}
        content={<CustomizedContent />}
        isAnimationActive={false}
        onClick={(node: unknown) => {
          const clicked = node as { original?: IssueTheme } | undefined;
          if (clicked?.original && onSelect) {
            onSelect(clicked.original);
          }
        }}
      />
    </ResponsiveContainer>
  );
}
