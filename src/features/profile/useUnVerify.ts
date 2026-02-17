import { privateInstance } from "@/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

type VerifyType = {
  status: boolean;
};

const unVerifyUser = async () => {
  const response = await privateInstance.post("/users/me/unverify");

  return response.data;
};

const useUnVerify = () => {
  return useMutation<VerifyType, AxiosError<ErrorResponse>>({
    mutationFn: unVerifyUser,
  });
};

export default useUnVerify;
