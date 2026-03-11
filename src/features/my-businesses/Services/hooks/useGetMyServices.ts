import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type ServiceResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: string;
};

const getMyServices = async (businessId: string) => {
  const response = await privateInstance.get<ServiceResponse[]>(
    `/business/${businessId}/services`,
  );

  return response.data;
};

const useGetMyServices = (businessId: string) => {
  return useQuery<ServiceResponse[], AxiosError<ErrorResponse>>({
    queryFn: () => getMyServices(businessId),
    queryKey: ["getMyServices", businessId],
    staleTime: 10 * 60 * 1000,
    enabled: !!businessId,
  });
};

export default useGetMyServices;
