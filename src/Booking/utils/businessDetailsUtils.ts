// Mock available days (next 14 days)
export const getAvailableDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date,
      dateString: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return days;
};

// Helper function to convert time string (HH:MM) to minutes
export const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper function to convert minutes to time string (HH:MM)
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

// Convert API timeslot response (array of minutes) to time strings
export const convertTimeslotsToStrings = (timeslots: number[]): string[] => {
  return timeslots.map((minutes) => minutesToTime(minutes)).sort();
};

// Helper function to convert day name to day number (0 = Sunday, 1 = Monday, etc.)
export const dayNameToDayNumber = (dayName: string | number): number => {
  if (typeof dayName === "number") return dayName;

  const dayMap: Record<string, number> = {
    // Full names
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    // Abbreviated names (uppercase)
    SUN: 0,
    MON: 1,
    TUE: 2,
    WED: 3,
    THU: 4,
    FRI: 5,
    SAT: 6,
  };

  return dayMap[dayName] ?? dayMap[dayName.toLowerCase()] ?? -1;
};

// Mock available time slots filtered by working hours
export const getAvailableTimeSlots = (
  selectedDate: string | null,
  workTimes?: Array<{
    weekDay: string | number;
    startTime: number;
    endTime: number;
  }>,
  restTimes?: Array<{
    weekDay: string | number;
    startTime: number;
    endTime: number;
  }>,
) => {
  if (!selectedDate || !workTimes) return [];

  // Get the day of week for the selected date (0 = Sunday, 1 = Monday, etc.)
  const date = new Date(selectedDate);
  const dayOfWeek = date.getDay();

  // Find working hours for this day
  const workTime = workTimes.find((wt) => {
    const wtDay = dayNameToDayNumber(wt.weekDay);
    return wtDay === dayOfWeek;
  });

  if (!workTime) return []; // Business is closed this day

  // Find rest times for this day
  const restTime = restTimes?.find((rt) => {
    const rtDay = dayNameToDayNumber(rt.weekDay);
    return rtDay === dayOfWeek;
  });

  // Generate all possible time slots (every 30 minutes)
  const slots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
  ];

  // Filter slots based on working hours and rest times
  const availableSlots = slots.filter((slot) => {
    const slotMinutes = timeToMinutes(slot);

    // Check if slot is within working hours
    const isWithinWorkingHours =
      slotMinutes >= workTime.startTime && slotMinutes < workTime.endTime;

    // Check if slot is during rest time
    const isDuringRestTime = restTime
      ? slotMinutes >= restTime.startTime && slotMinutes < restTime.endTime
      : false;

    return isWithinWorkingHours && !isDuringRestTime;
  });

  return availableSlots;
};
