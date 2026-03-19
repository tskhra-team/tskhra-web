// import StatusModal from "@/components/StatusModal";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import useUpdateProfile from "@/features/profile/hooks/useUpdateProfile";
// import useVerify from "@/features/profile/hooks/useVerify";
// import LivenessCamera from "@/features/verification/LivenessCamera";
// import useKYC from "@/features/verification/useKYC";
// import queryClient from "@/query/queryClient";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {
//   ArrowLeft,
//   Camera,
//   CheckCircle2,
//   CreditCard,
//   Upload,
//   User,
//   X,
// } from "lucide-react";
// import { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";
// import * as yup from "yup";

// // Form data type
// type VerificationFormData = {
//   firstName: string;
//   lastName: string;
//   birthDate: string;
//   personalID: string;
//   phoneNumber: string;
//   gender: "MALE" | "FEMALE";
//   idCardFront: File | null;
//   facePhoto: File | null;
// };

// // Validation schema
// const validationSchema = yup.object({
//   firstName: yup.string().required("First name is required"),
//   lastName: yup.string().required("Last name is required"),
//   birthDate: yup.string().required("Birth date is required"),
//   personalID: yup.string().required("Personal ID is required"),
//   phoneNumber: yup.string().required("Phone number is required"),
//   gender: yup
//     .string()
//     .oneOf(["MALE", "FEMALE"], "Gender must be either MALE or FEMALE")
//     .required("Gender is required"),
//   idCardFront: yup
//     .mixed()
//     .test(
//       "fileRequired",
//       "ID card front is required",
//       (value) => value !== null && value !== undefined,
//     ),
//   facePhoto: yup
//     .mixed()
//     .test(
//       "fileRequired",
//       "Face photo is required",
//       (value) => value !== null && value !== undefined,
//     ),
// });

// export default function Verification() {
//   const { mutate: verifyUser } = useVerify();
//   const { mutate: sendKYCVerification } = useKYC();
//   const { mutate: updateProfile } = useUpdateProfile();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     isLoading: false,
//     isError: false,
//     isSuccess: false,
//     loadingText: "",
//     errorText: "",
//     successText: "",
//   });
//   const navigate = useNavigate();
//   const { t } = useTranslation("verification");

//   // Initialize React Hook Form
//   const {
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//     trigger,
//   } = useForm<VerificationFormData>({
//     resolver: yupResolver(validationSchema) as any,
//     mode: "onBlur",
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       birthDate: "",
//       personalID: "",
//       phoneNumber: "",
//       gender: "MALE",
//       idCardFront: null,
//       facePhoto: null,
//     },
//   });

//   // Watch file uploads for preview
//   const idCardFront = watch("idCardFront");
//   const facePhoto = watch("facePhoto");

//   const steps = [
//     { id: 1, title: t("steps.personalInfo"), icon: User },
//     { id: 2, title: t("steps.idCard"), icon: CreditCard },
//     { id: 3, title: t("steps.facePhoto"), icon: Camera },
//   ];

//   // Handle file upload
//   const handleFileUpload = (
//     fieldName: "idCardFront" | "facePhoto",
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setValue(fieldName, file, { shouldValidate: true });
//     }
//   };

//   // Remove uploaded file
//   const handleFileRemove = (fieldName: "idCardFront" | "facePhoto") => {
//     setValue(fieldName, null, { shouldValidate: true });
//   };

//   // Handle step navigation with validation
//   const handleNext = async () => {
//     let fieldsToValidate: (keyof VerificationFormData)[] = [];

//     if (currentStep === 1) {
//       fieldsToValidate = [
//         "firstName",
//         "lastName",
//         "birthDate",
//         "personalID",
//         "phoneNumber",
//         "gender",
//       ];
//     } else if (currentStep === 2) {
//       fieldsToValidate = ["idCardFront"];
//     }

