import { publicInstance } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { LoginSchemaType } from "./authSchema";

interface ILoginResponse {
  access_token: string;
  refresh_token: string;
}

interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
}

const login = async (data: LoginSchemaType) => {
  const response = await publicInstance.post("/auth/login", data); //here we need API endpoint

  return response.data;
};

const useLogin = () => {
  return useMutation<ILoginResponse, AxiosError<ErrorResponse>, LoginSchemaType>({
    mutationFn: login,
  });
};

export default useLogin;
