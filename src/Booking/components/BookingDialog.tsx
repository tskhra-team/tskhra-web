import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Service, AvailableDay } from "@/Booking/types/booking.types";

type BookingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedService: Service | null;
  selectedDate: string | null;
  selectedTime: string | null;
  availableDays: AvailableDay[];
  availableTimeSlots: string[];
  timeslotsLoading?: boolean;
  isBooking?: boolean;
  onDateSelect: (dateString: string) => void;
  onTimeSelect: (time: string) => void;
  onConfirm: () => void;
};

export default function BookingDialog({
  open,
  onOpenChange,
  selectedService,
  selectedDate,
  selectedTime,
  availableDays,
  availableTimeSlots,
  timeslotsLoading = false,
  isBooking = false,
  onDateSelect,
  onTimeSelect,
  onConfirm,
}: BookingDialogProps) {
  const { t } = useTranslation("booking");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t("businessDetails.booking.dialogTitle", {
              serviceName: selectedService?.name,
            })}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t("businessDetails.booking.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Service Summary */}
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg">
                  {selectedService?.name}
                </h4>
                {selectedService?.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedService.description}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">
                  ₾{selectedService?.price}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedService?.duration && selectedService.duration >= 60
                    ? `${Math.floor(selectedService.duration / 60)}${t("businessDetails.time.hours")} ${selectedService.duration % 60 > 0 ? `${selectedService.duration % 60}${t("businessDetails.time.minutes")}` : ""}`
                    : `${selectedService?.duration || 0}${t("businessDetails.time.minutes")}`}
                </p>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {t("businessDetails.booking.selectDate")}
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {availableDays.map((day) => (
                <button
                  key={day.dateString}
                  onClick={() => onDateSelect(day.dateString)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                    selectedDate === day.dateString
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <span className="text-xs text-muted-foreground">
                    {day.dayName}
                  </span>
                  <span className="text-lg font-bold">{day.dayNumber}</span>
                  <span className="text-xs text-muted-foreground">
                    {day.monthName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="animate-in fade-in-50 duration-300">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t("businessDetails.booking.selectTime")}
              </h3>
              {timeslotsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : availableTimeSlots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t("businessDetails.booking.noTimeslots", {
                    defaultValue: "No available time slots for this date",
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => onTimeSelect(time)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                        selectedTime === time
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Confirm Button */}
          {selectedDate && selectedTime && (
            <div className="animate-in fade-in-50 duration-300 pt-4 border-t">
              <Button
                onClick={onConfirm}
                disabled={isBooking}
                className="w-full h-12 text-base font-semibold bg-[#ff6439] hover:bg-[#100b2e] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                size="lg"
                style={{
                  transition: 'all 0.5s ease-out',
                  boxShadow: '0 4px 14px -2px rgba(255, 100, 57, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isBooking) {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-4px) rotate(0.5deg)';
                    e.currentTarget.style.boxShadow = '0 20px 50px -10px rgba(255, 100, 57, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isBooking) {
                    e.currentTarget.style.transform = 'scale(1) translateY(0) rotate(0deg)';
                    e.currentTarget.style.boxShadow = '0 4px 14px -2px rgba(255, 100, 57, 0.3)';
                  }
                }}
              >
                {/* Decorative shine effect */}
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
                  }}
                />
                {isBooking ? (
                  <span className="flex items-center gap-2 relative z-10">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t("businessDetails.booking.processing", {
                      defaultValue: "Processing...",
                    })}
                  </span>
                ) : (
                  <span className="relative z-10">
                    {t("businessDetails.booking.confirmBooking", {
                      date: selectedDate,
                      time: selectedTime,
                    })}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
