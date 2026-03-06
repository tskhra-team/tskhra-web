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
  // Отправляем каждый сервис отдельно
  const servicePromises = services.map((service) =>
    privateInstance.post(`/business/${businessId}/services`, service),
  );

  // Ждем выполнения всех запросов
  await Promise.all(servicePromises);

  return {
    status: "success",
    message: "All services created successfully",
  };
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