//     const isValid = await trigger(fieldsToValidate);
//     if (isValid && currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   // Handle modal close
//   const handleCloseModal = () => {
//     setModalState({
//       isOpen: false,
//       isLoading: false,
//       isError: false,
//       isSuccess: false,
//       loadingText: "",
//       errorText: "",
//       successText: "",
//     });
//     // navigate("/profile");
//   };

//   // Form submission
//   const onSubmit = (data: VerificationFormData) => {
//     if (!data.idCardFront || !data.facePhoto) return;

//     // Step 1: Open modal and start KYC verification
//     setModalState({
//       isOpen: true,
//       isLoading: true,
//       isError: false,
//       isSuccess: false,
//       loadingText: "Verifying your identity...",
//       errorText: "",
//       successText: "",
//     });

//     sendKYCVerification(
//       {
//         idCardFront: data.idCardFront,
//         facePhoto: data.facePhoto,
//       },
//       {
//         onSuccess: (kycResponse) => {
//           // Check if face match is verified
//           if (!kycResponse.verified) {
//             setModalState({
//               isOpen: true,
//               isLoading: false,
//               isError: true,
//               isSuccess: false,
//               loadingText: "",
//               errorText:
//                 "Face verification failed. Please ensure your photo matches your ID card.",
//               successText: "",
//             });
//             return;
//           }

//           // Step 2: Update profile with user data
//           setModalState({
//             isOpen: true,
//             isLoading: true,
//             isError: false,
//             isSuccess: false,
//             loadingText: "Updating your profile...",
//             errorText: "",
//             successText: "",
//           });

//           // Convert birthDate string to Date object for useUpdateProfile
//           const birthDateObj = new Date(data.birthDate);

//           // Parse phone number - split country code and number
//           // Expected format: "+995 555 123 456" or "+995555123456"
//           const cleanedPhone = data.phoneNumber.replace(/\s/g, ""); // Remove spaces
//           const phoneMatch = cleanedPhone.match(/^(\+\d{1,3})(\d+)$/);
//           const phoneCountryCode = phoneMatch ? phoneMatch[1] : "+995";
//           const phoneNumber = phoneMatch ? phoneMatch[2] : cleanedPhone;

//           updateProfile(
//             {
//               firstName: data.firstName,
//               lastName: data.lastName,
//               birthDate: birthDateObj,
//               gender: data.gender,
//               phoneCountryCode: phoneCountryCode,
//               phoneNumber: phoneNumber,
//             },
//             {
//               onSuccess: () => {
//                 // Step 3: Call verify user
//                 setModalState({
//                   isOpen: true,
//                   isLoading: true,
//                   isError: false,
//                   isSuccess: false,
//                   loadingText: "Completing verification...",
//                   errorText: "",
//                   successText: "",
//                 });

//                 verifyUser(undefined, {
//                   onSuccess: () => {
//                     setModalState({
//                       isOpen: true,
//                       isLoading: false,
//                       isError: false,
//                       isSuccess: true,
//                       loadingText: "",
//                       errorText: "",
//                       successText: "Verification completed successfully!",
//                     });

//                     // Wait 2 seconds before redirecting
//                     setTimeout(() => {
//                       queryClient.invalidateQueries({
//                         queryKey: ["getUser"],
//                       });
//                       queryClient.invalidateQueries({
//                         queryKey: ["getProfile"],
//                       });
//                       navigate("/profile");
//                     }, 2000);
//                   },
//                   onError: () => {
//                     // useVerify should never fail, but just in case
//                     setModalState({
//                       isOpen: true,
//                       isLoading: false,
//                       isError: false,
//                       isSuccess: true,
//                       loadingText: "",
//                       errorText: "",
//                       successText: "Verification completed successfully!",
//                     });

