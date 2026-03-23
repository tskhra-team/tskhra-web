import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Coffee, Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type WorkTimeType } from "./IndividualBusinessSchema";

interface WorkingScheduleProps {
  workTimes: WorkTimeType[];
  restTimes?: WorkTimeType[];
  onWorkTimesChange: (workTimes: WorkTimeType[]) => void;
  onRestTimesChange: (restTimes: WorkTimeType[]) => void;
  workTimesErrors?: any;
  restTimesErrors?: any;
}

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function WorkingSchedule({
  workTimes = [],
  restTimes = [],
  onWorkTimesChange,
  onRestTimesChange,
  workTimesErrors,
  restTimesErrors,
}: WorkingScheduleProps) {
  const { t } = useTranslation("booking");

  const timeToMinutes = (time: string) => {
    if (!time || !time.includes(":")) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  const removeRestTime = (dayKey: string) => {
    onRestTimesChange(restTimes.filter((t) => t.weekDay !== dayKey));
  };

  const toggleDay = (dayKey: string) => {
    const existingIndex = workTimes.findIndex((t) => t.weekDay === dayKey);

    if (existingIndex >= 0) {
      onWorkTimesChange(workTimes.filter((_, i) => i !== existingIndex));
      removeRestTime(dayKey);
    } else {
      onWorkTimesChange([
        ...workTimes,
        { weekDay: dayKey, startTime: 540, endTime: 1080 },
      ]);
    }
  };

  const updateWorkTime = (
    dayKey: string,
    timeType: "startTime" | "endTime",
    value: string,
  ) => {
    if (!value) return;
    const minutes = timeToMinutes(value);
    if (isNaN(minutes)) return;
    onWorkTimesChange(
      workTimes.map((t) =>
        t.weekDay === dayKey ? { ...t, [timeType]: minutes } : t,
      ),
    );
  };

  const toggleRestTime = (dayKey: string) => {
    const existingIndex = restTimes.findIndex((t) => t.weekDay === dayKey);

    if (existingIndex >= 0) {
      removeRestTime(dayKey);
    } else {
      const workDay = workTimes.find((t) => t.weekDay === dayKey);
      if (workDay) {
        const defaultStart = 780; // 13:00
        const defaultEnd = 840; // 14:00

        onRestTimesChange([
          ...restTimes,
          {
            weekDay: dayKey,
            startTime: Math.max(workDay.startTime, defaultStart),
            endTime: Math.min(workDay.endTime, defaultEnd),
          },
        ]);
      }
    }
  };

  const updateRestTime = (
    dayKey: string,
    timeType: "startTime" | "endTime",
    value: string,
  ) => {
    if (!value) return;
    const minutes = timeToMinutes(value);
    if (isNaN(minutes)) return;
    onRestTimesChange(
      restTimes.map((t) =>
        t.weekDay === dayKey ? { ...t, [timeType]: minutes } : t,
      ),
    );
  };

  const getRestTimeError = (dayKey: string) => {
    const restDayIndex = restTimes.findIndex((t) => t.weekDay === dayKey);
    if (restDayIndex < 0) return null;

    return Array.isArray(restTimesErrors) && restDayIndex >= 0
      ? restTimesErrors[restDayIndex]
      : null;
  };

  const validateRestTime = (dayKey: string) => {
    const workDay = workTimes.find((t) => t.weekDay === dayKey);
    const restDay = restTimes.find((t) => t.weekDay === dayKey);

    if (!workDay || !restDay) return null;

    const workStartTime = workDay.startTime;
    const workEndTime = workDay.endTime === 0 ? 1440 : workDay.endTime;
    const restEndTime = restDay.endTime === 0 ? 1440 : restDay.endTime;

    if (restDay.startTime < workStartTime || restEndTime > workEndTime) {
      return t("schedule.errors.restWithinWork");
    }

    if (restDay.startTime >= restEndTime) {
      return t("schedule.errors.restStartBeforeEnd");
    }

    return null;
  };

  const validateWorkTime = (dayKey: string) => {
    const workDay = workTimes.find((t) => t.weekDay === dayKey);

    if (!workDay) return null;

    if (workDay.startTime === 0 && workDay.endTime === 0) return null;

    const workEndTime = workDay.endTime === 0 ? 1440 : workDay.endTime;

    if (workDay.startTime >= workEndTime) {
      return t("schedule.errors.sameDayOnly");
    }

    return null;
  };

  return (
    <div className="space-y-3">
      {DAYS.map((dayCode) => {
        const dayIndex = workTimes.findIndex((t) => t.weekDay === dayCode);
        const daySchedule = dayIndex >= 0 ? workTimes[dayIndex] : null;
        const isEnabled = !!daySchedule;

        const restDaySchedule = restTimes.find((t) => t.weekDay === dayCode);
        const hasRestTime = !!restDaySchedule;

        const dayErrors =
          Array.isArray(workTimesErrors) && dayIndex >= 0
            ? workTimesErrors[dayIndex]
            : null;

        const restErrors = getRestTimeError(dayCode);
        const validationError = validateRestTime(dayCode);
        const workValidationError = validateWorkTime(dayCode);

        return (
          <div
            key={dayCode}
            className="border rounded-xl overflow-hidden bg-card transition-all duration-200 hover:shadow-sm"
          >
            <div className="p-4 md:p-5 space-y-3">
              {/* Day Header */}
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <Button
                  type="button"
                  variant={isEnabled ? "default" : "outline"}
                  onClick={() => toggleDay(dayCode)}
                  className={`font-semibold h-17 md:shrink-0 ${
                    isEnabled ? "w-full md:w-40" : "w-full"
                  }`}
                >
                  {t(`schedule.days.${dayCode}`)}
                </Button>

                {isEnabled && daySchedule && (
                  <div className="flex flex-col md:flex-row md:items-center gap-3 flex-1">
                    {/* Work Time Section */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                      <div className="flex items-center gap-2 flex-1 bg-background rounded-lg p-3 border">
                        <Clock className="w-4 h-4 text-muted-foreground shrink-0 hidden md:block" />
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            type="time"
                            lang="en-GB"
                            value={minutesToTime(daySchedule.startTime)}
                            onChange={(e) =>
                              updateWorkTime(
                                dayCode,
                                "startTime",
                                e.target.value,
                              )
                            }
                            step="300"
                            className={`flex-1 text-sm font-medium ${
                              dayErrors?.startTime ? "border-red-500" : ""
                            }`}
                          />
                          <span className="text-muted-foreground font-medium">
                            —
                          </span>
                          <Input
                            type="time"
                            lang="en-GB"
                            value={minutesToTime(daySchedule.endTime)}
                            onChange={(e) =>
                              updateWorkTime(dayCode, "endTime", e.target.value)
                            }
                            step="300"
                            className={`flex-1 text-sm font-medium ${
                              dayErrors?.endTime ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {/* Rest Time Toggle Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRestTime(dayCode)}
                        className="shrink-0 h-17.5 cursor-pointer"
                      >
                        {hasRestTime ? (
                          <>
                            <X className="w-4 h-4 mr-1 inline" />

                            {t("schedule.buttons.removeRest")}
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-1 inline " />
                            {t("schedule.buttons.addRest")}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Work Time Errors */}
              {(workValidationError ||
                dayErrors?.startTime ||
                dayErrors?.endTime) && (
                <div className="space-y-1 pl-1">
                  {workValidationError && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                      {workValidationError}
                    </p>
                  )}
                  {dayErrors?.startTime && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                      {dayErrors.startTime.message}
                    </p>
                  )}
                  {dayErrors?.endTime && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                      {dayErrors.endTime.message}
                    </p>
                  )}
                </div>
              )}

              {/* Rest Time Section */}
              {isEnabled && hasRestTime && restDaySchedule && (
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-3">
                    <Coffee className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    <Label className="text-sm font-semibold">
                      {t("schedule.labels.restTime")}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      lang="en-GB"
                      value={minutesToTime(restDaySchedule.startTime)}
                      onChange={(e) =>
                        updateRestTime(dayCode, "startTime", e.target.value)
                      }
                      step="300"
                      className={`flex-1 text-sm font-medium ${
                        restErrors?.startTime || validationError
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <span className="text-muted-foreground font-medium">—</span>
                    <Input
                      type="time"
                      lang="en-GB"
                      value={minutesToTime(restDaySchedule.endTime)}
                      onChange={(e) =>
                        updateRestTime(dayCode, "endTime", e.target.value)
                      }
                      step="300"
                      className={`flex-1 text-sm font-medium ${
                        restErrors?.endTime || validationError
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                  </div>

                  {/* Rest Time Errors */}
                  {(validationError ||
                    restErrors?.startTime ||
                    restErrors?.endTime) && (
                    <div className="mt-3 space-y-1">
                      {validationError && (
                        <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                          {validationError}
                        </p>
                      )}
                      {restErrors?.startTime && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                          {restErrors.startTime.message}
                        </p>
                      )}
                      {restErrors?.endTime && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                          {restErrors.endTime.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
