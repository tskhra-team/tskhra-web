import { chatInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type ConversationMessage = {
  role: string;
  content: string;
  created_at: string;
};

type ConversationMessagesResponse = {
  session_id: string;
  messages: ConversationMessage[];
};

const getConversationMessages = async (
  providerId: string,
  sessionId: string,
  adminApiKey: string,
) => {
  const response = await chatInstance.get<ConversationMessagesResponse>(
    `/api/admin/providers/${providerId}/conversations/${sessionId}`,
    { headers: { "X-API-Key": adminApiKey } },
  );
  return response.data;
};

const useGetProviderConversationMessages = (
  providerId: string | undefined,
  sessionId: string | null,
  adminApiKey: string | undefined,
) => {
  return useQuery<ConversationMessagesResponse, AxiosError<ErrorResponse>>({
    queryFn: () =>
      getConversationMessages(providerId!, sessionId!, adminApiKey!),
    queryKey: ["getProviderConversationMessages", providerId, sessionId],
    enabled: !!providerId && !!sessionId && !!adminApiKey,
  });
};

export default useGetProviderConversationMessages;