//                     setTimeout(() => {
//                       queryClient.invalidateQueries({
//                         queryKey: ["getUser"],
//                       });
//                       queryClient.invalidateQueries({
//                         queryKey: ["getProfile"],
//                       });
//                       navigate("/profile");
//                     }, 2000);
//                   },
//                 });
//               },
//               onError: () => {
//                 setModalState({
//                   isOpen: true,
//                   isLoading: false,
//                   isError: true,
//                   isSuccess: false,
//                   loadingText: "",
//                   errorText: "Failed to update profile. Please try again.",
//                   successText: "",
//                 });
//               },
//             },
//           );
//         },
//         onError: () => {
//           setModalState({
//             isOpen: true,
//             isLoading: false,
//             isError: true,
//             isSuccess: false,
//             loadingText: "",
//             errorText: "KYC verification failed. Please try again.",
//             successText: "",
//           });
//         },
//       },
//     );
//   };

//   return (
//     <>
//       <StatusModal
//         isOpen={modalState.isOpen}
//         isLoading={modalState.isLoading}
//         isError={modalState.isError}
//         isSuccess={modalState.isSuccess}
//         loadingText={modalState.loadingText}
//         errorText={modalState.errorText}
//         successText={modalState.successText}
//         onClose={handleCloseModal}
//       />
//       <div className="h-auto bg-linear-to-br py-12 px-4">
//         <Button
//           type="button"
//           variant="link"
//           className="md:absolute mb-10 cursor-pointer"
//           onClick={() => navigate("/profile")}
//         >
//           <ArrowLeft />
//           {t("navigation.goBack")}
//         </Button>
//         <div className="max-w-4xl mx-auto">
//           {/* Step Indicators */}
//           <div className="flex items-center justify-between mb-10 relative">
//             {/* Progress Line */}
//             <div className="absolute top-6 md:left-40 md:right-40 h-1 bg-gray-200 -z-10">
//               <div
//                 className="h-full bg-linear-to-r from-green-500 to-emerald-600 transition-all duration-500"
//                 style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
//               />
//             </div>

//             {steps.map((step) => {
//               const Icon = step.icon;
//               const isActive = currentStep === step.id;
//               const isCompleted = currentStep > step.id;

