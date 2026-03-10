import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type ServiceResponse = {
  status: string;
  message: string;
};

type DeleteServiceParams = {
  serviceId: string;
  businessId: string;
};

const deleteService = async ({
  serviceId,
  businessId,
}: DeleteServiceParams) => {
  const response = await privateInstance.delete<ServiceResponse>(
    `/business/${businessId}/services/${serviceId}`,
  );

  return response.data;
};

const useDeleteService = () => {
  return useMutation<
    ServiceResponse,
    AxiosError<ErrorResponse>,
    DeleteServiceParams
  >({
    mutationFn: deleteService,
  });
};

export default useDeleteService;
