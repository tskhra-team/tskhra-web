import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type BookingStatus = "AWAITING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "SCHEDULED";

export type UserBooking = {
  id: string;
  serviceName: string;
  userName: string;
  startTime: number;
  duration: number;
  status: BookingStatus;
  date: string;
  price: number;
};

const getMyBookings = async (): Promise<UserBooking[]> => {
  const response = await privateInstance.get("/bookings/me");
  return response.data;
};

const useGetMyBookings = () => {
  return useQuery<UserBooking[], AxiosError<ErrorResponse>>({
    queryKey: ["myBookings"],
    queryFn: getMyBookings,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export default useGetMyBookings;
