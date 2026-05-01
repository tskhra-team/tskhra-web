import { privateInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

export interface CredResponse {
  aiProviderId: string;
  chatApiKey: string;
  adminApiKey: string;
}

const gteAIChatCred = async (businessId: string | undefined | null) => {
  const response = await privateInstance.get(`/chatbot/${businessId}`);

  return response.data;
};

const useGetAIChatCreds = (businessId: string | undefined | null) => {
  return useQuery<CredResponse, AxiosError<ErrorResponse>>({
    queryFn: () => gteAIChatCred(businessId),
    queryKey: ["getAICreds", businessId],
  });
};

export default useGetAIChatCreds;
