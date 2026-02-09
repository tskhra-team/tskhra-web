import { privateInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
export type UserType = {
  status: string;
  userName: string;
  userEmail: string;
  createDate: string;
};
const getUser = async () => {
  const response = await privateInstance.get("/users/status"); //here we need API endpoint

  return response.data;
};

const useGetUser = () => {
  return useQuery<UserType, AxiosError>({
    queryFn: getUser,
    queryKey: ["getUser"],
  });
};

export default useGetUser;
