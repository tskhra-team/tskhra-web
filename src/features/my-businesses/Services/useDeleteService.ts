import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type ServiceResponse = {
  status: string;
  message: string;
};

const deleteService = async (serviceId: string) => {
  const response = await privateInstance.delete<ServiceResponse>(
    `/service/${serviceId}/delete`,
  );

  return response.data;
};

const useDeleteService = () => {
  return useMutation<ServiceResponse, AxiosError<ErrorResponse>, string>({
    mutationFn: deleteService,
  });
};

export default useDeleteService;
