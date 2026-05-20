import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface Questions {
  questions: string[];
  category: number;
}

const getAiQuestions = async (category: string, lang: string) => {
  const response = await privateInstance.get(`/chatbot/questions`, {
    params: { category, lang },
  });

  return response.data;
};

const useGetAIQuestions = (categoryId: string, lang: string, enabled: boolean) => {
  return useQuery<Questions, AxiosError<ErrorResponse>>({
    queryFn: () => getAiQuestions(categoryId, lang),
    queryKey: ["getAiQuestion", categoryId, lang],
    enabled: enabled,
  });
};

export default useGetAIQuestions;
