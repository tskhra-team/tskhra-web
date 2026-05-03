import { privateInstanceSeller } from "@/api";
import type {
  RegisterSellerRequest,
  SellerProfile,
  SellerProfilesResponse,
  VerifyIdentificationRequest,
} from "../types";

export const sellerApi = {
  getProfiles: () =>
    privateInstanceSeller
      .get<SellerProfilesResponse>("/profile")
      .then((r) => r.data),

  registerProfile: (data: RegisterSellerRequest) =>
    privateInstanceSeller
      .post<SellerProfile>("/profile", data)
      .then((r) => r.data),

  getProfile: (supplierId: number) =>
    privateInstanceSeller
      .get<SellerProfile>(`/profile/${supplierId}`)
      .then((r) => r.data),

  verifyIdentification: (data: VerifyIdentificationRequest) =>
    privateInstanceSeller
      .post<{ valid: boolean }>("/profile/verify-identification", data)
      .then((r) => r.data),
};