//               return (
//                 <div
//                   key={step.id}
//                   className="flex flex-col items-center flex-1 relative"
//                 >
//                   <div
//                     className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
//                       isCompleted
//                         ? "bg-linear-to-br from-green-500 to-emerald-600 shadow-lg"
//                         : isActive
//                           ? "bg-linear-to-br from-green-500 to-emerald-600 shadow-lg scale-110"
//                           : "bg-white border-2 border-gray-300"
//                     }`}
//                   >
//                     {isCompleted ? (
//                       <CheckCircle2 className="w-6 h-6 text-white" />
//                     ) : (
//                       <Icon
//                         className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-400"}`}
//                       />
//                     )}
//                   </div>
//                   <span
//                     className={`text-sm font-medium ${isActive ? "text-green-600" : "text-gray-500"}`}
//                   >
//                     {step.title}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Form Card */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
//             {/* Step 1: Personal Information */}
//             {currentStep === 1 && (
//               <div className="space-y-6 animate-in fade-in duration-500">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                     {t("step1.title")}
//                   </h2>
//                   <p className="text-gray-600">{t("step1.description")}</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="firstName">
//                       {t("step1.firstName.label")}
//                     </Label>
//                     <Controller
//                       name="firstName"
//                       control={control}
//                       render={({ field }) => (
//                         <Input
//                           {...field}
//                           id="firstName"
//                           placeholder={t("step1.firstName.placeholder")}
//                           className="h-12"
//                         />
//                       )}
//                     />
//                     {errors.firstName && (
//                       <p className="text-sm text-red-600">
//                         {errors.firstName.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="lastName">
//                       {t("step1.lastName.label")}
//                     </Label>
//                     <Controller
//                       name="lastName"
//                       control={control}
//                       render={({ field }) => (
//                         <Input
//                           {...field}
//                           id="lastName"
//                           placeholder={t("step1.lastName.placeholder")}
//                           className="h-12"
//                         />
//                       )}
//                     />
//                     {errors.lastName && (
//                       <p className="text-sm text-red-600">
//                         {errors.lastName.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="birthDate">
//                       {t("step1.birthDate.label")}
//                     </Label>
//                     <Controller
//                       name="birthDate"
//                       control={control}
//                       render={({ field }) => (
//                         <Input
//                           {...field}
//                           id="birthDate"
//                           type="date"
//                           className="h-12"
//                         />
//                       )}
//                     />
//                     {errors.birthDate && (
//                       <p className="text-sm text-red-600">
//                         {errors.birthDate.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="personalID">
//                       {t("step1.personalID.label")}
//                     </Label>
//                     <Controller
//                       name="personalID"
//                       control={control}
//                       render={({ field }) => (
//                         <Input
//                           {...field}
//                           id="personalID"
//                           placeholder={t("step1.personalID.placeholder")}
//                           className="h-12"
//                         />
//                       )}
//                     />
//                     {errors.personalID && (
//                       <p className="text-sm text-red-600">
//                         {errors.personalID.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="phoneNumber">
//                       {t("step1.phoneNumber.label")}
//                     </Label>
//                     <Controller
//                       name="phoneNumber"
//                       control={control}
//                       render={({ field }) => (
//                         <Input
//                           {...field}
//                           id="phoneNumber"
//                           type="tel"
//                           placeholder={t("step1.phoneNumber.placeholder")}
//                           className="h-12"
//                         />
//                       )}
//                     />
//                     {errors.phoneNumber && (
//                       <p className="text-sm text-red-600">
//                         {errors.phoneNumber.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2 md:col-span-2">
//                     <Label htmlFor="gender">{t("step1.gender.label")}</Label>
//                     <Controller
//                       name="gender"
//                       control={control}
//                       render={({ field }) => (
//                         <Select
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger className="h-12">
//                             <SelectValue
//                               placeholder={t("step1.gender.placeholder")}
//                             />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="MALE">
//                               {t("step1.gender.male")}
//                             </SelectItem>
//                             <SelectItem value="FEMALE">
//                               {t("step1.gender.female")}
//                             </SelectItem>
//                           </SelectContent>
//                         </Select>
//                       )}
//                     />
//                     {errors.gender && (
//                       <p className="text-sm text-red-600">
//                         {errors.gender.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Step 2: ID Card Upload */}
//             {currentStep === 2 && (
//               <div className="space-y-6 animate-in fade-in duration-500">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                     {t("step2.title")}
//                   </h2>
//                   <p className="text-gray-600">{t("step2.description")}</p>
//                 </div>

//                 <div className="max-w-md mx-auto">
//                   <div className="space-y-3">
//                     <Label>{t("step2.frontSide.label")}</Label>
//                     {idCardFront ? (
//                       <div className="relative border-2 border-green-500 rounded-lg p-4">
//                         <img
//                           src={URL.createObjectURL(idCardFront)}
//                           alt="ID Card"
//                           className="w-full h-64 object-cover rounded"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => handleFileRemove("idCardFront")}
//                           className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ) : (
//                       <label className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-green-500 transition-colors cursor-pointer group block">
//                         <input
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={(e) => handleFileUpload("idCardFront", e)}
//                         />
//                         <div className="flex flex-col items-center justify-center text-center space-y-4">
//                           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
//                             <Upload className="w-8 h-8 text-green-600" />
//                           </div>
//                           <div>
//                             <p className="font-medium text-gray-700">
//                               {t("step2.frontSide.uploadText")}
//                             </p>
//                             <p className="text-sm text-gray-500">
//                               {t("step2.frontSide.dragDropText")}
//                             </p>
//                           </div>
//                         </div>
//                       </label>
//                     )}
//                     {errors.idCardFront && (
//                       <p className="text-sm text-red-600 mt-2">
//                         {errors.idCardFront.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                   <p className="text-sm text-blue-800">
//                     <strong>{t("step2.note.title")}</strong>{" "}
//                     {t("step2.note.description")}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Step 3: Face Photo */}
//             {currentStep === 3 && (
//               <div className="space-y-6 animate-in fade-in duration-500">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                     {t("step3.title")} {/* Liveness Check */}
//                   </h2>
//                   <p className="text-gray-600">{t("step3.description")}</p>
//                 </div>

