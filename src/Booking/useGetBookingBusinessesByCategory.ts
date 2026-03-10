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

const getBookingBusinessesByCategory = async (
  category: string,
  page: number = 0,
  size: number = 100
): Promise<BusinessType[]> => {
  const response = await publicInstance.get<PaginatedBusinessesResponse>("/business", {
    params: {
      page,
      size,
    },
  });

  // Filter by category on client side
  const filteredBusinesses = response.data.content.filter(
    (business) => business.category.toLowerCase() === category.toLowerCase()
  );

  return filteredBusinesses;
};

const useGetBookingBusinessesByCategory = (
  category: string,
  enabled: boolean = true
) => {
  return useQuery<BusinessType[], AxiosError<ErrorResponse>>({
    queryKey: ["businesses", "category", category],
    queryFn: () => getBookingBusinessesByCategory(category),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!category,
  });
};

export default useGetBookingBusinessesByCategory;
