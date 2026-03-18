import { privateInstance } from "@/api";
import type { ServiceResponse as DeleteResponse } from "@/features/my-businesses/Services/hooks/useGetMyServices";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const deleteBusiness = async (businessId: string) => {
  const response = await privateInstance.delete(`business/${businessId}`);

  return response.data;
};

const useDeleteBusiness = () => {
  return useMutation<DeleteResponse, AxiosError<ErrorResponse>, string>({
    mutationFn: deleteBusiness,
  });
};

export default useDeleteBusiness;
