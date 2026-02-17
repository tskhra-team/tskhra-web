import { privateInstance } from "@/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

type VerifyType = {
  status: boolean;
};

const verifyUser = async () => {
  const response = await privateInstance.post("/users/me/verify");

  return response.data;
};

const useVerify = () => {
  return useMutation<VerifyType, AxiosError<ErrorResponse>>({
    mutationFn: verifyUser,
  });
};

export default useVerify;
