import type { EventClickArg } from "@fullcalendar/core";
import type { PopoverPosition } from "../types/calendar.types";

interface CalculatePopoverPositionParams {
  clickInfo: EventClickArg;
  containerRect: DOMRect;
  eventRect: DOMRect;
}

// Popover sizing constants
const POPOVER_WIDTH = 320;
const POPOVER_ESTIMATED_HEIGHT = 230;
const GAP = 12;

/**
 * Calculate optimal popover position based on event click
 * Ensures popover stays within container bounds
 * Adapts positioning based on calendar view type (day/week)
 */
export const calculatePopoverPosition = ({
  clickInfo,
  containerRect,
  eventRect,
}: CalculatePopoverPositionParams): PopoverPosition => {
  let top = 0;
  let left = 0;

  if (clickInfo.view.type === "timeGridDay") {
    // Day view: Position above/below event (vertical stacking)
    left =
      eventRect.left -
      containerRect.left +
      eventRect.width / 2 -
      POPOVER_WIDTH / 2;

    if (left < 0) left = GAP;
    if (left + POPOVER_WIDTH > containerRect.width) {
      left = containerRect.width - POPOVER_WIDTH - GAP;
    }

    top = eventRect.bottom - containerRect.top + GAP;

    if (top + POPOVER_ESTIMATED_HEIGHT > containerRect.height) {
      top = eventRect.top - containerRect.top - POPOVER_ESTIMATED_HEIGHT - GAP;
    }
  } else {
    // Week/Month view: Position left/right of event (horizontal stacking)
    left = eventRect.right - containerRect.left + GAP;
    top = eventRect.top - containerRect.top;

    // Horizontal boundary check
    if (left + POPOVER_WIDTH > containerRect.width) {
      left = eventRect.left - containerRect.left - POPOVER_WIDTH - GAP;
    }

    // Vertical boundary check
    if (top + POPOVER_ESTIMATED_HEIGHT > containerRect.height) {
      top = eventRect.bottom - containerRect.top - POPOVER_ESTIMATED_HEIGHT;

      if (top < GAP) {
        top = GAP;
      }
    }
  }

  return { top, left };
};
