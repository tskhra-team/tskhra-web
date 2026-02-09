import { publicInstance } from "@/api";

export interface IRefreshResponse {
  access_token: string;
  refresh_token: string;
}

type TransFormedRefreshRes = {
  accessToken: string;
  refreshToken: string;
};

export const refreshTokens = async (
  token: string,
): Promise<TransFormedRefreshRes> => {
  const {
    data: { value },
  } = await publicInstance.post<{ value: IRefreshResponse }>(`/auth/resfresh`, {
    refresh_token: token,
  });
  //here we refreshing the access and refresh token

  return { accessToken: value.access_token, refreshToken: value.refresh_token };
};
