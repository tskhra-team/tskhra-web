import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type BusinessType = {
  businessId: string;
  businessName: string;
  category: string;
  subCategory: string;
  mainImage: string;
  galleryImages: string[];
  city: string;
  addressDetail: string;
  description?: string;
  callType: "ONSITE" | "OUTCALL";
};

type PaginatedBusinessesResponse = {
  content: BusinessType[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

const getBookingBusinesses = async (
  page: number,
  size: number
): Promise<PaginatedBusinessesResponse> => {
  const response = await publicInstance.get("/business", {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

const useGetBookingBusinesses = (page: number, size = 10, enabled = true) => {
  return useQuery<PaginatedBusinessesResponse, AxiosError<ErrorResponse>>({
    queryKey: ["businesses", page, size],
    queryFn: () => getBookingBusinesses(page, size),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};

export default useGetBookingBusinesses;