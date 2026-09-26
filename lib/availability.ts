// All times are in my working timezone: UTC+1, with no daylight saving.
export const UTC_OFFSET_HOURS = 1;
export const TIMEZONE_LABEL = "UTC+1";

// Core hours: when I'm reliably online. Flexible: evenings and weekends, by arrangement.
export const CORE = { days: [1, 2, 3, 4, 5], start: 9, end: 18 }; // Mon–Fri, 09:00–18:00
export const FLEX = { start: 8, end: 22 }; // every day, outside core hours

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Display order for the week strip: Monday first.
export const WEEK = [1, 2, 3, 4, 5, 6, 0];

export type Status = "core" | "flex" | "off";

/** My local day (0 = Sunday) and fractional hour for a given instant. */
export function myTime(now: Date) {
  const shifted = new Date(now.getTime() + UTC_OFFSET_HOURS * 3_600_000);
  return {
    day: shifted.getUTCDay(),
    hour: shifted.getUTCHours() + shifted.getUTCMinutes() / 60,
    label: `${String(shifted.getUTCHours()).padStart(2, "0")}:${String(shifted.getUTCMinutes()).padStart(2, "0")}`,
  };
}

export function statusAt(day: number, hour: number): Status {
  if (CORE.days.includes(day) && hour >= CORE.start && hour < CORE.end) return "core";
  if (hour >= FLEX.start && hour < FLEX.end) return "flex";
  return "off";
}

/** Formats one of my working hours (e.g. 9) in the visitor's own timezone. */
export function inVisitorTime(hour: number, reference: Date) {
  const instant = new Date(reference);
  instant.setUTCHours(hour - UTC_OFFSET_HOURS, 0, 0, 0);
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(instant);
}
