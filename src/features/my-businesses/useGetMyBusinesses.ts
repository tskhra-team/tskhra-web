import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type MyBusinessResponse = {
  businessId: string;
  businessName: string;
  category: string;
  subCategory: string;
  mainImage: string;
  galleryImages: [string];
  city: string;
  addressDetail: string;
  callType: "OUTCALL" | "INSITE" | "BOTH";
  workTimes: [
    {
      weekDay: string;
      startTime: number;
      endTime: number;
    },
  ];
  restTimes: [
    {
      weekDay: string;
      startTime: number;
      endTime: number;
    },
  ];
};

const getMyBusinesses = async () => {
  const response = await privateInstance.get("/business/me");

  return response.data;
};

const useGetMyBusinesses = () => {
  return useQuery<MyBusinessResponse[], AxiosError<ErrorResponse>>({
    queryFn: getMyBusinesses,
    queryKey: ["getMyBusinesses"],
    staleTime: 10 * 60 * 1000,
  });
};

export default useGetMyBusinesses;
