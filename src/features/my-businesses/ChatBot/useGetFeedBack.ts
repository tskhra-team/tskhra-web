import { chatInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type Insight = {
  type: string;
  title_ka: string;
  message_ka: string;
  title_en: string;
  message_en: string;
  priority: "high" | "medium" | "low";
};

type FeedBackResponse = {
  insights: Insight[];
  generated_at: string;
};

const getFeedBack = async (providerId: string, adminApiKey: string) => {
  const response = await chatInstance.get<FeedBackResponse>(
    `/api/admin/providers/${providerId}/insights`,
    { headers: { "X-API-Key": adminApiKey } },
  );
  return response.data;
};

const useGetFeedBack = (
  providerId: string | undefined,
  adminApiKey: string | undefined,
) => {
  return useQuery<FeedBackResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getFeedBack(providerId!, adminApiKey!),
    queryKey: ["getFeedBack", providerId],
    enabled: false,
  });
};

export default useGetFeedBack;
