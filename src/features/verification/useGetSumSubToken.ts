import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type SumSubResponse = {
  token: string;
};

const getSumSubToken = async () => {
  const response = await privateInstance.get("/kyc/token");

  return response.data;
};

const useGetSumSubToken = () => {
  return useQuery<SumSubResponse, AxiosError<ErrorResponse>>({
    queryFn: getSumSubToken,
    queryKey: ["getSumSubToken"],
  });
};

export default useGetSumSubToken;
