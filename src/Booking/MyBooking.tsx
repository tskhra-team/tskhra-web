import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, AlertCircle, ArrowLeft } from "lucide-react";
import useGetMyBookings, { type BookingStatus } from "@/Booking/useGetMyBookings";
import useCancelBooking from "@/Booking/useCancelBooking";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/shared/pagination/Pagination";
import { scrollToTop } from "@/utils";
import { useState } from "react";
import { useModal } from "@/context/ModalContext";
import queryClient from "@/query/queryClient";
import { BookingCard } from "./components/BookingCard";

export const MyBooking = () => {
  const { t } = useTranslation("booking");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState<BookingStatus | "ALL">("ALL");

  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = 12;

  const { data: allBookings, isLoading, isError, refetch } = useGetMyBookings();
  const { mutate: cancelBooking } = useCancelBooking();
  const { showModal } = useModal();

  // Handle filter change and reset pagination
  const handleFilterChange = (filter: BookingStatus | "ALL") => {
    setSelectedFilter(filter);
    // Reset to page 0 when filter changes
    const params = new URLSearchParams(searchParams);
    params.set('page', '0');
    setSearchParams(params);
  };

  // Handle cancel booking
  const handleCancel = (bookingId: string) => {
    showModal(
      "warning",
      t("myBookings.modal.cancelTitle"),
      t("myBookings.modal.cancelMessage"),
      t("myBookings.modal.close"),
      () => {},
      t("myBookings.modal.confirmCancel"),
      () => {
        cancelBooking(
          { bookingId },
          {
            onSuccess: () => {
              showModal(
                "success",
                t("myBookings.modal.successTitle"),
                t("myBookings.modal.cancelSuccess"),
              );

              queryClient.invalidateQueries({
                queryKey: ["myBookings"],
              });
            },

            onError: () => {
              showModal(
                "error",
                t("myBookings.modal.errorTitle"),
                t("myBookings.modal.cancelError"),
              );
            },
          },
        );
      },
    );
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
            onClick={() => navigate('/booking')}
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
            <div className="flex flex-wrap gap-2 justify-center">
              {filterOptions.map((option) => {
                const count = getStatusCount(option.value);
                const isActive = selectedFilter === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
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
                      } font-bold px-2 py-0.5 rounded-full hover:bg-muted hover:text-muted-foreground`}
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
                <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
              ))}
            </div>

            {/* Promotional Banner */}
            <div className="mt-8 bg-linear-to-br from-[#a84632] to-[#8b3a28] rounded-3xl p-8 relative overflow-hidden shadow-lg">
              {/* Decorative checkmark icon */}
              <div className="absolute top-6 right-6 opacity-20">
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center border-4 border-white/20">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="relative z-10 max-w-xl">
                <h2 className="text-2xl font-bold text-white mb-3">
                  {t("myBookings.promo.title")}
                </h2>
                <p className="text-white/90 text-sm mb-6 leading-relaxed">
                  {t("myBookings.promo.description")}
                </p>
                <Link to="/booking" onClick={scrollToTop}>
                  <Button
                    className="bg-white text-[#a84632] hover:bg-white/90 font-semibold rounded-full px-6 py-2 h-11 transition-all shadow-md hover:shadow-lg"
                  >
                    {t("myBookings.promo.button")}
                  </Button>
                </Link>
              </div>
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
};
