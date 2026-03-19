import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Clock, AlertCircle, User, Wallet, CheckCircle, XCircle, HourglassIcon, ArrowLeft } from "lucide-react";
import useGetMyBookings, { type UserBooking, type BookingStatus } from "@/Booking/useGetMyBookings";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PaginationControls } from "@/shared/pagination/Pagination";
import { scrollToTop } from "@/utils";
import { useState } from "react";

const BookingCard = ({ booking }: { booking: UserBooking }) => {
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
  const StatusIcon = statusStyle.icon;

  return (
    
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm ${statusStyle.borderColor}`}>
      <CardHeader className="pb-4 bg-card/30 border-b border-border/30">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-foreground mb-1 wrap-break-word leading-tight">
              {booking.serviceName}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <p className="text-sm font-medium">{booking.userName}</p>
            </div>
          </div>
          <Badge className={`${statusStyle.badge} px-3 py-1.5 font-semibold flex items-center gap-1.5 shrink-0`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {t(`myBookings.status.${booking.status}`)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-5 pb-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted/50">
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">
                {t("myBookings.card.date")}
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {booking.date}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted/50">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">
                {t("myBookings.card.time")}
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {formatTime(booking.startTime)}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted/50">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">
                {t("myBookings.card.duration")}
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {formatDuration(booking.duration)}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted/50">
              <Wallet className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">
                {t("myBookings.card.price")}
              </p>
              <p className="text-sm font-semibold text-primary truncate">₾{booking.price}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function MyBookingsPage() {
  const { t } = useTranslation("booking");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState<BookingStatus | "ALL">("ALL");

  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = 12;

  const { data: allBookings, isLoading, isError, refetch } = useGetMyBookings();

  // Handle filter change and reset pagination
  const handleFilterChange = (filter: BookingStatus | "ALL") => {
    setSelectedFilter(filter);
    // Reset to page 0 when filter changes
    const params = new URLSearchParams(searchParams);
    params.set('page', '0');
    setSearchParams(params);
  };

  const bookings = allBookings || [];

  // Sort bookings by date (most recent first), then by time
  const sortedBookings = bookings.slice().sort((a, b) => {
    // Compare dates (descending - most recent first)
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;

    // If dates are equal, compare by start time (descending)
    return b.startTime - a.startTime;
  });

  // Filter bookings based on selected status
  const filteredBookings = sortedBookings.filter((booking) => {
    if (selectedFilter === "ALL") return true;
    return booking.status === selectedFilter;
  });

  // Client-side pagination of filtered results
  const totalFilteredPages = Math.ceil(filteredBookings.length / size);
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  // Count bookings by status (from all bookings, not just current page)
  const getStatusCount = (status: BookingStatus | "ALL") => {
    if (status === "ALL") return bookings.length;
    return bookings.filter((b) => b.status === status).length;
  };

  const filterOptions: Array<{ value: BookingStatus | "ALL"; label: string }> = [
    { value: "ALL", label: t("myBookings.filters.all") },
    { value: "SCHEDULED", label: t("myBookings.status.SCHEDULED") },
    { value: "AWAITING", label: t("myBookings.status.AWAITING") },
    { value: "COMPLETED", label: t("myBookings.status.COMPLETED") },
    { value: "CANCELLED", label: t("myBookings.status.CANCELLED") },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-orange-50/30 to-red-50/20">
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 p-12 text-center max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t("myBookings.error")}
          </h2>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="lg"
            className="border-2"
          >
            {t("myBookings.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-orange-50/30 to-red-50/20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-4 hover:bg-muted/50 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("myBookings.back")}
          </Button>
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            {t("myBookings.title")}
          </h1>
          <p className="text-muted-foreground">{t("myBookings.subtitle")}</p>
        </div>

        {/* Filters */}
        {bookings.length > 0 && (
          <div className="mb-6 bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 p-5">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const count = getStatusCount(option.value);
                const isActive = selectedFilter === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? "bg-[#ff6439] text-white shadow-md"
                        : "bg-background/80 text-foreground hover:bg-muted border border-border/50"
                    }`}
                  >
                    <span>{option.label}</span>
                    <Badge
                      className={`${
                        isActive
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-muted text-muted-foreground border-border"
                      } font-bold px-2 py-0.5`}
                    >
                      {count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 p-12 text-center">
            <Calendar className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {t("myBookings.empty.title")}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t("myBookings.empty.description")}
            </p>
            <Link to="/services">
              <Button
                size="lg"
                className="bg-[#ff6439] hover:bg-[#100b2e] text-white rounded-xl h-12 font-semibold transition-all duration-300"
                style={{
                  boxShadow: '0 4px 14px -2px rgba(255, 100, 57, 0.3)'
                }}
              >
                {t("myBookings.empty.browseServices")}
              </Button>
            </Link>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 p-12 text-center">
            <AlertCircle className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {t("myBookings.filters.noResults")}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t("myBookings.filters.noResultsDescription")}
            </p>
            <Button
              onClick={() => handleFilterChange("ALL")}
              variant="outline"
              size="lg"
              className="border-2"
            >
              {t("myBookings.filters.clearFilter")}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBookings?.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>

            {/* Pagination - show when there's more than one page */}
            {totalFilteredPages > 1 && (
              <div className="mt-8">
                <PaginationControls
                  currentPage={page}
                  totalPages={totalFilteredPages}
                  onPageChange={(newPage) => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', String(newPage));
                    setSearchParams(params);
                    scrollToTop();
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
