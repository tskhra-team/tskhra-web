import { publicInstance } from "@/api";
import type { RegisterSchemaType } from "@/features/auth/authSchema";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
interface IRegisterResponse {
  accessToken: string;
  refreshToken: string;
}

const register = async (data: RegisterSchemaType) => {
  const response = await publicInstance.post("/api/users/register", data);
  return response.data.value;
};

const useRegister = () => {
  return useMutation<IRegisterResponse, AxiosError, RegisterSchemaType>({
    mutationFn: register,
  });
};

export default useRegister;
