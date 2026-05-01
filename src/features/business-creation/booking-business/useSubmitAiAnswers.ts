import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type SubmitAiAnswersPayload = {
  businessId: string;
  answers: Record<string, string>;
};

const submitAiAnswers = async (payload: SubmitAiAnswersPayload) => {
  const response = await privateInstance.post("/chatbot/answers", payload);
  return response.data;
};

const useSubmitAiAnswers = () => {
  return useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    SubmitAiAnswersPayload
  >({
    mutationFn: submitAiAnswers,
  });
};

export default useSubmitAiAnswers;
