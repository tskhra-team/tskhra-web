import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Search,
  Store,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useRegisterSeller from "./hooks/useRegisterSeller";
import useVerifyIdentification from "./hooks/useVerifyIdentification";
import type { RegisterSellerRequest } from "./types";

type RegisterSellerFormProps = {
  onBack: () => void;
};

export default function RegisterSellerForm({ onBack }: RegisterSellerFormProps) {
  const { t } = useTranslation("profile");
  const [step, setStep] = useState<"verify" | "details" | "success">("verify");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const verifyMutation = useVerifyIdentification();
  const registerMutation = useRegisterSeller();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSellerRequest>();

  const handleVerify = async () => {
    if (!identificationNumber.trim()) return;
    setVerifyError("");

    try {
      await verifyMutation.mutateAsync({
        identification_number: identificationNumber,
      });
      setStep("details");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        setVerifyError(t("sellerProfiles.errors.invalidIdNumber"));
      } else {
        setVerifyError(t("sellerProfiles.errors.verifyFailed"));
      }
    }
  };

  const onSubmit = async (data: RegisterSellerRequest) => {
    setRegisterError("");
    try {
      await registerMutation.mutateAsync({
        ...data,
        identification_number: identificationNumber,
      });
      setStep("success");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        const code = responseData?.error_code;

        if (code === "KYC_REQUIRED") {
          setRegisterError(t("sellerProfiles.errors.kycRequired"));
        } else if (code === "SELLER_REGISTRATION_PENDING") {
          setRegisterError(t("sellerProfiles.errors.registrationPending"));
        } else if (responseData?.detail) {
          const details = Array.isArray(responseData.detail)
            ? responseData.detail.map((d: { msg: string }) => d.msg).join(". ")
            : responseData.detail;
          setRegisterError(details);
        } else if (responseData?.message) {
          setRegisterError(responseData.message);
        } else {
          setRegisterError(t("sellerProfiles.errors.registerFailed"));
        }
      } else {
        setRegisterError(t("sellerProfiles.errors.registerFailed"));
      }
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              {t("sellerProfiles.successTitle")}
            </h2>
            <p className="text-slate-500 mb-6">
              {t("sellerProfiles.successMessage")}
            </p>
            <Button onClick={onBack} className="cursor-pointer">
              {t("sellerProfiles.backToProfiles")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="max-w-lg mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("sellerProfiles.backToProfiles")}
        </Button>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-indigo-50 rounded-xl">
                <Search className="w-5 h-5 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">
                {t("sellerProfiles.verifyTitle")}
              </CardTitle>
            </div>
            <p className="text-sm text-slate-500">
              {t("sellerProfiles.verifyDescription")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("sellerProfiles.identificationNumber")}
              </Label>
              <Input
                value={identificationNumber}
                onChange={(e) => setIdentificationNumber(e.target.value)}
                placeholder={t(
                  "sellerProfiles.identificationNumberPlaceholder",
                )}
                className="h-11"
              />
              {verifyError && (
                <p className="text-sm text-red-500">{verifyError}</p>
              )}
            </div>
            <Button
              onClick={handleVerify}
              disabled={
                !identificationNumber.trim() || verifyMutation.isPending
              }
              className="w-full cursor-pointer"
            >
              {verifyMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              {t("sellerProfiles.verifyButton")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => setStep("verify")}
        className="mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t("sellerProfiles.backToVerify")}
      </Button>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <Store className="w-5 h-5 text-indigo-600" />
            </div>
            <CardTitle className="text-xl">
              {t("sellerProfiles.registerTitle")}
            </CardTitle>
          </div>
          <p className="text-sm text-slate-500">
            {t("sellerProfiles.registerDescription")}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600">
                <span className="font-medium">
                  {t("sellerProfiles.identificationNumber")}:
                </span>{" "}
                {identificationNumber}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("sellerProfiles.businessName")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("name", {
                  required: t("sellerProfiles.errors.nameRequired"),
                  pattern: {
                    value: /^[a-zA-ZႠ-ჿ\s]+$/,
                    message: t("sellerProfiles.errors.nameLettersOnly"),
                  },
                })}
                placeholder={t("sellerProfiles.businessNamePlaceholder")}
                className="h-11"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("sellerProfiles.legalAddress")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("legal_address", {
                  required: t("sellerProfiles.errors.addressRequired"),
                })}
                placeholder={t("sellerProfiles.legalAddressPlaceholder")}
                className="h-11"
              />
              {errors.legal_address && (
                <p className="text-sm text-red-500">
                  {errors.legal_address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("sellerProfiles.contactPhone")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("contact_phone", {
                    required: t("sellerProfiles.errors.phoneRequired"),
                  })}
                  placeholder={t("sellerProfiles.contactPhonePlaceholder")}
                  className="h-11"
                />
                {errors.contact_phone && (
                  <p className="text-sm text-red-500">
                    {errors.contact_phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("sellerProfiles.contactEmail")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  {...register("contact_email", {
                    required: t("sellerProfiles.errors.emailRequired"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t("sellerProfiles.errors.emailInvalid"),
                    },
                  })}
                  placeholder={t("sellerProfiles.contactEmailPlaceholder")}
                  className="h-11"
                />
                {errors.contact_email && (
                  <p className="text-sm text-red-500">
                    {errors.contact_email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("sellerProfiles.bankAccount")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("bank_account_number", {
                  required: t("sellerProfiles.errors.bankRequired"),
                })}
                placeholder={t("sellerProfiles.bankAccountPlaceholder")}
                className="h-11"
              />
              {errors.bank_account_number && (
                <p className="text-sm text-red-500">
                  {errors.bank_account_number.message}
                </p>
              )}
            </div>

            {registerError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{registerError}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-11 cursor-pointer"
            >
              {registerMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Store className="w-4 h-4 mr-2" />
              )}
              {t("sellerProfiles.registerButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
