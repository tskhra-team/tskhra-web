// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { type WorkTimeType } from "./IndividualBusinessSchema";

// interface WorkingScheduleProps {
//   workTimes: WorkTimeType[];
//   restTimes?: WorkTimeType[];
//   onWorkTimesChange: (workTimes: WorkTimeType[]) => void;
//   onRestTimesChange: (restTimes: WorkTimeType[]) => void;
//   workTimesErrors?: any;
//   restTimesErrors?: any;
// }

// const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// export default function WorkingSchedule({
//   workTimes,
//   restTimes = [],
//   onWorkTimesChange,
//   onRestTimesChange,
//   workTimesErrors,
//   restTimesErrors,
// }: WorkingScheduleProps) {
//   const { t } = useTranslation("booking");
//   const [expandedRestDays, setExpandedRestDays] = useState<Set<string>>(
//     new Set(),
//   );

//   const timeToMinutes = (time: string) => {
//     if (!time || !time.includes(":")) {
//       return 0;
//     }
//     const [hours, minutes] = time.split(":").map(Number);
//     if (isNaN(hours) || isNaN(minutes)) {
//       return 0;
//     }
//     return hours * 60 + minutes;
//   };

//   const minutesToTime = (minutes: number) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
//   };

//   const toggleDay = (dayKey: string) => {
//     const currentTimes = workTimes || [];
//     const existingIndex = currentTimes.findIndex((t) => t.weekDay === dayKey);

//     if (existingIndex >= 0) {
//       // Remove work time
//       onWorkTimesChange(currentTimes.filter((_, i) => i !== existingIndex));
//       // Also remove rest time if exists
//       removeRestTime(dayKey);
//       // Collapse rest section
//       setExpandedRestDays((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(dayKey);
//         return newSet;
//       });
//     } else {
//       // Add work time with default hours 9:00 - 18:00
//       onWorkTimesChange([
//         ...currentTimes,
//         { weekDay: dayKey, startTime: 540, endTime: 1080 },
//       ]);
//     }
//   };

//   const updateWorkTime = (
//     dayKey: string,
//     timeType: "startTime" | "endTime",
//     value: string,
//   ) => {
//     if (!value) return; // Don't update if value is empty
//     const currentTimes = workTimes || [];
//     const minutes = timeToMinutes(value);
//     if (isNaN(minutes)) return; // Don't update if result is NaN
//     onWorkTimesChange(
//       currentTimes.map((t) =>
//         t.weekDay === dayKey ? { ...t, [timeType]: minutes } : t,
//       ),
//     );
//   };

//   const toggleRestTime = (dayKey: string) => {
//     const currentRestTimes = restTimes || [];
//     const existingIndex = currentRestTimes.findIndex(
//       (t) => t.weekDay === dayKey,
//     );

//     if (existingIndex >= 0) {
//       // Remove rest time
//       removeRestTime(dayKey);
//       setExpandedRestDays((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(dayKey);
//         return newSet;
//       });
//     } else {
//       // Add rest time with default 1 hour lunch break (13:00 - 14:00)
//       const workDay = workTimes.find((t) => t.weekDay === dayKey);
//       if (workDay) {
//         const defaultStart = 780; // 13:00
//         const defaultEnd = 840; // 14:00

//         onRestTimesChange([
//           ...currentRestTimes,
//           {
//             weekDay: dayKey,
//             startTime: Math.max(workDay.startTime, defaultStart),
//             endTime: Math.min(workDay.endTime, defaultEnd),
//           },
//         ]);
//         setExpandedRestDays((prev) => new Set(prev).add(dayKey));
//       }
//     }
//   };

//   const removeRestTime = (dayKey: string) => {
//     const currentRestTimes = restTimes || [];
//     onRestTimesChange(currentRestTimes.filter((t) => t.weekDay !== dayKey));
//   };

//   const updateRestTime = (
//     dayKey: string,
//     timeType: "startTime" | "endTime",
//     value: string,
//   ) => {
//     if (!value) return; // Don't update if value is empty
//     const currentRestTimes = restTimes || [];
//     const minutes = timeToMinutes(value);
//     if (isNaN(minutes)) return; // Don't update if result is NaN
//     onRestTimesChange(
//       currentRestTimes.map((t) =>
//         t.weekDay === dayKey ? { ...t, [timeType]: minutes } : t,
//       ),
//     );
//   };

//   const getRestTimeError = (dayKey: string, dayIndex: number) => {
//     const restDayIndex = (restTimes || []).findIndex(
//       (t) => t.weekDay === dayKey,
//     );
//     if (restDayIndex < 0) return null;

//     const errors =
//       Array.isArray(restTimesErrors) && restDayIndex >= 0
//         ? restTimesErrors[restDayIndex]
//         : null;

//     return errors;
//   };

//   const validateRestTime = (dayKey: string) => {
//     const workDay = workTimes.find((t) => t.weekDay === dayKey);
//     const restDay = restTimes?.find((t) => t.weekDay === dayKey);

