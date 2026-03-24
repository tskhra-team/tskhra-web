// Get available days (next 14 days) with availability status based on work times
export const getAvailableDays = (
  workTimes?: Array<{
    weekDay: string | number;
    startTime: number;
    endTime: number;
  }>,
) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.getDay();

    // Check if business has work times for this day
    const hasWorkTime = workTimes?.some((wt) => {
      const wtDay = dayNameToDayNumber(wt.weekDay);
      return wtDay === dayOfWeek;
    });

    days.push({
      date: date,
      dateString: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString("en-US", { month: "short" }),
      isAvailable: hasWorkTime ?? true, // If no workTimes provided, assume available
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

// Generate time slots at specified interval (in minutes)
export const generateTimeSlots = (
  startMinutes: number = 540, // 09:00
  endMinutes: number = 1260, // 21:00
  intervalMinutes: number = 10
): string[] => {
  const slots: string[] = [];
  for (let minutes = startMinutes; minutes <= endMinutes; minutes += intervalMinutes) {
    slots.push(minutesToTime(minutes));
  }
  return slots;
};

// Convert API timeslot response (array of minutes) to time strings
export const convertTimeslotsToStrings = (timeslots: number[]): string[] => {
  return timeslots.map((minutes) => minutesToTime(minutes)).sort();
};

// Generate all timeslots with availability status
export const getAllTimeslotsWithAvailability = (
  selectedDate: string | null,
  availableTimeslotsFromAPI: number[] | undefined,
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
): Array<{ time: string; isAvailable: boolean }> => {
  if (!selectedDate || !workTimes) return [];

  // Get the day of week for the selected date (0 = Sunday, 1 = Monday, etc.)
  // Parse date as local time to avoid timezone issues
  const [year, month, day] = selectedDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
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

  // Generate all possible time slots based on actual working hours (every 10 minutes)
  const allSlots = generateTimeSlots(workTime.startTime, workTime.endTime, 10);

  // Convert API available timeslots to strings for comparison
  const hasAPIData = availableTimeslotsFromAPI && availableTimeslotsFromAPI.length > 0;
  const availableTimesSet = new Set(
    hasAPIData ? convertTimeslotsToStrings(availableTimeslotsFromAPI) : []
  );

  // Filter and map slots to include availability status
  const timeslotsWithAvailability = allSlots
    .map((slot) => {
      const slotMinutes = timeToMinutes(slot);

      // Check if slot is within working hours
      const isWithinWorkingHours =
        slotMinutes >= workTime.startTime && slotMinutes < workTime.endTime;

      // Check if slot is during rest time
      const isDuringRestTime = restTime
        ? slotMinutes >= restTime.startTime && slotMinutes < restTime.endTime
        : false;

      // If not within working hours or during rest time, skip this slot entirely
      if (!isWithinWorkingHours || isDuringRestTime) {
        return null;
      }

      // If we have API data, use it to determine availability
      // If no API data, assume all slots within working hours are available
      const isAvailable = hasAPIData
        ? availableTimesSet.has(slot)
        : true;

      return {
        time: slot,
        isAvailable,
      };
    })
    .filter((slot): slot is { time: string; isAvailable: boolean } => slot !== null);

  return timeslotsWithAvailability;
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
  // Parse date as local time to avoid timezone issues
  const [year, month, day] = selectedDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
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

  // Generate all possible time slots based on actual working hours (every 10 minutes)
  const slots = generateTimeSlots(workTime.startTime, workTime.endTime, 10);

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
