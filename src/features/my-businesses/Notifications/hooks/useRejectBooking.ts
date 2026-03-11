import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type BookingResponse = {
  status: string;
  message: string;
};

type RejectBookingRequest = {
  bookingId: string;
};

const rejectBooking = async ({ bookingId }: RejectBookingRequest) => {
  const response = await privateInstance.post(`bookings/${bookingId}/reject`);

  return response.data;
};

const useRejectBooking = () => {
  return useMutation<
    BookingResponse,
    AxiosError<ErrorResponse>,
    RejectBookingRequest
  >({
    mutationFn: rejectBooking,
  });
};

export default useRejectBooking;
