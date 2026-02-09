import { privateInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
export type UserType = {
  userEmail: string;
  userName: string;
  firstName: string | undefined;
  secondName: string | undefined;
  status: boolean;
  createDate: string;
  phoneNumber: string | undefined;
  gender: string | undefined;
  birthDate: string | undefined;
};
const getUser = async () => {
  const response = await privateInstance.get("/users/status"); //random endpoint here now

  return response.data;
};

const useGetUser = () => {
  return useQuery<UserType, AxiosError>({
    queryFn: getUser,
    queryKey: ["getUser"],
    enabled: false, // DELETE THIS WHEN ENDPOINT IS READY!!!!
  });
};

export default useGetUser;
