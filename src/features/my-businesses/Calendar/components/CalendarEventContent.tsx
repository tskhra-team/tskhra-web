import type { EventContentArg } from "@fullcalendar/core";

/**
 * Custom event renderer for calendar bookings
 * Displays time and title with responsive layout
 */
export const CalendarEventContent = (eventInfo: EventContentArg) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 overflow-hidden px-1.5 py-0.5 text-xs h-full leading-tight">
      <span className="font-semibold whitespace-nowrap">
        {eventInfo.timeText}
      </span>

      <span className="hidden sm:inline opacity-70">-</span>

      <span className="truncate font-medium">{eventInfo.event.title}</span>
    </div>
  );
};
