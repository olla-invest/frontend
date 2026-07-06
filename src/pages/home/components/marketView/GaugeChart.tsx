import gaugeChartBg from "@/assets/images/gaugeLabelBg.png";
/**
 * SignalGauge — 매매 신호 게이지 컴포넌트
 *
 * Props:
 *   signal   "sell" | "neutral" | "buy"   — 활성 신호 구분
 *   label    string                        — 하단 텍스트 (기본: "단기")
 *
 * 색상 규칙:
 *   매수(상승) 활성   → rose-500  (#f43f5e)
 *   매수(상승) 비활성 → rose-200  (#fecdd3)
 *   매도(하락) 활성   → blue-500  (#030303)
 *   매도(하락) 비활성 → blue-200  (#bfdbfe)
 *   중립 활성         → slate-500 (#64748b)
 *   중립 비활성       → slate-200 (#e2e8f0)
 */

export type Signal = "sell" | "neutral" | "buy" | "none";

interface SignalGaugeProps {
  signal?: Signal;
  label?: string;
}

interface ColorSet {
  active: string;
  inactive: string;
}

const COLORS: Record<Signal, ColorSet> = {
  sell: {
    active: "#3b82f6", // blue-500
    inactive: "#bfdbfe", // blue-200
  },
  neutral: {
    active: "#64748b", // slate-500
    inactive: "#e2e8f0", // slate-200
  },
  buy: {
    active: "#f43f5e", // rose-500
    inactive: "#fecdd3", // rose-200
  },
  none: {
    active: "",
    inactive: "",
  },
};

/**
 * SVG arc helper
 * cx, cy   : center
 * r        : radius
 * startDeg : start angle in degrees
 * endDeg   : end angle in degrees
 */
function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number): number => ((d - 180) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

/**
 * 바늘 각도 (degrees)
 *   매도: 30°  (왼쪽 구간 중앙)
 *   중립: 90°  (위쪽 정중앙)
 *   매수: 150° (오른쪽 구간 중앙)
 */
const NEEDLE_ANGLE: Record<Signal, number> = {
  sell: 30,
  neutral: 90,
  buy: 150,
  none: 0,
};

const NEEDLE_LENGTH = 80;
const GAP_DEG = 2;

interface Point {
  x: number;
  y: number;
}

function getNeedleCoords(cx: number, cy: number, angleDeg: number, length: number): Point {
  const rad = ((angleDeg - 180) * Math.PI) / 180;
  return {
    x: cx + length * Math.cos(rad),
    y: cy + length * Math.sin(rad),
  };
}

export default function GaugeChart({ signal = "neutral", label = "단기" }: SignalGaugeProps) {
  const cx = 180;
  const cy = 180;
  const r = 116;
  const strokeWidth = 36;

  const sellColor = signal === "sell" ? COLORS.sell.active : COLORS.sell.inactive;
  const neutralColor = signal === "neutral" ? COLORS.neutral.active : COLORS.neutral.inactive;
  const buyColor = signal === "buy" ? COLORS.buy.active : COLORS.buy.inactive;

  const needleDeg = NEEDLE_ANGLE[signal] ?? 90;
  const needle = getNeedleCoords(cx, cy, needleDeg, NEEDLE_LENGTH);

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      <svg
        viewBox="0 0 360 230"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", maxWidth: 230, display: "block" }}
        aria-label={`매매 신호: ${signal === "sell" ? "매도" : signal === "buy" ? "매수" : "중립"}`}
        role="img"
      >
        {/* 매도 호 (0° ~ 60°) */}
        <path d={describeArc(cx, cy, r, 0, 60 - GAP_DEG)} stroke={sellColor} strokeWidth={strokeWidth} strokeLinecap="butt" fill="none" style={{ transition: "stroke 0.35s ease" }} />

        {/* 중립 호 (60° ~ 120°) */}
        <path d={describeArc(cx, cy, r, 60 + GAP_DEG, 120 - GAP_DEG)} stroke={neutralColor} strokeWidth={strokeWidth} strokeLinecap="butt" fill="none" style={{ transition: "stroke 0.35s ease" }} />

        {/* 매수 호 (120° ~ 180°) */}
        <path d={describeArc(cx, cy, r, 120 + GAP_DEG, 180)} stroke={buyColor} strokeWidth={strokeWidth} strokeLinecap="butt" fill="none" style={{ transition: "stroke 0.35s ease" }} />

        {/* 레이블: 중립 */}
        <text x={cx} y={30} textAnchor="middle" fontSize={"16px"} fill={"#64748B"} fontFamily="inherit" style={{ transition: "fill 0.35s ease" }}>
          중립
        </text>

        {/* 레이블: 매도 */}
        <text x={35} y={120} textAnchor="middle" fontSize={"16px"} fill={"#64748B"} fontFamily="inherit" style={{ transition: "fill 0.35s ease" }}>
          매도
        </text>

        {/* 레이블: 매수 */}
        <text x={325} y={120} textAnchor="middle" fontSize={"16px"} fill={"#64748B"} fontFamily="inherit" style={{ transition: "fill 0.35s ease" }}>
          매수
        </text>

        {/* 바늘 */}
        <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke="#94a3b8" strokeWidth={3.5} strokeLinecap="round" style={{ transition: "x2 0.45s ease, y2 0.45s ease" }} />

        {/* 중심 원 */}
        <image
          href={gaugeChartBg}
          x={cx - 56} // 이미지 중심 맞춤 (이미지 너비의 절반)
          y={cy - 38} // 이미지 중심 맞춤 (이미지 높이의 절반)
          width={112}
          height={56}
        />

        {/* 하단 레이블 */}
        <text x={cx} y={cy + 4} textAnchor="middle" dominantBaseline="middle" fontSize={20} fontWeight={600} fill="#1e293b" fontFamily="inherit">
          {label}
        </text>
      </svg>
    </div>
  );
}
