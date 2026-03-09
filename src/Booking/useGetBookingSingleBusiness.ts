import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Business } from "@/Booking/types/booking.types";

const getBookingSingleBusiness = async (businessId: string) => {
  const response = await publicInstance.get(`/business/${businessId}`);
  return response.data;
};

const useGetBookingSingleBusiness = (
  businessId: string,
  enabled: boolean = true,
) => {
  return useQuery<Business, AxiosError<ErrorResponse>>({
    queryFn: () => getBookingSingleBusiness(businessId),
    queryKey: ["business", businessId],
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!businessId,
  });
};

export default useGetBookingSingleBusiness;
