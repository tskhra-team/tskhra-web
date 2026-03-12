import React from "react";
import { useTranslation } from "react-i18next";
import { CalendarWrapper } from "./components/CalendarWrapper";
import type { MyCalendarProps } from "./types/calendar.types";

/**
 * Read-only calendar component for displaying business schedule and bookings
 * Wrapper component providing UI shell for CalendarWrapper
 */
const ReadOnlyCalendar: React.FC<MyCalendarProps> = ({
  schedule,
  bookings = [],
}) => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="p-6 min-h-screen">
      <div className="flex gap-2 mb-10">
        <div className="bg-[#dbeafe] h-5 w-5  border rounded-2xl"></div>
        <p className="font-bold text-sm pr-5">{t("calendar.legend.currentDay")}</p>

        <div className="bg-[#fee2e2] h-5 w-5 border rounded-2xl"></div>
        <p className="font-bold text-sm pr-5">{t("calendar.legend.restTime")}</p>

        <div className="bg-[#f1f5f9] h-5 w-5  border rounded-2xl"></div>
        <p className="font-bold text-sm pr-5">{t("calendar.legend.notWorkingPeriod")}</p>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">{t("calendar.title")}</h2>
        </div>

        <CalendarWrapper schedule={schedule} bookings={bookings} />
      </div>
    </div>
  );
};

export default ReadOnlyCalendar;

// Re-export types for backward compatibility
export type {
  Booking,
  BookingStatus,
  MyCalendarProps,
  WeekDay,
  WorkSchedule,
} from "./types/calendar.types";
