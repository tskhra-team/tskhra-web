import { publicInstance } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { LoginSchemaType } from "./authSchema";

interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

const login = async (data: LoginSchemaType) => {
  const response = await publicInstance.post("/user/login", data); //here we need API endpoint

  return response.data;
};

const useLogin = () => {
  return useMutation<ILoginResponse, AxiosError, LoginSchemaType>({
    mutationFn: login,
  });
};

export default useLogin;
