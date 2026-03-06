import BusinessDetailsSkeleton from "@/Booking/BusinessDetailsSkeleton";
import {
  type MockService
} from "@/Booking/mockBusinesses";
import useGetBookingSingleBusiness from "@/Booking/useGetBookingSingleBusiness";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  Clock,
  Facebook,
  Instagram,
  MapPin,
  Phone
} from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// Mock available days (next 14 days)
const getAvailableDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date,
      dateString: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString('en-US', { month: 'short' }),
    });
  }
  return days;
};

// Mock available time slots
const getAvailableTimeSlots = (selectedDate: string | null) => {
  if (!selectedDate) return [];

  // Mock time slots - in reality, this would come from the backend
  const slots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  ];

  return slots;
};

export default function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('booking');
  const [showWorkingHours, setShowWorkingHours] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedService, _setSelectedService] = useState<MockService | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Fetch business data from API
  const { data: business, isLoading, isFetching, isError, error } = useGetBookingSingleBusiness(id || "");

  const availableDays = getAvailableDays();
  const availableTimeSlots = getAvailableTimeSlots(selectedDate);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // const handleServiceClick = (service: any) => {
  //   setSelectedService(service);
  //   setSelectedDate(null);
  //   setSelectedTime(null);
  //   setBookingDialogOpen(true);
  // };

  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookingConfirm = () => {
    // TODO: Send booking to backend
    console.log('Booking confirmed:', {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
    });
    setBookingDialogOpen(false);
  };

  // Loading state - show skeleton on initial load or when refetching without data
  if (isLoading || (isFetching && !business)) {
    return <BusinessDetailsSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('businessDetails.status.errorLoading')}</h1>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : t('businessDetails.status.somethingWrong')}
          </p>
          <Button onClick={() => navigate("/services")}>
            {t('businessDetails.buttons.backToBusinesses')}
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
          <h1 className="text-2xl font-bold mb-4">{t('businessDetails.status.notFound')}</h1>
          <Button onClick={() => navigate("/services")}>
            {t('businessDetails.buttons.backToBusinesses')}
          </Button>
        </div>
      </div>
    );
  }

  // Get call type badge color
  const getCallTypeBadge = () => {
    switch (business.callType) {
      case "outcall":
        return <Badge variant="secondary">{t('businessDetails.callType.outcall')}</Badge>;
      case "onsite":
        return <Badge variant="default">{t('businessDetails.callType.onsite')}</Badge>;
      case "both":
        return <Badge variant="outline">{t('businessDetails.callType.both')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 bg-[#d8e0f0]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-primary transition-colors font-medium"
          >
            {t('businessDetails.breadcrumb.home')}
          </button>
          <span className="text-muted-foreground/50">•</span>
          <button
            onClick={() => navigate("/services")}
            className="hover:text-primary transition-colors font-medium"
          >
            {t('businessDetails.breadcrumb.services')}
          </button>
          <span className="text-muted-foreground/50">•</span>
          <span className="text-[#100b2e] font-semibold">{business.businessName}</span>
        </div>

        {/* Business Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-4xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">{business.businessName}</h1>
            {getCallTypeBadge()}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-5 h-5 text-primary/70" />
            <span className="text-base">{business.category}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-border/50">
              <img
                src={business.mainImageUrl}
                alt={business.businessName}
                loading="eager"
                width={1200}
                height={675}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Gallery */}
            {/* {business.galleryImageUrls && business.galleryImageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {business.galleryImageUrls.map((url: string, index: number) => (
                  <div
                    key={index}
                    className="aspect-video overflow-hidden rounded-xl shadow-md ring-1 ring-border/50 hover:ring-primary/50 transition-all duration-300"
                  >
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      loading="lazy"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )} */}

            {/* Description */}
            <Card className=" rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <div className="rounded-full bg-primary text-[#100b2e]"></div>
                  {t('businessDetails.sections.about')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {business.description}
                </p>
              </CardContent>
            </Card>

            {/* Services Offered */}
            <Card ref={servicesRef} className=" rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <div className="rounded-full bg-primary"></div>
                  {t('businessDetails.sections.servicesOffered')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="space-y-3">
                  {business.services.map((service, index) => (
                    <div
                      key={index}
                      onClick={() => handleServiceClick(service)}
                      className="p-5 border border-border/50 rounded-xl hover:bg-primary/5 hover:border-primary/30 hover:shadow-md transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{service.name}</h3>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">₾{service.price}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {service.time >= 60
                              ? `${Math.floor(service.time / 60)}${t('businessDetails.time.hours')} ${service.time % 60 > 0 ? `${service.time % 60}${t('businessDetails.time.minutes')}` : ""}`
                              : `${service.time}${t('businessDetails.time.minutes')}`}
                          </p>
                        </div>
                      </div>
                      {service.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div> */}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
            {/* Action Buttons */}
            <Card className="rounded-2xl border-primary/20 from-primary/5 to-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl break-all leading-tight whitespace-normal">{business.businessName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full cursor-pointer  hover:shadow-xl transition-all duration-300 text-base font-semibold rounded-xl h-12 bg-[#ff6439] hover:bg-[#100b2e]"
                  size="lg"
                  onClick={scrollToServices}
                >
                  {t('businessDetails.buttons.bookNow')}
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            {(business.info.phoneNumber || business.info.facebookUrl || business.info.instagramUrl) && (
              <Card className=" rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="rounded-full bg-primary"></div>
                    {t('businessDetails.sections.contactInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.info.phoneNumber && (
                    <a
                      href={`tel:${business.info.phoneNumber}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{business.info.phoneNumber}</span>
                    </a>
                  )}

                  {business.info.facebookUrl && (
                    <a
                      href={business.info.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/5 hover:text-blue-600 transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                        <Facebook className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">{t('businessDetails.social.facebook')}</span>
                    </a>
                  )}

                  {business.info.instagramUrl && (
                    <a
                      href={business.info.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-500/5 hover:text-pink-600 transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                        <Instagram className="w-4 h-4 text-pink-600" />
                      </div>
                      <span className="text-sm font-medium">{t('businessDetails.social.instagram')}</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Working Hours */}
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
                      <p className="text-xs text-muted-foreground">{t('businessDetails.sections.workingHours')}</p>
                      {/* <span className="font-semibold text-sm">
                        {t('businessDetails.status.openUntil')} {minutesToTime(business.workTimes[new Date().getDay()]?.endTime || business.workTimes[0].endTime)}
                      </span> */}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${showWorkingHours ? 'rotate-180' : ''}`}
                  />
                </div>

                {/* Days list */}
                {/* {showWorkingHours && (
                  <div className="space-y-2 mt-4 pt-4 border-t">
                    {business.workTimes.map((workTime, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                          <span className="text-sm font-medium">{getDayName(workTime.day)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground font-mono">
                          {minutesToTime(workTime.startTime)} - {minutesToTime(workTime.endTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                )} */}
              </CardContent>
            </Card>
                        {/* Location */}
            <Card className=" rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <div className="rounded-full bg-primary"></div>
                  {t('businessDetails.sections.location')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    {business.addressDetails && (
                      <p className="font-semibold text-base">{business.addressDetails}</p>
                    )}
                    <p className="text-muted-foreground">{business.city}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Dialog */}
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{t('businessDetails.booking.dialogTitle', { serviceName: selectedService?.name })}</DialogTitle>
              <DialogDescription className="text-base">
                {t('businessDetails.booking.dialogDescription')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Service Summary */}
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{selectedService?.name}</h4>
                    {selectedService?.description && (
                      <p className="text-sm text-muted-foreground mt-1">{selectedService.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">₾{selectedService?.price}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedService?.time && selectedService.time >= 60
                        ? `${Math.floor(selectedService.time / 60)}${t('businessDetails.time.hours')} ${selectedService.time % 60 > 0 ? `${selectedService.time % 60}${t('businessDetails.time.minutes')}` : ""}`
                        : `${selectedService?.time || 0}${t('businessDetails.time.minutes')}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {t('businessDetails.booking.selectDate')}
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {availableDays.map((day) => (
                    <button
                      key={day.dateString}
                      onClick={() => handleDateSelect(day.dateString)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                        selectedDate === day.dateString
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-primary/5'
                      }`}
                    >
                      <span className="text-xs text-muted-foreground">{day.dayName}</span>
                      <span className="text-lg font-bold">{day.dayNumber}</span>
                      <span className="text-xs text-muted-foreground">{day.monthName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="animate-in fade-in-50 duration-300">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    {t('businessDetails.booking.selectTime')}
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                          selectedTime === time
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              {selectedDate && selectedTime && (
                <div className="animate-in fade-in-50 duration-300 pt-4 border-t">
                  <Button
                    onClick={handleBookingConfirm}
                    className="w-full h-12 text-base font-semibold bg-[#ff6439] hover:bg-[#100b2e] cursor-pointer"
                    size="lg"
                  >
                    {t('businessDetails.booking.confirmBooking', { date: selectedDate, time: selectedTime })}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
