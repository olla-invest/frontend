import Holidays from "date-holidays";
import { subDays } from "date-fns";
import type { DateRange } from "react-day-picker";

const hd = new Holidays("KR");

export const isTradingDay = (date: Date) => {
  const day = date.getDay();

  const isWeekend = day === 0 || day === 6;
  const isHoliday = !!hd.isHoliday(date);

  return !isWeekend && !isHoliday;
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

  while (count < tradingDays) {
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
