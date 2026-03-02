import PopOver from "@/features/my-businesses/PopOver";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// --- ТИПЫ ДАННЫХ ---
export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type BookingStatus = "done" | "scheduled";

export interface WorkSchedule {
  weekDay: WeekDay;
  startTime: number;
  endTime: number;
  restStart?: number;
  restEnd?: number;
}

export interface Booking {
  date: Date;
  startTime: number;
  duration: number;
  status: BookingStatus;
  service: string;
  userName: string;
  price: number;
}

export interface MyCalendarProps {
  schedule?: WorkSchedule[];
  bookings?: Booking[];
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
const dayMap: Record<WeekDay, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

// --- МОКОВЫЕ ДАННЫЕ ДЛЯ ДЕМОНСТРАЦИИ ---
const defaultSchedule: WorkSchedule[] = [
  {
    weekDay: "MON",
    startTime: 540,
    endTime: 1080,
    restStart: 780,
    restEnd: 840,
  },
  {
    weekDay: "TUE",
    startTime: 540,
    endTime: 1080,
    restStart: 780,
    restEnd: 840,
  },
  {
    weekDay: "WED",
    startTime: 540,
    endTime: 1080,
    restStart: 780,
    restEnd: 840,
  },
  {
    weekDay: "THU",
    startTime: 540,
    endTime: 1080,
    restStart: 720,
    restEnd: 840,
  },
  {
    weekDay: "FRI",
    startTime: 540,
    endTime: 1020,
    restStart: 780,
    restEnd: 840,
  },
];

const defaultBookings: Booking[] = [
  {
    date: new Date(),
    startTime: 1020,
    duration: 25,
    status: "scheduled",
    service: "თმის შეჭრა",
    userName: "მიშა",
    price: 40,
  },
  {
    date: new Date(),
    startTime: 900,
    duration: 45,
    status: "scheduled",
    service: "თმის შეღებვა",
    userName: "მიშა",
    price: 120,
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: 660,
    duration: 45,
    status: "done",
    service: "უკლადკა",
    userName: "ელენე",
    price: 50,
  },
];

const ReadOnlyCalendar: React.FC<MyCalendarProps> = ({
  schedule = defaultSchedule,
  bookings = defaultBookings,
}) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const closePopover = useCallback(() => {
    setSelectedBooking(null);
  }, []);

  // --- ОБНОВЛЕННАЯ ЛОГИКА КЛИКА ---
  const handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.event.extendedProps.price === undefined) return;

    const bookingIndex = parseInt(clickInfo.event.id.replace("booking-", ""));
    const booking = bookings[bookingIndex];

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const eventRect = clickInfo.el.getBoundingClientRect();

      const popoverWidth = 320;
      const popoverEstimatedHeight = 230; // Примерная высота попапа с запасом
      const gap = 12;

      let top = 0;
      let left = 0;

      if (clickInfo.view.type === "timeGridDay") {
        // --- ЛОГИКА ДЛЯ ДНЯ (Сверху/Снизу) ---
        left =
          eventRect.left -
          containerRect.left +
          eventRect.width / 2 -
          popoverWidth / 2;

        if (left < 0) left = gap;
        if (left + popoverWidth > containerRect.width) {
          left = containerRect.width - popoverWidth - gap;
        }

        top = eventRect.bottom - containerRect.top + gap;

        if (top + popoverEstimatedHeight > containerRect.height) {
          top =
            eventRect.top - containerRect.top - popoverEstimatedHeight - gap;
        }
      } else {
        // --- ЛОГИКА ДЛЯ НЕДЕЛИ (Справа/Слева) ---
        left = eventRect.right - containerRect.left + gap;
        top = eventRect.top - containerRect.top;

        // 1. Горизонтальная проверка (не вылезает ли вправо?)
        if (left + popoverWidth > containerRect.width) {
          left = eventRect.left - containerRect.left - popoverWidth - gap;
        }

        // 2. ВЕРТИКАЛЬНАЯ ПРОВЕРКА (Исправление обрезки снизу)
        if (top + popoverEstimatedHeight > containerRect.height) {
          // Если вылезает вниз, рисуем его "вверх" от нижней границы события
          top = eventRect.bottom - containerRect.top - popoverEstimatedHeight;

          // Подстраховка: если он теперь вылез за ВЕРХНИЙ край, прижмем к потолку
          if (top < gap) {
            top = gap;
          }
        }
      }

      setPopoverPos({ top, left });
      setSelectedBooking(booking);
    }
  };

  const { minTime, maxTime } = useMemo(() => {
    const minS = Math.min(...schedule.map((d) => d.startTime - 60));
    const maxE = Math.max(...schedule.map((d) => d.endTime + 60));
    return {
      minTime: minutesToTime(Math.max(0, minS)) + ":00",
      maxTime: minutesToTime(Math.min(1439, maxE)) + ":00",
    };
  }, [schedule]);

  const businessHours = useMemo(() => {
    return schedule.map((day) => ({
      daysOfWeek: [dayMap[day.weekDay]],
      startTime: minutesToTime(day.startTime),
      endTime: minutesToTime(day.endTime),
    }));
  }, [schedule]);

  const events: EventInput[] = useMemo(() => {
    const allEvents: EventInput[] = [];

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

  // Следим за изменением ширины контейнера (например, при закрытии сайдбара)
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      // Когда размер меняется, вызываем глобальное событие resize.
      // Задержка 50мс нужна, чтобы дождаться окончания CSS-анимации сайдбара.
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 50);
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">My Schedule</h2>
        </div>

        <div className="relative h-175 p-4" ref={containerRef}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay", // Кнопка timeGridDay
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
            eventContent={(eventInfo) => {
              return (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 overflow-hidden px-1.5 py-0.5 text-xs h-full leading-tight">
                  {/* Время */}
                  <span className="font-semibold whitespace-nowrap">
                    {eventInfo.timeText}
                  </span>

                  {/* Разделитель (показываем только если текст идет в одну строку) */}
                  <span className="hidden sm:inline opacity-70">-</span>

                  {/* Название (будет обрезаться троеточием, если не влезает) */}
                  <span className="truncate font-medium">
                    {eventInfo.event.title}
                  </span>
                </div>
              );
            }}
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
      </div>
    </div>
  );
};

export default ReadOnlyCalendar;
