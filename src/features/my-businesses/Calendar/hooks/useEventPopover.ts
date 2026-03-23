import type { EventClickArg } from "@fullcalendar/core";
import { useCallback, useState, type RefObject } from "react";
import type { Booking, PopoverPosition } from "../types/calendar.types";
import { calculatePopoverPosition } from "../utils/popoverPositioning";

interface UseEventPopoverParams {
  bookings: Booking[];
  containerRef: RefObject<HTMLDivElement | null>;
}

interface UseEventPopoverReturn {
  selectedBooking: Booking | null;
  popoverPos: PopoverPosition;
  handleEventClick: (clickInfo: EventClickArg) => void;
  closePopover: () => void;
}

/**
 * Manage popover state and positioning for booking event clicks
 * Handles click detection, position calculation, and popover visibility
 */
export const useEventPopover = ({
  bookings,
  containerRef,
}: UseEventPopoverParams): UseEventPopoverReturn => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [popoverPos, setPopoverPos] = useState<PopoverPosition>({
    top: 0,
    left: 0,
  });

  const closePopover = useCallback(() => {
    setSelectedBooking(null);
  }, []);

  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      // Ignore clicks on background events (rest times)
      if (clickInfo.event.extendedProps.price === undefined) return;

      const booking = bookings.find((b) => b.id === clickInfo.event.id) ?? null;

      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const eventRect = clickInfo.el.getBoundingClientRect();

        const position = calculatePopoverPosition({
          clickInfo,
          containerRect,
          eventRect,
        });

        setPopoverPos(position);
        setSelectedBooking(booking);
      }
    },
    [bookings, containerRef],
  );

  return {
    selectedBooking,
    popoverPos,
    handleEventClick,
    closePopover,
  };
};