//                 <div className="max-w-md mx-auto">
//                   {facePhoto ? (
//                     // ФОТО СДЕЛАНО УСПЕШНО
//                     <div className="relative border-2 border-green-500 rounded-lg p-4">
//                       <img
//                         src={URL.createObjectURL(facePhoto)}
//                         alt="Face Photo"
//                         className="w-full h-auto max-h-80 object-cover rounded"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleFileRemove("facePhoto")}
//                         className="absolute top-6 right-6 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
//                         title="Retake photo"
//                       >
//                         <X className="w-5 h-5" />
//                       </button>
//                     </div>
//                   ) : (
//                     // КАМЕРА LIVENESS
//                     <LivenessCamera
//                       onSuccess={(file) => {
//                         // Как только Liveness пройден, сетим файл в форму!
//                         setValue("facePhoto", file, { shouldValidate: true });
//                       }}
//                     />
//                   )}

//                   {errors.facePhoto && (
//                     <p className="text-sm text-red-600 mt-2 text-center">
//                       {errors.facePhoto.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
//                   <p className="text-sm text-amber-800">
//                     <strong>{t("step3.requirements.title")}</strong>
//                   </p>
//                   <ul className="text-sm text-amber-800 mt-2 space-y-1 list-disc list-inside">
//                     <li>{t("step3.requirements.lookAtCamera")}</li>
//                     <li>{t("step3.requirements.goodLighting")}</li>
//                     <li>{t("step3.requirements.removeSunglasses")}</li>
//                   </ul>
//                 </div>
//               </div>
//             )}

//             {/* Navigation Buttons */}
//             <div className="flex items-center justify-between mt-8 pt-8 border-t">
//               <Button
//                 variant="outline"
//                 onClick={handlePrevious}
//                 disabled={currentStep === 1}
//                 className="px-8 h-12"
//               >
//                 {t("buttons.previous")}
//               </Button>

//               {currentStep < 3 ? (
//                 <Button
//                   onClick={handleNext}
//                   className="px-8 h-12 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
//                 >
//                   {t("buttons.nextStep")}
//                 </Button>
//               ) : (
//                 <Button
//                   type="button"
//                   className="px-8 h-12 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
//                   onClick={handleSubmit(onSubmit)}
//                 >
//                   {t("buttons.submit")}
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import Loader from "@/components/Loader";
import { useModal } from "@/context/ModalContext";
import useGetSumSubToken from "@/features/verification/useGetSumSubToken";
import SumsubWebSdk from "@sumsub/websdk-react";
import { useEffect } from "react";

const SumsubWidget = () => {
  const { data, isLoading, isError, refetch } = useGetSumSubToken();
  const { showModal } = useModal();

  useEffect(() => {
    if (isError) {
      showModal("error", "Something went wrong", "Please try again later");
    }
  }, [isError, showModal]);

  const accessTokenExpirationHandler = async (): Promise<string> => {
    try {
      const result = await refetch();
      return result.data?.token || "";
    } catch (error) {
      showModal("error", "Something went wrong", "Please try again");
      return "";
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!data?.token) {
    return null;
  }

  return (
    <SumsubWebSdk
      className="w-full h-full"
      accessToken={data.token}
      expirationHandler={accessTokenExpirationHandler}
      config={{
        lang: "en",
      }}
      options={{
        addViewportTag: false,
        adaptIframeHeight: true,
      }}
      onMessage={(type: string, payload: any) => {
        console.log("Событие Sumsub:", type, payload);
      }}
      onError={(error: any) => {
        console.error("Ошибка Sumsub:", error);
      }}
    />
  );
};

export default SumsubWidget;
