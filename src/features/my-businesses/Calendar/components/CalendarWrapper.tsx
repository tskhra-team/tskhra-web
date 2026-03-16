import PopOver from "@/features/my-businesses/Calendar/PopOver";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
  const calendarRef = useRef<any>(null);
  const { t, i18n } = useTranslation("dashboard");

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

  // Custom day header rendering
  const dayHeaderContent = (args: any) => {
    const dayMap: { [key: number]: string } = {
      0: t("calendar.days.sun"),
      1: t("calendar.days.mon"),
      2: t("calendar.days.tue"),
      3: t("calendar.days.wed"),
      4: t("calendar.days.thu"),
      5: t("calendar.days.fri"),
      6: t("calendar.days.sat"),
    };
    const dayName = dayMap[args.date.getDay()];

    // Show only day name in month view, with date in week/day views
    if (args.view.type === "dayGridMonth") {
      return dayName;
    }

    const date = args.date.getDate();
    const month = args.date.getMonth() + 1;
    return `${dayName}: ${date}/${month}`;
  };

  // Get month name from translations
  const getMonthName = (monthIndex: number) => {
    return t(`calendar.months.full.${monthIndex}`);
  };

  // Custom title formatting
  const updateTitle = (view: any, titleEl: HTMLElement) => {
    const start = view.currentStart;
    const end = view.currentEnd;

    if (view.type === "dayGridMonth") {
      // Month view: "March 2026"
      titleEl.textContent = `${getMonthName(start.getMonth())} ${start.getFullYear()}`;
    } else if (view.type === "timeGridWeek") {
      // Week view: "March 10 - 16, 2026"
      const startDay = start.getDate();
      const endDate = new Date(end);
      endDate.setDate(endDate.getDate() - 1);
      const endDay = endDate.getDate();
      const month = getMonthName(start.getMonth());
      const year = start.getFullYear();
      titleEl.textContent = `${month} ${startDay} - ${endDay}, ${year}`;
    } else {
      // Day view: "March 16, 2026"
      const day = start.getDate();
      const month = getMonthName(start.getMonth());
      const year = start.getFullYear();
      titleEl.textContent = `${month} ${day}, ${year}`;
    }
  };

  const viewDidMount = (info: any) => {
    const titleEl = info.el.querySelector(".fc-toolbar-title");
    if (titleEl) {
      updateTitle(info.view, titleEl);
    }
  };

  const datesSet = (info: any) => {
    const titleEl = containerRef.current?.querySelector(".fc-toolbar-title");
    if (titleEl) {
      updateTitle(info.view, titleEl as HTMLElement);
    }
  };

  // Update title on language change
  useEffect(() => {
    const titleEl = containerRef.current?.querySelector(".fc-toolbar-title");
    const calendarApi = calendarRef.current?.getApi();
    if (titleEl && calendarApi) {
      updateTitle(calendarApi.view, titleEl as HTMLElement);
    }
  }, [i18n.language]);

  return (
    <div className="relative h-175 p-4" ref={containerRef}>
      <FullCalendar
        ref={calendarRef}
        key={i18n.language}
        plugins={[dayGridPlugin, timeGridPlugin]}
        locale="ka"
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: t("calendar.buttons.today"),
          month: t("calendar.buttons.month"),
          week: t("calendar.buttons.week"),
          day: t("calendar.buttons.day"),
        }}
        dayHeaderContent={dayHeaderContent}
        viewDidMount={viewDidMount}
        datesSet={datesSet}
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
