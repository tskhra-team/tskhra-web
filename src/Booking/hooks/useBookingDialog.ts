import { useState } from "react";
import type { Service } from "@/Booking/types/booking.types";

export const useBookingDialog = () => {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingDialogOpen(true);
  };

  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookingConfirm = () => {
    // TODO: Send booking to backend
    console.log("Booking confirmed:", {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
    });
    setBookingDialogOpen(false);
  };

  const closeDialog = () => {
    setBookingDialogOpen(false);
  };

  return {
    bookingDialogOpen,
    selectedService,
    selectedDate,
    selectedTime,
    handleServiceClick,
    handleDateSelect,
    handleTimeSelect,
    handleBookingConfirm,
    closeDialog,
    setBookingDialogOpen,
  };
};
