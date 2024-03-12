import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserLocale() {
  return typeof window !== "undefined" ? navigator.language : "en-US";
}

export function getRelativeTimeString(
  date: Date | number,
  lang = getUserLocale(),
): string {
  const timeMs = typeof date === "number" ? date : date.getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  if (Math.abs(deltaSeconds) < 60) {
    return "just now";
  }

  const cutoffs = [
    60,
    3600,
    86_400,
    86_400 * 7,
    86_400 * 30,
    86_400 * 365,
    Infinity,
  ];

  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ];

  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds),
  );
  const divisor = (unitIndex ? cutoffs[unitIndex - 1] : 1) ?? 1;
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]!);
}
