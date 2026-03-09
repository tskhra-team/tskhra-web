import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Clock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getDayName, minutesToTime } from "@/Booking/mockBusinesses";
import type { WorkTime, RestTime } from "@/Booking/types/booking.types";

type WorkingHoursCardProps = {
  workTimes: WorkTime[];
  restTimes?: RestTime[];
};

export default function WorkingHoursCard({
  workTimes,
  restTimes,
}: WorkingHoursCardProps) {
  const { t } = useTranslation("booking");
  const [showWorkingHours, setShowWorkingHours] = useState(false);

  return (
    <Card className=" rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setShowWorkingHours(!showWorkingHours)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("businessDetails.sections.workingHours")}
              </p>
              <span className="font-semibold text-sm">
                {t("businessDetails.status.openUntil")}{" "}
                {minutesToTime(
                  workTimes[new Date().getDay()]?.endTime ||
                    workTimes[0].endTime,
                )}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${showWorkingHours ? "rotate-180" : ""}`}
          />
        </div>

        {/* Days list */}
        {showWorkingHours && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            {/* Working Hours */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("businessDetails.sections.workingHours")}
              </p>
              {workTimes.map((workTime, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                    <span className="text-sm font-medium">
                      {getDayName(workTime.weekDay)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground font-mono">
                    {minutesToTime(workTime.startTime)} -{" "}
                    {minutesToTime(workTime.endTime)}
                  </span>
                </div>
              ))}
            </div>

            {/* Rest Times */}
            {restTimes && restTimes.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("businessDetails.sections.restTimes")}
                </p>
                {restTimes.map((restTime, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
                      <span className="text-sm font-medium">
                        {getDayName(restTime.weekDay)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">
                      {minutesToTime(restTime.startTime)} -{" "}
                      {minutesToTime(restTime.endTime)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
