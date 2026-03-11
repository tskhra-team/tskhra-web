import { privateInstance } from "@/api";
import type { ServiceResponse } from "@/features/my-businesses/Services/hooks/useGetMyServices";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

type UpdateStatusParams = {
  businessId: string;
  serviceId: string;
  serviceStatus: string;
};

const updateStatus = async ({
  businessId,
  serviceId,
  serviceStatus,
}: UpdateStatusParams) => {
  const response = await privateInstance.put(
    `/business/${businessId}/services/${serviceId}/status`,
    serviceStatus,
  );

  return response.data;
};

const useUpdateStatus = () => {
  return useMutation<
    ServiceResponse,
    AxiosError<ErrorResponse>,
    UpdateStatusParams
  >({
    mutationFn: updateStatus,
  });
};

export default useUpdateStatus;
