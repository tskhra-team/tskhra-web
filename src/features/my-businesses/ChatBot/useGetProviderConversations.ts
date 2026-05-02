import { chatInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type ProviderConversation = {
  session_id: string;
  customer_id: number;
  customer_name: string;
  message_count: number;
  language: string;
  created_at: string;
  last_message_at: string;
};

type ProviderConversationsResponse = {
  provider_id: string;
  conversations: ProviderConversation[];
};

const getProviderConversations = async (
  providerId: string,
  adminApiKey: string,
) => {
  const response = await chatInstance.get<ProviderConversationsResponse>(
    `/api/admin/providers/${providerId}/conversations`,
    { headers: { "X-API-Key": adminApiKey } },
  );
  return response.data;
};

const useGetProviderConversations = (
  providerId: string | undefined,
  adminApiKey: string | undefined,
) => {
  return useQuery<ProviderConversationsResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getProviderConversations(providerId!, adminApiKey!),
    queryKey: ["getProviderConversations", providerId],
    enabled: !!providerId,
  });
};

export default useGetProviderConversations;
