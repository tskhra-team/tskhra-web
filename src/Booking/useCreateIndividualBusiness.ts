import { privateInstance } from "@/api";
import type { IndividualBusinessFormData } from "@/Booking/IndividualBusinessSchema";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type IndividualBusinessResponseData = {
  status: number;
  message: string;
  businessId: string;
};

const createIndividualBusiness = async (data: IndividualBusinessFormData) => {
  const { images, mainCategory, subCategory, ...rest } = data;
  const finalData = {
    ...rest,
    category: subCategory,
  };
  const response = await privateInstance.post(
    "/business/individual",
    finalData,
  );

  return response.data;
};

const useCreaetIndividualBusiness = () => {
  return useMutation<
    IndividualBusinessResponseData,
    AxiosError<ErrorResponse>,
    IndividualBusinessFormData
  >({
    mutationFn: createIndividualBusiness,
  });
};

export default useCreaetIndividualBusiness;
