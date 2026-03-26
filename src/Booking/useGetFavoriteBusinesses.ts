import useGetUser from "@/features/user/useGetUser";

const useGetFavoriteBusinesses = (isAuthenticated: boolean) => {
  const { data: user, ...rest } = useGetUser(isAuthenticated);

  return {
    ...rest,
    data: user?.favoriteBusinesses ?? [],
  };
};

export default useGetFavoriteBusinesses;
