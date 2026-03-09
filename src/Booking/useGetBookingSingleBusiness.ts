import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";


type BookingSingleBusinessType = {
  businessId: string;
  businessName: string;
  businessPhoto: string;
  description: string | null;
  mainImage: string;
  callType: string;
  city: string;
  category: string;
  info: {
    phoneNumber: string;
    instagramUrl: string;
    facebookUrl: string;
  };
  addressDetail: string;
  workTimes: [{
    weekDay: string;
    startTime: number;
    endTime: number;
  }];
  restTimes: [{
    weekDay: string;
    startTime: number;
    endTime: number;
  }]
  galleryImages: []
};

const getBookingSingleBusiness = async (businessId: string) => {
  const response = await publicInstance.get(`/business/${businessId}`);
  return response.data;
};

const useGetBookingSingleBusiness = (
  businessId: string,
  enabled: boolean = true,
) => {
  return useQuery<BookingSingleBusinessType, AxiosError<ErrorResponse>>({
    queryFn: () => getBookingSingleBusiness(businessId),
    queryKey: ["business", businessId],
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!businessId,
  });
};

export default useGetBookingSingleBusiness;
