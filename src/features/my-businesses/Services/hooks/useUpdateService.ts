import { privateInstance } from "@/api";
import type { ServiceType } from "@/features/business-creation/booking-business/IndividualBusinessSchema";
import type { ServiceResponse } from "@/features/my-businesses/Services/hooks/useDeleteService";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type UpdateServiceParams = {
  serviceId: string;
  businessId: string;
  service: ServiceType;
};

const updateService = async ({
  businessId,
  serviceId,
  service,
}: UpdateServiceParams) => {
  const response = await privateInstance.put(
    `/business/${businessId}/services/${serviceId}`,
    service,
  );

  return response.data;
};

const useUpdateService = () => {
  return useMutation<
    ServiceResponse,
    AxiosError<ErrorResponse>,
    UpdateServiceParams
  >({
    mutationFn: updateService,
  });
};

export default useUpdateService;
