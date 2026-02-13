interface ThemeInfo {
  code: number;
  name: string;
  description: string;
}
export const THEME_CODES: ThemeInfo[] = [
  { code: 100, name: "제조업", description: "제조업 전반 (제약, 금속, 건설, 자동차, 전자, 화학, 음식료, 섬유, 기계 등)" },
  { code: 200, name: "서비스업", description: "서비스업 전반 (유통, 통신, 에너지, 미디어, 여행, 교육, 의료 등)" },
  { code: 300, name: "IT/기술", description: "IT 및 기술 산업 (소프트웨어, 반도체, 바이오, 게임 등)" },
  { code: 400, name: "금융", description: "금융업 (은행, 증권, 보험 등)" },
  { code: 500, name: "운송/물류", description: "운송 및 물류업 (해운, 항공, 물류 등)" },
  { code: 900, name: "기타", description: "기타 업종" },
];
