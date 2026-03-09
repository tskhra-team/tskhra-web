import type { WeekDay } from "../types/calendar.types";

// Mapping of weekday names to FullCalendar day numbers
export const dayMap: Record<WeekDay, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

// Convert minutes from midnight to time string (HH:MM format)
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};
