import type { EventInput } from "@fullcalendar/core";
import { useMemo } from "react";
import type { Booking, WorkSchedule } from "../types/calendar.types";
import { dayMap, minutesToTime } from "../utils/calendarHelpers";

interface UseCalendarDataParams {
  schedule: WorkSchedule[];
  bookings: Booking[];
}

interface CalendarData {
  minTime: string;
  maxTime: string;
  businessHours: Array<{
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
  }>;
  events: EventInput[];
}

/**
 * Transform schedule and bookings into FullCalendar-compatible data structures
 * Calculates time boundaries, business hours, and events (rest times + bookings)
 */
export const useCalendarData = ({
  schedule,
  bookings,
}: UseCalendarDataParams): CalendarData => {
  // Calculate minimum and maximum calendar display times
  const { minTime, maxTime } = useMemo(() => {
    if (schedule.length === 0) {
      return { minTime: "08:00:00", maxTime: "20:00:00" };
    }
    const minS = Math.min(...schedule.map((d) => d.startTime - 60));
    const maxE = Math.max(...schedule.map((d) => d.endTime + 60));
    return {
      minTime: minutesToTime(Math.max(0, minS)) + ":00",
      maxTime: minutesToTime(Math.min(1439, maxE)) + ":00",
    };
  }, [schedule]);

  // Transform work schedule into FullCalendar business hours format
  const businessHours = useMemo(() => {
    return schedule.map((day) => ({
      daysOfWeek: [dayMap[day.weekDay]],
      startTime: minutesToTime(day.startTime),
      endTime: minutesToTime(day.endTime),
    }));
  }, [schedule]);

  // Generate all calendar events (rest times as background + bookings)
  const events: EventInput[] = useMemo(() => {
    const allEvents: EventInput[] = [];

    // Add rest times as background events (red shading)
    schedule.forEach((day) => {
      if (day.restStart !== undefined && day.restEnd !== undefined) {
        allEvents.push({
          daysOfWeek: [dayMap[day.weekDay]],
          startTime: minutesToTime(day.restStart),
          endTime: minutesToTime(day.restEnd),
          display: "background",
          backgroundColor: "#fee2e2",
        });
      }
    });

    // Add bookings as regular events
    bookings.forEach((booking, index) => {
      const dateStr = booking.date.toISOString().split("T")[0];
      allEvents.push({
        id: `booking-${index}`,
        title: `${booking.service}: ${booking.userName}`,
        start: `${dateStr}T${minutesToTime(booking.startTime)}:00`,
        end: `${dateStr}T${minutesToTime(booking.startTime + booking.duration)}:00`,
        backgroundColor: booking.status === "done" ? "#10b981" : "#fbbf24",
        borderColor: "transparent",
        extendedProps: {
          price: booking.price,
          status: booking.status,
        },
      });
    });

    return allEvents;
  }, [schedule, bookings]);

  return {
    minTime,
    maxTime,
    businessHours,
    events,
  };
};
