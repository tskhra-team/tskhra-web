import type { Service } from "@/Booking/types/booking.types";
import useCreateBooking from "@/Booking/useCreateBooking";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Convert time string (HH:MM) to minutes since midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const useBookingDialog = (businessId: string) => {
  const { isAuthenticated, login } = useAuth();
  const { showModal } = useModal();
  const { mutate: createBooking, isPending } = useCreateBooking();
  const queryClient = useQueryClient();

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Restore booking state after login
  useEffect(() => {
    if (isAuthenticated) {
      const savedBookingState = localStorage.getItem("pendingBookingState");
      if (savedBookingState) {
        try {
          const { service, date, time } = JSON.parse(savedBookingState);

          // Restore the state
          setSelectedService(service);
          setSelectedDate(date);
          setSelectedTime(time);
          setBookingDialogOpen(true);

          // Clear the saved state
          localStorage.removeItem("pendingBookingState");
        } catch (error) {
          localStorage.removeItem("pendingBookingState");
        }
      }
    }
  }, [isAuthenticated]);

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
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Close booking dialog first so modal is visible
      setBookingDialogOpen(false);

      // Save current URL and booking state to localStorage for redirect after login
      localStorage.setItem(
        "redirectAfterLogin",
        window.location.pathname + window.location.search,
      );

      // Save booking state
      localStorage.setItem(
        "pendingBookingState",
        JSON.stringify({
          service: selectedService,
          date: selectedDate,
          time: selectedTime,
        }),
      );

      // Small delay to ensure dialog closes before showing modal
      setTimeout(() => {
        showModal(
          "error",
          "You aren't authorized",
          "To book a service, you need to be authorized",
          "Close",
          () => {
            // User clicked Close - clear the pending booking state
            localStorage.removeItem("pendingBookingState");
            localStorage.removeItem("redirectAfterLogin");
          },
          "Login",
          () => {
            login();
          },
        );
      }, 100);
      return;
    }

    // Validate all required fields
    if (!selectedService || !selectedDate || !selectedTime) {
      showModal(
        "error",
        "Missing Information",
        "Please select a service, date, and time before booking",
        "Close",
      );
      return;
    }

    // Create booking
    createBooking(
      {
        serviceId: String(selectedService.id),
        date: selectedDate,
        startTime: timeToMinutes(selectedTime),
      },
      {
        onSuccess: () => {
          showModal(
            "success",
            "Booking Confirmed",
            "Your booking has been successfully created",
            "OK",
          );
          setBookingDialogOpen(false);

          // Invalidate timeslots query to refresh available time slots
          queryClient.invalidateQueries({
            queryKey: ["business", businessId, "timeslots", selectedDate, String(selectedService?.id)],
          });
        },
        onError: (error) => {
          setBookingDialogOpen(false);
          showModal(
            "error",
            "Booking Failed",
            error.response?.data?.message ||
              "Failed to create booking. Please try again.",
            "Close",
          );
        },
      },
    );
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
    isBooking: isPending,
  };
};