//     if (!workDay || !restDay) return null;

//     if (
//       restDay.startTime < workDay.startTime ||
//       restDay.endTime > workDay.endTime
//     ) {
//       return t("schedule.errors.restWithinWork");
//     }

//     if (restDay.startTime >= restDay.endTime) {
//       return t("schedule.errors.restStartBeforeEnd");
//     }

//     return null;
//   };

//   return (
//     <div className="space-y-3">
//       {DAYS.map((dayCode) => {
//         const dayIndex = (workTimes || []).findIndex(
//           (t) => t.weekDay === dayCode,
//         );
//         const daySchedule = dayIndex >= 0 ? workTimes[dayIndex] : null;
//         const isEnabled = !!daySchedule;

//         const restDaySchedule = (restTimes || []).find(
//           (t) => t.weekDay === dayCode,
//         );
//         const hasRestTime = !!restDaySchedule;
//         const isRestExpanded = expandedRestDays.has(dayCode);

//         const dayErrors =
//           Array.isArray(workTimesErrors) && dayIndex >= 0
//             ? workTimesErrors[dayIndex]
//             : null;

//         const restErrors = getRestTimeError(dayCode, dayIndex);
//         const validationError = validateRestTime(dayCode);

//         return (
//           <div
//             key={dayCode}
//             className="border rounded-lg overflow-hidden bg-card"
//           >
//             {/* Work Time Row */}
//             <div className="flex flex-col gap-2 p-4">
//               <div className="flex items-center gap-4">
//                 <Button
//                   type="button"
//                   variant={isEnabled ? "default" : "outline"}
//                   onClick={() => toggleDay(dayCode)}
//                   className="w-36 font-medium"
//                 >
//                   {t(`schedule.days.${dayCode}`)}
//                 </Button>

//                 {isEnabled && daySchedule && (
//                   <div className="flex items-center gap-3 flex-1">
//                     <div className="flex items-center gap-2">
//                       <Label className="text-xs text-muted-foreground whitespace-nowrap">
//                         {t("schedule.labels.start")}
//                       </Label>
//                       <Input
//                         type="time"
//                         lang="en-GB"
//                         value={minutesToTime(daySchedule.startTime)}
//                         onChange={(e) =>
//                           updateWorkTime(dayCode, "startTime", e.target.value)
//                         }
//                         step="300"
//                         className={`w-32 ${dayErrors?.startTime ? "border-red-500" : ""}`}
//                       />
//                     </div>

//                     <span className="text-muted-foreground">—</span>

//                     <div className="flex items-center gap-2">
//                       <Label className="text-xs text-muted-foreground whitespace-nowrap">
//                         {t("schedule.labels.end")}
//                       </Label>
//                       <Input
//                         type="time"
//                         lang="en-GB"
//                         value={minutesToTime(daySchedule.endTime)}
//                         onChange={(e) =>
//                           updateWorkTime(dayCode, "endTime", e.target.value)
//                         }
//                         step="300"
//                         className={`w-32 ${dayErrors?.endTime ? "border-red-500" : ""}`}
//                       />
//                     </div>

//                     {/* Add/Remove Rest Time Button */}
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => toggleRestTime(dayCode)}
//                       className="ml-auto text-xs"
//                     >
//                       {hasRestTime
//                         ? t("schedule.buttons.removeRest")
//                         : t("schedule.buttons.addRest")}
//                     </Button>
//                   </div>
//                 )}
//               </div>

//               {/* Work Time Errors */}
//               {dayErrors?.startTime && (
//                 <p className="text-xs text-red-500 font-bold pl-4">
//                   {dayErrors.startTime.message}
//                 </p>
//               )}
//               {dayErrors?.endTime && (
//                 <p className="text-xs text-red-500 pl-4">
//                   {dayErrors.endTime.message}
//                 </p>
//               )}
//             </div>

//             {/* Rest Time Section */}
//             {isEnabled && hasRestTime && restDaySchedule && (
//               <div className="px-4 pb-4 pt-0">
//                 <div className="bg-muted/50 rounded-md p-3 space-y-2">
//                   <Label className="text-xs font-semibold text-muted-foreground">
//                     {t("schedule.labels.restTime")}
//                   </Label>
//                   <div className="flex items-center gap-3">
//                     <div className="flex items-center gap-2 flex-1">
//                       <Label className="text-xs text-muted-foreground whitespace-nowrap">
//                         {t("schedule.labels.restStart")}
//                       </Label>
//                       <Input
//                         type="time"
//                         lang="en-GB"
//                         value={minutesToTime(restDaySchedule.startTime)}
//                         onChange={(e) =>
//                           updateRestTime(dayCode, "startTime", e.target.value)
//                         }
//                         step="300"
//                         className={`w-32 ${restErrors?.startTime || validationError ? "border-red-500" : ""}`}
//                       />
//                     </div>

