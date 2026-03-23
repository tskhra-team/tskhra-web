import { useTranslation } from "react-i18next";
import type { Booking } from "./types/calendar.types";

interface PopOverProps {
  popoverPos: { top: number; left: number };
  selectedBooking: Booking;
  closePopover: () => void;
  minutesToTime: (minutes: number) => string;
  onApprove: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  isPending: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  isCancelling: boolean;
}

export default function PopOver({
  popoverPos,
  selectedBooking,
  closePopover,
  minutesToTime,
  onApprove,
  onReject,
  onCancel,
  isPending,
  isApproving,
  isRejecting,
  isCancelling,
}: PopOverProps) {
  const { t } = useTranslation("dashboard");

  return (
    <div
      className="popover-content absolute z-20 bg-white rounded-xl shadow-2xl border border-slate-200 p-5 w-80 animate-in fade-in zoom-in duration-200"
      style={{
        top: `${popoverPos.top}px`,
        left: `${popoverPos.left}px`,
        pointerEvents: "auto",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {selectedBooking.serviceName}
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            {t("calendar.popover.bookingDetails")}
          </p>
        </div>
        <button
          onClick={closePopover}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span className="font-semibold text-slate-800">
            {selectedBooking.userName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span>
            {minutesToTime(selectedBooking.startTime)} –{" "}
            {minutesToTime(
              selectedBooking.startTime + selectedBooking.duration,
            )}
            <span className="ml-1 text-slate-400">
              ({selectedBooking.duration} {t("calendar.popover.min")})
            </span>
          </span>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            ₾{selectedBooking.price}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              selectedBooking.status === "SCHEDULED"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {t(`calendar.popover.status.${selectedBooking.status}`)}
          </span>
        </div>

        {selectedBooking.status === "AWAITING" ? (
          <div className="pt-3 flex gap-2">
            <button
              disabled={isPending}
              onClick={() => onApprove(selectedBooking.id)}
              className="flex-1 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
            >
              {isApproving ? "..." : t("calendar.popover.actions.approve")}
            </button>
            <button
              disabled={isPending}
              onClick={() => onReject(selectedBooking.id)}
              className="flex-1 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
            >
              {isRejecting ? "..." : t("calendar.popover.actions.reject")}
            </button>
          </div>
        ) : (
          <div className="pt-3">
            <button
              disabled={isPending}
              onClick={() => onCancel(selectedBooking.id)}
              className="w-full py-2 rounded-lg border border-rose-300 hover:bg-rose-50 disabled:opacity-50 text-rose-600 text-sm font-semibold transition-colors"
            >
              {isCancelling ? "..." : t("calendar.popover.actions.cancel")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
