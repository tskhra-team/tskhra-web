import PopOver from "@/features/my-businesses/Calendar/PopOver";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useRef } from "react";
import { useCalendarData } from "../hooks/useCalendarData";
import { useCalendarResize } from "../hooks/useCalendarResize";
import { useEventPopover } from "../hooks/useEventPopover";
import type { MyCalendarProps } from "../types/calendar.types";
import { minutesToTime } from "../utils/calendarHelpers";
import { CalendarEventContent } from "./CalendarEventContent";

/**
 * Wrapper component that integrates FullCalendar with custom hooks
 * Handles data transformation, popover interactions, and responsive behavior
 */
export const CalendarWrapper = ({
  schedule,
  bookings = [],
}: MyCalendarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform data for FullCalendar
  const { minTime, maxTime, businessHours, events } = useCalendarData({
    schedule,
    bookings,
  });

  // Manage popover state and interactions
  const { selectedBooking, popoverPos, handleEventClick, closePopover } =
    useEventPopover({
      bookings,
      containerRef,
    });

  // Handle container resize
  useCalendarResize(containerRef);

  return (
    <div className="relative h-175 p-4" ref={containerRef}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        firstDay={1}
        allDaySlot={false}
        businessHours={businessHours}
        events={events}
        editable={false}
        selectable={false}
        height="100%"
        slotMinTime={minTime}
        slotMaxTime={maxTime}
        expandRows={true}
        eventContent={CalendarEventContent}
        nowIndicator={true}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventClassNames="cursor-pointer hover:brightness-95 transition-all shadow-sm rounded-md border-l-4"
        eventClick={handleEventClick}
      />

      {selectedBooking && (
        <div className="absolute inset-0 z-10" onClick={closePopover} />
      )}

      {selectedBooking && (
        <PopOver
          popoverPos={popoverPos}
          closePopover={closePopover}
          minutesToTime={minutesToTime}
          selectedBooking={selectedBooking}
        />
      )}
    </div>
  );
};
