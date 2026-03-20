import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type BookingResponse = {
  status: string;
  message: string;
};

type CancelBookingRequest = {
  bookingId: string;
};

const cancelBooking = async ({ bookingId }: CancelBookingRequest) => {
  const response = await privateInstance.post(`bookings/${bookingId}/cancel`);

  return response.data;
};

const useCancelBooking = () => {
  return useMutation<
    BookingResponse,
    AxiosError<ErrorResponse>,
    CancelBookingRequest
  >({
    mutationFn: cancelBooking,
  });
};

export default useCancelBooking;
