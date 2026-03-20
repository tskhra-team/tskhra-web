import { useTranslation } from "react-i18next";
import { Calendar, Clock, User, Wallet, CheckCircle, XCircle, HourglassIcon, X } from "lucide-react";
import { type UserBooking } from "@/Booking/useGetMyBookings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface BookingCardProps {
  booking: UserBooking;
  onCancel?: (bookingId: string) => void;
}

export const BookingCard = ({ booking, onCancel }: BookingCardProps) => {
  const { t } = useTranslation("booking");

  // Convert startTime (minutes from midnight) to HH:MM format
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  // Format duration to hours and minutes
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} ${t("myBookings.card.minutes")}`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${mins}${t("myBookings.card.minutes")}`;
  };

  const getStatusStyle = (status: UserBooking["status"]) => {
    switch (status) {
      case "SCHEDULED":
        return {
          badge: "bg-emerald-500 text-white border-0",
          icon: CheckCircle,
          borderColor: "border-emerald-200/50"
        };
      case "CONFIRMED":
        return {
          badge: "bg-emerald-500 text-white border-0",
          icon: CheckCircle,
          borderColor: "border-emerald-200/50"
        };
      case "AWAITING":
        return {
          badge: "bg-[#ff6439] text-white border-0",
          icon: HourglassIcon,
          borderColor: "border-orange-200/50"
        };
      case "CANCELLED":
        return {
          badge: "bg-red-500 text-white border-0",
          icon: XCircle,
          borderColor: "border-red-200/50"
        };
      case "COMPLETED":
        return {
          badge: "bg-blue-500 text-white border-0",
          icon: CheckCircle,
          borderColor: "border-blue-200/50"
        };
      default:
        return {
          badge: "bg-slate-500 text-white border-0",
          icon: Calendar,
          borderColor: "border-slate-200/50"
        };
    }
  };

  const statusStyle = getStatusStyle(booking.status);

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-md rounded-2xl border border-border/40 bg-white flex flex-col ${statusStyle.borderColor}`}>
      <CardHeader className="pb-3 pt-4 px-5">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1 wrap-break-word leading-tight">
              {booking.serviceName}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground/80">
              <User className="w-3.5 h-3.5" />
              <p className="text-xs">{booking.userName}</p>
            </div>
          </div>
          <Badge className={`${statusStyle.badge} px-3.5 py-1.5 font-medium flex items-center gap-1.5 shrink-0 rounded-full text-xs`}>
            {t(`myBookings.status.${booking.status}`)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-5 px-5 flex flex-col grow">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {/* Date */}
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground/60 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground/70 mb-0.5">
                {t("myBookings.card.date")}
              </p>
              <p className="text-sm font-medium text-foreground truncate">
                {booking.date}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-muted-foreground/60 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground/70 mb-0.5">
                {t("myBookings.card.time")}
              </p>
              <p className="text-sm font-medium text-foreground truncate">
                {formatTime(booking.startTime)}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-muted-foreground/60 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground/70 mb-0.5">
                {t("myBookings.card.duration")}
              </p>
              <p className="text-sm font-medium text-foreground truncate">
                {formatDuration(booking.duration)}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-start gap-2">
            <Wallet className="w-4 h-4 text-muted-foreground/60 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground/70 mb-0.5">
                {t("myBookings.card.price")}
              </p>
              <p className="text-sm font-semibold text-[#ff6439] truncate">₾{booking.price}</p>
            </div>
          </div>
        </div>

        {/* Cancel Button - Only show for non-cancelled/completed bookings */}
        {onCancel && booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
          <div className="pt-4 mt-auto">
            <Button
              onClick={() => onCancel(booking.id)}
              variant="outline"
              className="w-full h-10 gap-2 text-sm font-medium border border-red-200/80 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 cursor-pointer rounded-full transition-all"
            >
              <X className="w-3.5 h-3.5" />
              {t("myBookings.card.cancel")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
