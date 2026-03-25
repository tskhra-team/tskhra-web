import BusinessDetailsSkeleton from "@/Booking/BusinessDetailsSkeleton";
import BookingDialog from "@/Booking/components/BookingDialog";
import BookNowCard from "@/Booking/components/BookNowCard";
import BusinessDescription from "@/Booking/components/BusinessDescription";
import BusinessGallery from "@/Booking/components/BusinessGallery";
import BusinessHeader from "@/Booking/components/BusinessHeader";
import ContactInformationCard from "@/Booking/components/ContactInformationCard";
import LocationCard from "@/Booking/components/LocationCard";
import ServicesList from "@/Booking/components/ServicesList";
import WorkingHoursCard from "@/Booking/components/WorkingHoursCard";
import { useBookingDialog } from "@/Booking/hooks/useBookingDialog";
import { useImageGallery } from "@/Booking/hooks/useImageGallery";
import useGetBookingBusinessServices from "@/Booking/useGetBookingBusinessServices";
import useGetBookingSingleBusiness from "@/Booking/useGetBookingSingleBusiness";
import useGetBusinessTimeslots from "@/Booking/useGetBusinessTimeslots";
import useGetBusinessTimeslotsForDays from "@/Booking/useGetBusinessTimeslotsForDays";
import { getAllTimeslotsWithAvailability, getAvailableDays } from "@/Booking/utils/businessDetailsUtils";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("booking");
  const servicesRef = useRef<HTMLDivElement>(null);

  // Fetch business data from API (only if id exists)
  const {
    data: business,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetBookingSingleBusiness(id || "", !!id);

  // Fetch services for this business
  const { data: services, isLoading: servicesLoading } =
    useGetBookingBusinessServices(id || "", !!id);

  // Custom hooks for state management
  const {
    bookingDialogOpen,
    selectedService,
    selectedDate,
    selectedTime,
    handleServiceClick,
    handleDateSelect,
    handleTimeSelect,
    handleBookingConfirm,
    setBookingDialogOpen,
    isBooking,
  } = useBookingDialog(id || "");

  const allImages = business
    ? [business.mainImage, ...(business.galleryImages || [])]
    : [];

  const { currentImageIndex, handleImageClick } = useImageGallery(allImages);

  // Fetch timeslots from API when service and date are selected
  const { data: timeslotsData, isLoading: timeslotsLoading } = useGetBusinessTimeslots(
    id || "",
    selectedDate,
    selectedService?.id ? String(selectedService.id) : null,
    !!id && !!selectedDate && !!selectedService?.id,
  );

  const availableDays = getAvailableDays(business?.workTimes);

  // Fetch timeslots for all working days to check which days have available slots
  const serviceId = selectedService?.id ? String(selectedService.id) : null;
  const workingDayDates = availableDays
    .filter((day) => day.isAvailable)
    .map((day) => day.dateString);

  const { unavailableDates } = useGetBusinessTimeslotsForDays(
    id || "",
    serviceId,
    workingDayDates,
  );

  // Mark days with no available timeslots as disabled
  const enrichedAvailableDays = availableDays.map((day) => ({
    ...day,
    isAvailable: day.isAvailable && !unavailableDates.has(day.dateString),
  }));

  // Generate all timeslots with availability status based on API data and business hours
  const availableTimeSlots = getAllTimeslotsWithAvailability(
    selectedDate,
    timeslotsData,
    business?.workTimes,
    business?.restTimes,
  );

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // No ID provided
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("businessDetails.status.notFound")}
          </h1>
          <p className="text-muted-foreground mb-4">No business ID provided</p>
          <Button onClick={() => navigate("/services")}>
            {t("businessDetails.buttons.backToBusinesses")}
          </Button>
        </div>
      </div>
    );
  }

  // Loading state - show skeleton on initial load or when refetching without data
  if (isLoading || (isFetching && !business)) {
    return <BusinessDetailsSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("businessDetails.status.errorLoading")}
          </h1>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error
              ? error.message
              : t("businessDetails.status.somethingWrong")}
          </p>
          <Button onClick={() => navigate("/services")}>
            {t("businessDetails.buttons.backToBusinesses")}
          </Button>
        </div>
      </div>
    );
  }

  // Business not found
  if (!business) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("businessDetails.status.notFound")}
          </h1>
          <Button onClick={() => navigate("/services")}>
            {t("businessDetails.buttons.backToBusinesses")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 bg-[#d8e0f0]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BusinessHeader
          businessName={business.businessName}
          category={business.category}
          callType={business.callType}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <BusinessGallery
              allImages={allImages}
              currentImageIndex={currentImageIndex}
              businessName={business.businessName}
              onImageClick={handleImageClick}
            />

            <BusinessDescription description={business.description} />

            {/* Mobile-only: Show contact info, working hours, location and book now before services */}
            <div className="lg:hidden space-y-6">
              
              <BookNowCard
                businessName={business.businessName}
                onBookNowClick={scrollToServices}
              />
              <ContactInformationCard info={business.info} />

              <WorkingHoursCard
                workTimes={business.workTimes}
                restTimes={business.restTimes}
              />

              <LocationCard
                addressDetail={business.addressDetail}
                city={business.city}
              />

            </div>

            <ServicesList
              ref={servicesRef}
              services={services}
              servicesLoading={servicesLoading}
              onServiceClick={handleServiceClick}
            />
          </div>

          {/* Sidebar - Desktop only */}
          <div className="hidden lg:block space-y-6 lg:sticky lg:top-8 h-fit">
            <BookNowCard
              businessName={business.businessName}
              onBookNowClick={scrollToServices}
            />

            <ContactInformationCard info={business.info} />

            <WorkingHoursCard
              workTimes={business.workTimes}
              restTimes={business.restTimes}
            />

            <LocationCard
              addressDetail={business.addressDetail}
              city={business.city}
            />
          </div>
        </div>

        <BookingDialog
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          selectedService={selectedService}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          availableDays={enrichedAvailableDays}
          availableTimeSlots={availableTimeSlots}
          timeslotsLoading={timeslotsLoading}
          isBooking={isBooking}
          onDateSelect={handleDateSelect}
          onTimeSelect={handleTimeSelect}
          onConfirm={handleBookingConfirm}
        />
      </div>
    </div>
  );
}
