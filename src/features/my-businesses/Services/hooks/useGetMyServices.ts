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

const getMyServices = async (businessId: string, lang: string) => {
  const response = await privateInstance.get<ServiceResponse[]>(
    `/business/${businessId}/services`,
    { params: { lang } },
  );

  return response.data;
};

const useGetMyServices = (businessId: string, lang: string) => {
  return useQuery<ServiceResponse[], AxiosError<ErrorResponse>>({
    queryFn: () => getMyServices(businessId, lang),
    queryKey: ["getMyServices", businessId, lang],
    staleTime: 10 * 60 * 1000,
    enabled: !!businessId,
  });
};

export default useGetMyServices;
