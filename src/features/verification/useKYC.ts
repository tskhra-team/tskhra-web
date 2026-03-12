import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";

const KYC_BASE_URL = "http://10.3.12.144:8000";

const kycInstance = axios.create({
  baseURL: KYC_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

type KYCPayload = {
  idCardFront: File;
  facePhoto: File;
};

type KYCResponse = {
  verified: boolean;
  distance: number;
  threshold: number;
  model: string;
  similarity_percent: number;
};

const sendKYCVerification = async (payload: KYCPayload) => {
  const formData = new FormData();
  formData.append("id_image", payload.idCardFront);
  formData.append("selfie", payload.facePhoto);

  const response = await kycInstance.post<KYCResponse>(
    "/verify/face-match",
    formData,
  );

  return response.data;
};

const useKYC = () => {
  return useMutation<KYCResponse, AxiosError, KYCPayload>({
    mutationFn: sendKYCVerification,
  });
};

export default useKYC;
