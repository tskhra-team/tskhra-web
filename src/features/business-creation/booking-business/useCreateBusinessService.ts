import { privateInstance } from "@/api";
import type { ServiceType } from "@/features/business-creation/booking-business/IndividualBusinessSchema";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type ServiceRequest = {
  businessId: string;
  services: ServiceType[];
};

type ServiceResponse = {
  status: string;
  message: string;
};

const createBusinessService = async ({
  businessId,
  services,
}: ServiceRequest) => {
  const response = await privateInstance.post(
    `/business/${businessId}/services`,
    { services },
  );

  return response.data;
};

const useCreateBusinessService = () => {
  return useMutation<
    ServiceResponse,
    AxiosError<ErrorResponse>,
    ServiceRequest
  >({
    mutationFn: createBusinessService,
  });
};

export default useCreateBusinessService;
