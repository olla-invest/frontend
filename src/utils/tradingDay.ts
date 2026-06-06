import Holidays from "date-holidays";
import { subDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";

const hd = new Holidays("KR");

// date-holidays가 처리 못하는 날짜 수동 관리
// - 임시공휴일 (선거일 등 정부 지정)
// - 대체공휴일 (date-holidays 미지원)
const EXTRA_HOLIDAYS = new Set([
  // 2023
  "20230102", // 대체공휴일 (신정)
  "20231002", // 임시공휴일

  // 2024
  "20240212", // 대체공휴일 (설날)
  "20240415", // 임시공휴일 (총선)
  "20241001", // 임시공휴일

  // 2025
  "20250127", // 임시공휴일 (설 연휴)

  // 2026
  "20260302", // 대체공휴일 (삼일절)
  "20260525", // 대체공휴일 (부처님오신날)
  "20260603", // 임시공휴일 (지방선거)
  "20260817", // 대체공휴일 (광복절)
  "20261005", // 대체공휴일 (개천절)

  // 2027년 이후 추가 예정
]);

export const isTradingDay = (date: Date) => {
  const day = date.getDay();

  const isWeekend = day === 0 || day === 6;
  const isHoliday = !!hd.isHoliday(date);
  const isExtraHoliday = EXTRA_HOLIDAYS.has(format(date, "yyyyMMdd"));

  return !isWeekend && !isHoliday && !isExtraHoliday;
};

export const getLatestTradingDay = (baseDate: Date = new Date()) => {
  let date = new Date(baseDate);

  while (!isTradingDay(date)) {
    date = subDays(date, 1);
  }

  return date;
};

export const getPreviousTradingDay = (tradingDays: number, baseDate: Date = new Date()) => {
  let date = new Date(baseDate);
  let count = 0;

  while (count < tradingDays + 1) {
    date = subDays(date, 1);

    if (isTradingDay(date)) {
      count++;
    }
  }

  return date;
};

export const getDefaultRSRange = (tradingDays: number = 63): DateRange => {
  const latestTradingDay = getLatestTradingDay();

  return {
    from: getPreviousTradingDay(tradingDays, latestTradingDay),
    to: latestTradingDay,
  };
};
