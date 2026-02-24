import { privateInstance } from "@/api";
import type { IndividualBusinessFormData } from "@/Booking/IndividualBusinessSchema";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type UploadPhotosResponseData = {
  status: number;
  message: string;
};

type UploadPhotosVariable = {
  businessId: string;
  data: IndividualBusinessFormData;
};

const uploadPhotos = async ({ businessId, data }: UploadPhotosVariable) => {
  const formData = new FormData();

  if (data.images.businessPhoto) {
    formData.append("businessPhoto", data.images.businessPhoto);
  }

  if (data.images.galleryPhoto && data.images.galleryPhoto.length > 0) {
    data.images.galleryPhoto.forEach((file) => {
      formData.append("galleryPhoto", file);
    });
  }

  const response = await privateInstance.post(
    `/businesses/${businessId}/images`,
    formData,
  );

  return response.data;
};

const useUploadPhotos = () => {
  return useMutation<
    UploadPhotosResponseData,
    AxiosError<ErrorResponse>,
    UploadPhotosVariable
  >({
    mutationFn: uploadPhotos,
  });
};

export default useUploadPhotos;
