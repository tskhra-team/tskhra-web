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
  businessNameKa: string;
  callType: "OUTCALL" | "ONSITE" | "BOTH";
  cityId: number;
  addressDetails: string | null;
  addressDetailsKa: string | null;
  description: string;
  descriptionKa: string;
  mainCategory: string;
  subCategory: string;
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
};

const createIndividualBusiness = async (data: CreateBusinessRequest) => {
  const { mainCategory, ...rest } = data;
  const response = await privateInstance.post("/business/individual", rest);
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
