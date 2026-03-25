import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type BookingStatus =
  | "AWAITING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "SCHEDULED";

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

type PaginatedBookingsResponse = {
  content: UserBooking[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

const getMyBookings = async (lang: string): Promise<UserBooking[]> => {
  // Fetch first page to get total pages
  const firstPageResponse =
    await privateInstance.get<PaginatedBookingsResponse>("/bookings/me", {
      params: {
        lang,
        page: 0,
        size: 100, // Use larger page size to minimize requests
      },
    });

  const totalPages = firstPageResponse.data.totalPages;
  let allBookings = [...firstPageResponse.data.content];

  // If there are more pages, fetch them all
  if (totalPages > 1) {
    const pagePromises = [];
    for (let page = 1; page < totalPages; page++) {
      pagePromises.push(
        privateInstance.get<PaginatedBookingsResponse>("/bookings/me", {
          params: {
            lang,
            page,
            size: 100,
          },
        }),
      );
    }

    const responses = await Promise.all(pagePromises);
    responses.forEach((response) => {
      allBookings = [...allBookings, ...response.data.content];
    });
  }

  return allBookings;
};

const useGetMyBookings = (lang: string) => {
  return useQuery<UserBooking[], AxiosError<ErrorResponse>>({
    queryKey: ["myBookings", lang],
    queryFn: () => getMyBookings(lang),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export default useGetMyBookings;
