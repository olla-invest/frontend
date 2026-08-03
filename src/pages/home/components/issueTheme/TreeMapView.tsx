import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import type { IssueTheme } from "@/types/api/issueTheme";
import { useIsMobile } from "@/hooks/use-mobile";

interface TreeMapViewProps {
  items: IssueTheme[];
  onSelect?: (item: IssueTheme) => void;
  colorBy?: "rs" | "rate"; // 기본값 "rs"
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
// RS 점수 구간별 색상
const getColorByRsScore = (score: number | null): string => {
  const rs = score ?? 0;
  if (rs >= 95) return "#f43f52";
  if (rs >= 90) return "#e8546a";
  if (rs >= 85) return "#cc6a7a";
  if (rs >= 80) return "#a9718a";
  return "#3B82F6";
};

// 등락률 구간별 색상
const getColorByChangeRate = (rate: number): string => {
  if (rate >= 10) return "#F43F5E";
  if (rate >= 3) return "#E8546A";
  if (rate >= 1) return "#CC6A7A";
  if (rate > 0) return "#A9718A";
  if (rate === 0) return "#64748B";
  if (rate > -1) return "#6B7D9E";
  if (rate > -3) return "#5B82B8";
  if (rate > -10) return "#4882CF";
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

// 컴포넌트 밖에 헬퍼 함수 추가
const measureCtx = typeof document !== "undefined" ? document.createElement("canvas").getContext("2d") : null;

// 테마명 말줄임 처리
const truncateText = (text: string, maxWidth: number, fontSize: number, fontWeight = 400): string => {
  if (!measureCtx) return text;
  measureCtx.font = `${fontWeight} ${fontSize}px sans-serif`;

  if (measureCtx.measureText(text).width <= maxWidth) return text;

  const ellipsis = "...";
  let low = 0;
  let high = text.length;

  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    const candidate = text.slice(0, mid) + ellipsis;
    if (measureCtx.measureText(candidate).width <= maxWidth) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return text.slice(0, low) + ellipsis;
};

interface CustomizedContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  changeRate: number;
  rsScore: number | null;
  colorBy: "rs" | "rate";
}

const CustomizedContent = (props: CustomizedContentProps) => {
  const { x, y, width, height, name, changeRate, rsScore, colorBy } = props;

  if (width <= 0 || height <= 0) return null;

  const fill = colorBy === "rate" ? getColorByChangeRate(changeRate) : getColorByRsScore(rsScore);
  const textColor = "#fff";
  const showText = width > 45 && height > 30;

  const displayName = showText ? truncateText(name, width - 16, 16, 700) : name;
  const changeRateText = `${changeRate > 0 ? "+" : ""}${changeRate}%`;

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
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill={textColor} fontSize={16} fontWeight={700}>
            {displayName}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fill={textColor} fontSize={14}>
            <tspan>{changeRateText}</tspan>
            <tspan dx={8}>RS</tspan>
            <tspan dx={4}>{rsScore ?? "-"}</tspan>
          </text>
        </>
      )}
    </g>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TreemapNode }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const changeRateText = `${data.changeRate > 0 ? "+" : ""}${data.changeRate}%`;

  return (
    <div className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 shadow-lg">
      <p className="text-sm font-bold text-white">{data.name}</p>
      <p className="text-xs text-slate-300">
        {changeRateText} · RS {data.rsScore ?? "-"}
      </p>
    </div>
  );
};

export default function TreeMapView({ items, onSelect, colorBy = "rs" }: TreeMapViewProps) {
  const data = buildTreemapData(items);
  const isMobile = useIsMobile();

  if (data.length === 0) {
    return <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">표시할 테마가 없습니다.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%" style={{ border: "2px solid #45556c" }}>
      <Treemap
        data={data}
        dataKey="size"
        aspectRatio={4 / 3}
        content={<CustomizedContent x={0} y={0} width={0} height={0} name="" changeRate={0} rsScore={null} colorBy={colorBy} />}
        isAnimationActive={false}
        onClick={(node: unknown) => {
          const clicked = node as { original?: IssueTheme } | undefined;
          if (clicked?.original && onSelect) {
            onSelect(clicked.original);
          }
        }}
      >
        {!isMobile && <Tooltip content={<CustomTooltip />} />}
      </Treemap>
    </ResponsiveContainer>
  );
}
