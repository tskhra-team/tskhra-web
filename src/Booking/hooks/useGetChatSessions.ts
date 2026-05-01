import { chatInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type ChatSession = {
  session_id: string;
  provider_id: string;
  preview: string;
  message_count: number;
  created_at: string;
  last_message_at: string;
};

type ChatSessionsResponse = {
  customer_id: number;
  sessions: ChatSession[];
};

const getChatSessions = async (customerId: number, chatApiKey: string) => {
  const response = await chatInstance.get<ChatSessionsResponse>(
    "/api/chat/my-sessions",
    {
      params: { customer_id: customerId },
      headers: { "X-API-Key": chatApiKey },
    },
  );
  return response.data;
};

const useGetChatSessions = (
  customerId: number | undefined,
  chatApiKey: string | undefined,
) => {
  return useQuery<ChatSessionsResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getChatSessions(customerId!, chatApiKey!),
    queryKey: ["getChatSessions", customerId],
    enabled: !!customerId && !!chatApiKey,
    staleTime: 0,
    gcTime: 0,
  });
};

export default useGetChatSessions;