//                     <span className="text-muted-foreground">—</span>

//                     <div className="flex items-center gap-2 flex-1">
//                       <Label className="text-xs text-muted-foreground whitespace-nowrap">
//                         {t("schedule.labels.restEnd")}
//                       </Label>
//                       <Input
//                         type="time"
//                         lang="en-GB"
//                         value={minutesToTime(restDaySchedule.endTime)}
//                         onChange={(e) =>
//                           updateRestTime(dayCode, "endTime", e.target.value)
//                         }
//                         step="300"
//                         className={`w-32 ${restErrors?.endTime || validationError ? "border-red-500" : ""}`}
//                       />
//                     </div>
//                   </div>

//                   {/* Rest Time Errors */}
//                   {validationError && (
//                     <p className="text-xs text-red-500">{validationError}</p>
//                   )}
//                   {restErrors?.startTime && (
//                     <p className="text-xs text-red-500">
//                       {restErrors.startTime.message}
//                     </p>
//                   )}
//                   {restErrors?.endTime && (
//                     <p className="text-xs text-red-500">
//                       {restErrors.endTime.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  workTimes = [], // Добавили дефолтное значение
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

    if (
      restDay.startTime < workDay.startTime ||
      restDay.endTime > workDay.endTime
    ) {
      return t("schedule.errors.restWithinWork");
    }

    if (restDay.startTime >= restDay.endTime) {
      return t("schedule.errors.restStartBeforeEnd");
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

        return (
          <div
            key={dayCode}
            className="border rounded-lg overflow-hidden bg-card"
          >
            {/* Оставил ваш JSX без изменений, он написан хорошо */}
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant={isEnabled ? "default" : "outline"}
                  onClick={() => toggleDay(dayCode)}
                  className="w-36 font-medium"
                >
                  {t(`schedule.days.${dayCode}`)}
                </Button>

                {isEnabled && daySchedule && (
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">
                        {t("schedule.labels.start")}
                      </Label>
                      <Input
                        type="time"
                        lang="en-GB"
                        value={minutesToTime(daySchedule.startTime)}
                        onChange={(e) =>
                          updateWorkTime(dayCode, "startTime", e.target.value)
                        }
                        step="300"
                        className={`w-32 ${dayErrors?.startTime ? "border-red-500" : ""}`}
                      />
                    </div>

                    <span className="text-muted-foreground">—</span>

                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">
                        {t("schedule.labels.end")}
                      </Label>
                      <Input
                        type="time"
                        lang="en-GB"
                        value={minutesToTime(daySchedule.endTime)}
                        onChange={(e) =>
                          updateWorkTime(dayCode, "endTime", e.target.value)
                        }
                        step="300"
                        className={`w-32 ${dayErrors?.endTime ? "border-red-500" : ""}`}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRestTime(dayCode)}
                      className="ml-auto text-xs"
                    >
                      {hasRestTime
                        ? t("schedule.buttons.removeRest")
                        : t("schedule.buttons.addRest")}
                    </Button>
                  </div>
                )}
              </div>

              {dayErrors?.startTime && (
                <p className="text-xs text-red-500 font-bold pl-4">
                  {dayErrors.startTime.message}
                </p>
              )}
              {dayErrors?.endTime && (
                <p className="text-xs text-red-500 pl-4">
                  {dayErrors.endTime.message}
                </p>
              )}
            </div>

            {isEnabled && hasRestTime && restDaySchedule && (
              <div className="px-4 pb-4 pt-0">
                <div className="bg-muted/50 rounded-md p-3 space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    {t("schedule.labels.restTime")}
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">
                        {t("schedule.labels.restStart")}
                      </Label>
                      <Input
                        type="time"
                        lang="en-GB"
                        value={minutesToTime(restDaySchedule.startTime)}
                        onChange={(e) =>
                          updateRestTime(dayCode, "startTime", e.target.value)
                        }
                        step="300"
                        className={`w-32 ${restErrors?.startTime || validationError ? "border-red-500" : ""}`}
                      />
                    </div>

                    <span className="text-muted-foreground">—</span>

                    <div className="flex items-center gap-2 flex-1">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">
                        {t("schedule.labels.restEnd")}
                      </Label>
                      <Input
                        type="time"
                        lang="en-GB"
                        value={minutesToTime(restDaySchedule.endTime)}
                        onChange={(e) =>
                          updateRestTime(dayCode, "endTime", e.target.value)
                        }
                        step="300"
                        className={`w-32 ${restErrors?.endTime || validationError ? "border-red-500" : ""}`}
                      />
                    </div>
                  </div>

                  {validationError && (
                    <p className="text-xs text-red-500">{validationError}</p>
                  )}
                  {restErrors?.startTime && (
                    <p className="text-xs text-red-500">
                      {restErrors.startTime.message}
                    </p>
                  )}
                  {restErrors?.endTime && (
                    <p className="text-xs text-red-500">
                      {restErrors.endTime.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
