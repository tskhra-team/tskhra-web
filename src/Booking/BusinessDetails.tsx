import BusinessDetailsSkeleton from "@/Booking/BusinessDetailsSkeleton";
import useGetBookingSingleBusiness from "@/Booking/useGetBookingSingleBusiness";
import useGetBookingBusinessServices from "@/Booking/useGetBookingBusinessServices";
import { getAvailableDays, getAvailableTimeSlots } from "@/Booking/utils/businessDetailsUtils";
import { useBookingDialog } from "@/Booking/hooks/useBookingDialog";
import { useImageGallery } from "@/Booking/hooks/useImageGallery";
import BusinessHeader from "@/Booking/components/BusinessHeader";
import BusinessGallery from "@/Booking/components/BusinessGallery";
import BusinessDescription from "@/Booking/components/BusinessDescription";
import ServicesList from "@/Booking/components/ServicesList";
import BookNowCard from "@/Booking/components/BookNowCard";
import ContactInformationCard from "@/Booking/components/ContactInformationCard";
import WorkingHoursCard from "@/Booking/components/WorkingHoursCard";
import LocationCard from "@/Booking/components/LocationCard";
import BookingDialog from "@/Booking/components/BookingDialog";
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
  } = useBookingDialog();

  const allImages = business
    ? [business.mainImage, ...(business.galleryImages || [])]
    : [];

  const { currentImageIndex, handleImageClick } = useImageGallery(allImages);

  const availableDays = getAvailableDays();
  const availableTimeSlots = getAvailableTimeSlots(
    selectedDate,
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

            <ServicesList
              ref={servicesRef}
              services={services}
              servicesLoading={servicesLoading}
              onServiceClick={handleServiceClick}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
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
          availableDays={availableDays}
          availableTimeSlots={availableTimeSlots}
          onDateSelect={handleDateSelect}
          onTimeSelect={handleTimeSelect}
          onConfirm={handleBookingConfirm}
        />
      </div>
    </div>
  );
}
