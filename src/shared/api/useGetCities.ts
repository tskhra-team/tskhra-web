import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const getCities = async () => {
  const response = await publicInstance.get("/cities");

  return response.data;
};

const useGetCitites = () => {
  return useQuery<Array<string>, AxiosError<ErrorResponse>>({
    queryFn: getCities,
    queryKey: ["getCities"],
    staleTime: 100 * 60 * 1000,
  });
};

export default useGetCitites;
