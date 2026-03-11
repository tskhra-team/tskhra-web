import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type CreateBookingRequest = {
  serviceId: string;
  date: string;
  startTime: number;
};

type CreateBookingResponse = {
  status: number;
  message: string;
  bookingId?: string;
};

const createBooking = async (data: CreateBookingRequest) => {
  const response = await privateInstance.post("/bookings/individual", data);
  return response.data;
};

const useCreateBooking = () => {
  return useMutation<
    CreateBookingResponse,
    AxiosError<ErrorResponse>,
    CreateBookingRequest
  >({
    mutationFn: createBooking,
  });
};

export default useCreateBooking;
