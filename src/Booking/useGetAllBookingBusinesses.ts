import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type BusinessType = {
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

const getAllBookingBusinesses = async (
  lang: string,
): Promise<BusinessType[]> => {
  // First, get the first page to know how many total pages we have
  const firstPageResponse =
    await publicInstance.get<PaginatedBusinessesResponse>("/business", {
      params: {
        lang,
        page: 0,
        size: 100, // Use larger page size to minimize requests
      },
    });

  const totalPages = firstPageResponse.data.totalPages;
  let allBusinesses = [...firstPageResponse.data.content]; // If there are more pages, fetch them all

  if (totalPages > 1) {
    const pagePromises = [];
    for (let page = 1; page < totalPages; page++) {
      pagePromises.push(
        publicInstance.get<PaginatedBusinessesResponse>("/business", {
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
      allBusinesses = [...allBusinesses, ...response.data.content];
    });
  }

  return allBusinesses;
};

const useGetAllBookingBusinesses = (enabled = true, lang: string) => {
  return useQuery<BusinessType[], AxiosError<ErrorResponse>>({
    queryKey: ["all-businesses", lang],
    queryFn: () => getAllBookingBusinesses(lang),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};

export default useGetAllBookingBusinesses;
