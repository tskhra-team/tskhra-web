import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const KYC_BASE_URL = "https://10.3.12.144:8000";

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
  overall_verified: boolean;
  face_match: {
    verified: boolean;
    distance: number;
    threshold: number;
    model: string;
    similarity_percent: number;
  };
  ocr: {
    raw_texts: string[];
    parsed_fields: Record<string, any>;
  };
  liveness: {
    is_live: boolean;
    confidence: number;
    checks: Record<string, any>;
  };
  document: {
    is_valid: boolean;
    confidence: number;
    checks: Record<string, any>;
  };
  errors: string[];
};

const sendKYCVerification = async (payload: KYCPayload) => {
  const formData = new FormData();
  formData.append("id_image", payload.idCardFront);
  formData.append("selfie", payload.facePhoto);

  const response = await kycInstance.post<KYCResponse>("/verify/full", formData);

  return response.data;
};

const useKYC = () => {
  return useMutation<KYCResponse, AxiosError, KYCPayload>({
    mutationFn: sendKYCVerification,
  });
};

export default useKYC;
