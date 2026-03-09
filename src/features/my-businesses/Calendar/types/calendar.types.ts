// Calendar-related type definitions

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
  schedule: WorkSchedule[];
  bookings?: Booking[];
}

export interface PopoverPosition {
  top: number;
  left: number;
}
