import { chatInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type ChatHistoryMessage = {
  role: string;
  content: string;
  created_at: string;
};

type ChatHistoryResponse = {
  session_id: string;
  messages: ChatHistoryMessage[];
};

const getChatHistory = async (sessionId: string, chatApiKey: string) => {
  const response = await chatInstance.get<ChatHistoryResponse>(
    `/api/chat/history/${sessionId}`,
    { headers: { "X-API-Key": chatApiKey } },
  );
  return response.data;
};

const useGetChatHistory = (
  sessionId: string | null,
  chatApiKey: string | undefined,
) => {
  return useQuery<ChatHistoryResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getChatHistory(sessionId!, chatApiKey!),
    queryKey: ["getChatHistory", sessionId],
    enabled: !!sessionId && !!chatApiKey,
    staleTime: 0,
    gcTime: 0,
  });
};

export default useGetChatHistory;
