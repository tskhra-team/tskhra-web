import { privateInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

export type SingleServiceRequest = {
  businessId: string;
  serviceId: string;
  lang: string;
};

export type SingleServiceResponse = {
  name: string;
};

export const getSingleService = async ({
  businessId,
  serviceId,
  lang,
}: SingleServiceRequest): Promise<SingleServiceResponse> => {
  const response = await privateInstance.get(
    `/business/${businessId}/services/${serviceId}`,
    { params: { lang } },
  );

  return response.data;
};

const useGetSingleService = (
  params: SingleServiceRequest,
  enabled: boolean = true,
) => {
  return useQuery<SingleServiceResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getSingleService(params),
    queryKey: [
      "getSingleService",
      params.businessId,
      params.serviceId,
      params.lang,
    ],
    enabled,
  });
};

export default useGetSingleService;
