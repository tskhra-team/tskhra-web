import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type IndividualBusinessResponseData = {
  status: number;
  message: string;
  businessId: string;
};

type CreateBusinessRequest = {
  businessName: string;
  callType: "outcall" | "onsite" | "both";
  city: string;
  address: string;
  description: string;
  mainCategory: string;
  category: string;
  workTimes: Array<{
    weekDay: string;
    startTime: number;
    endTime: number;
  }>;
  restTimes?: Array<{
    weekDay: string;
    startTime: number;
    endTime: number;
  }>;
  info: {
    phoneNumber?: string;
    instagramUrl?: string;
    facebookUrl?: string;
  };
  mainPhotoId: string;
  galleryPhotoIds: string[];
};

const createIndividualBusiness = async (data: CreateBusinessRequest) => {
  const response = await privateInstance.post("/business/individual", data);
  return response.data;
};

const useCreateIndividualBusiness = () => {
  return useMutation<
    IndividualBusinessResponseData,
    AxiosError<ErrorResponse>,
    CreateBusinessRequest
  >({
    mutationFn: createIndividualBusiness,
  });
};

export default useCreateIndividualBusiness;
