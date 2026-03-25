import { publicInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type CityResponse = {
  id: number;
  name: string;
};

const getCities = async (lang: string) => {
  const response = await publicInstance.get("/cities", { params: { lang } });

  return response.data;
};

const useGetCitites = (lang: string) => {
  return useQuery<CityResponse[], AxiosError<ErrorResponse>>({
    queryFn: () => getCities(lang),
    queryKey: ["getCities", lang],
    staleTime: 100 * 60 * 1000,
  });
};

export default useGetCitites;
