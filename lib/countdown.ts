import { WEDDING_DATE } from "@/data/wedding";

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Time remaining until the wedding.
 *
 * The target is stored as an absolute instant (`2026-09-19T17:30:00+05:00`),
 * so the result is identical for a guest in Dushanbe, Moscow or New York — the
 * visitor's own time zone never shifts the countdown.
 */
export function getTimeLeft(now: number = Date.now()): TimeLeft {
  const diff = WEDDING_DATE.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
    finished: false,
  };
}

/** Zero-pads a countdown unit to at least two digits. */
export function pad(value: number, length = 2) {
  return String(Math.max(0, value)).padStart(length, "0");
}
