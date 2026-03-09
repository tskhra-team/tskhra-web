import { useEffect, type RefObject } from "react";

/**
 * Monitor container size changes and trigger FullCalendar resize
 * FullCalendar needs window resize event to recalculate dimensions
 */
export const useCalendarResize = (
  containerRef: RefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 50);
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);
};
