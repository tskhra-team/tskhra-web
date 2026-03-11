import { privateInstance } from "@/api";
import type { BookingResponse } from "@/features/my-businesses/Notifications/hooks/useRejectBooking";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type ApproveBookingRequest = {
  bookingId: string;
};

const approveBooking = async ({ bookingId }: ApproveBookingRequest) => {
  const response = await privateInstance.post(`bookings/${bookingId}/approve`);

  return response.data;
};

const useApproveBooking = () => {
  return useMutation<
    BookingResponse,
    AxiosError<ErrorResponse>,
    ApproveBookingRequest
  >({
    mutationFn: approveBooking,
  });
};

export default useApproveBooking;
