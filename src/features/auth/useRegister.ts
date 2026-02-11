import { publicInstance } from "@/api";
import type { RegisterSchemaType } from "@/features/auth/authSchema";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

const register = async (data: RegisterSchemaType) => {
  const response = await publicInstance.post("/users/register", data);
  return response.data.value;
};

const useRegister = () => {
  return useMutation<
    { success: boolean },
    AxiosError<ErrorResponse>,
    RegisterSchemaType
  >({
    mutationFn: register,
  });
};

export default useRegister;
