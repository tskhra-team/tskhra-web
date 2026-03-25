import { publicInstance } from "@/api";
import type { Business } from "@/Booking/types/booking.types";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getBookingSingleBusiness = async (businessId: string, lang: string) => {
  const response = await publicInstance.get(`/business/${businessId}`, {
    params: { lang },
  });
  return response.data;
};

const useGetBookingSingleBusiness = (
  businessId: string,
  enabled: boolean = true,
  lang: string,
) => {
  return useQuery<Business, AxiosError<ErrorResponse>>({
    queryFn: () => getBookingSingleBusiness(businessId, lang),
    queryKey: ["business", businessId, lang],
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!businessId,
  });
};

export default useGetBookingSingleBusiness;
