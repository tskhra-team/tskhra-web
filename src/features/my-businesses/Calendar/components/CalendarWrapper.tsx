import { useModal } from "@/context/ModalContext";
import PopOver from "@/features/my-businesses/Calendar/PopOver";
import useCancelBooking from "@/features/my-businesses/Calendar/hooks/useCancelBooking";
import useApproveBooking from "@/features/my-businesses/Notifications/hooks/useApproveBooking";
import useRejectBooking from "@/features/my-businesses/Notifications/hooks/useRejectBooking";
import queryClient from "@/query/queryClient";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
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
  const { t, i18n } = useTranslation(["dashboard", "modal"]);

  const { minTime, maxTime, businessHours, events } = useCalendarData({
    schedule,
    bookings,
  });

  const { selectedBooking, popoverPos, handleEventClick, closePopover } =
    useEventPopover({
      bookings,
      containerRef,
    });

  useCalendarResize(containerRef);

  const { mutate: approveBooking, isPending: isApproving } =
    useApproveBooking();
  const { mutate: rejectBooking, isPending: isRejecting } = useRejectBooking();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const { showModal } = useModal();

  const handleApprove = (bookingId: string) => {
    showModal(
      "warning",
      t("modal:titles.approveBooking"),
      t("modal:messages.confirmApproveBooking"),
      t("modal:buttons.close"),
      () => {},
      t("modal:buttons.approve"),
      () => {
        approveBooking(
          { bookingId },
          {
            onSuccess: () => {
              toast.success(t("modal:messages.bookingApprovedSuccess"), {
                position: "top-center",
              });
              queryClient.invalidateQueries({
                queryKey: ["getScheduledBookings"],
              });
              queryClient.invalidateQueries({ queryKey: ["getNotifications"] });
              closePopover();
            },
            onError: () => {
              toast.error(t("modal:messages.cantApproveSuccess"), {
                position: "top-center",
              });
            },
          },
        );
      },
    );
  };

  const handleReject = (bookingId: string) => {
    showModal(
      "warning",
      t("modal:titles.rejectBooking"),
      t("modal:messages.confirmRejectBooking"),
      t("modal:buttons.close"),
      () => {},
      t("modal:buttons.reject"),
      () => {
        rejectBooking(
          { bookingId },
          {
            onSuccess: () => {
              toast.success(t("modal:messages.bookingRejectedSuccess"), {
                position: "top-center",
              });
              queryClient.invalidateQueries({ queryKey: ["getNotifications"] });
              queryClient.invalidateQueries({
                queryKey: ["getScheduledBookings"],
              });
              closePopover();
            },
            onError: () => {
              toast.error(t("modal:messages.cantRejectSuccess"), {
                position: "top-center",
              });
            },
          },
        );
      },
    );
  };

  const handleCancel = (bookingId: string) => {
    showModal(
      "warning",
      t("modal:titles.cancelBooking"),
      t("modal:messages.confirmCancelBooking"),
      t("modal:buttons.close"),
      () => {},
      t("modal:buttons.cancel"),
      () => {
        cancelBooking(
          { bookingId },
          {
            onSuccess: () => {
              toast.success(t("modal:messages.bookingCancelSuccess"), {
                position: "top-center",
              });
              queryClient.invalidateQueries({ queryKey: ["getNotifications"] });
              queryClient.invalidateQueries({
                queryKey: ["getScheduledBookings"],
              });
              closePopover();
            },
            onError: () => {
              toast.error(t("modal:messages.cantCancelBooking"), {
                position: "top-center",
              });
            },
          },
        );
      },
    );
  };

  const dayHeaderContent = (args: any) => {
    const dayMap: { [key: number]: string } = {
      0: "sun",
      1: "mon",
      2: "tue",
      3: "wed",
      4: "thu",
      5: "fri",
      6: "sat",
    };
    const dayName = t(`calendar.days.${dayMap[args.date.getDay()]}`);

    if (args.view.type === "dayGridMonth") {
      return dayName;
    }

    const formattedDate = new Intl.DateTimeFormat(i18n.language, {
      day: "2-digit",
      month: "2-digit",
    }).format(args.date);

    return `${dayName}: ${formattedDate}`;
  };

  useEffect(() => {
    if (!selectedBooking) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".popover-content")) return;
      if (target.closest(".fc-event")) return;
      closePopover();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedBooking, closePopover]);

  const getMonthName = (monthIndex: number) => {
    return t(`calendar.months.full.${monthIndex}`);
  };

  const updateTitle = (view: any, titleEl: HTMLElement) => {
    const start = view.currentStart;
    const end = new Date(view.currentEnd.getTime() - 1);

    const startMonth = getMonthName(start.getMonth());
    const startYear = start.getFullYear();
    const startDay = start.getDate();

    const endMonth = getMonthName(end.getMonth());
    const endYear = end.getFullYear();
    const endDay = end.getDate();

    let customTitle = "";

    if (view.type === "dayGridMonth") {
      customTitle = `${startMonth} ${startYear}`;
    } else if (view.type === "timeGridWeek") {
      if (startMonth === endMonth) {
        customTitle = `${startDay} - ${endDay} ${startMonth} ${startYear}`;
      } else if (startYear === endYear) {
        customTitle = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
      } else {
        customTitle = `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
      }
    } else {
      customTitle = `${startDay} ${startMonth} ${startYear}`;
    }

    titleEl.setAttribute("data-custom-title", customTitle);

    titleEl.classList.add("custom-fc-title");
  };

  const datesSet = (info: any) => {
    const titleEl = containerRef.current?.querySelector(".fc-toolbar-title");
    if (titleEl) {
      updateTitle(info.view, titleEl as HTMLElement);
    }
  };

  useEffect(() => {
    const titleEl = containerRef.current?.querySelector(".fc-toolbar-title");
    const calendarApi = calendarRef.current?.getApi();
    if (titleEl && calendarApi) {
      updateTitle(calendarApi.view, titleEl as HTMLElement);
    }
  }, [i18n.language, t]);

  return (
    <div className="relative h-175 p-4" ref={containerRef}>
      <style>{`
        .custom-fc-title {
          font-size: 0 !important;
        }
        .custom-fc-title::after {
          content: attr(data-custom-title); 
          font-size: 1.5rem;
          font-weight: 600;
          color: inherit;
        }
      `}</style>
      {/* this style added to hide default calendar title */}
      <FullCalendar
        datesSet={datesSet}
        buttonHints={{
          prev: " ",
          next: " ",
          today: " ",
          dayGridMonth: " ",
          timeGridWeek: " ",
          timeGridDay: " ",
        }}
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin]}
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
        firstDay={1}
        allDaySlot={false}
        businessHours={businessHours}
        events={events}
        editable={false}
        selectable={false}
        height="100%"
        slotMinTime={minTime}
        slotMaxTime={maxTime}
        eventDisplay="block"
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
        <PopOver
          popoverPos={popoverPos}
          closePopover={closePopover}
          minutesToTime={minutesToTime}
          selectedBooking={selectedBooking}
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={handleCancel}
          isPending={isApproving || isRejecting || isCancelling}
          isApproving={isApproving}
          isRejecting={isRejecting}
          isCancelling={isCancelling}
        />
      )}
    </div>
  );
};
