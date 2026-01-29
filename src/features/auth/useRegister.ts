import type { RegisterSchema } from "@/features/auth/authSchema";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
interface IRegisterResponse {
    accessToken: string;
    refreshToken: string;
}

const register = async (data: RegisterSchema) => {
  const response = await axios.post("fdsfsf", data);
  return response.data.value
};

const useRegister = () => {
    return useMutation<IRegisterResponse, AxiosError, RegisterSchema>({
        mutationFn: register,
        
    })
}

export default useRegister;