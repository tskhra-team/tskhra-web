import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  CreditCard,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Verification() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { t } = useTranslation("verification");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    personalID: "",
    gender: "",
  });

  const steps = [
    { id: 1, title: t("steps.personalInfo"), icon: User },
    { id: 2, title: t("steps.idCard"), icon: CreditCard },
    { id: 3, title: t("steps.facePhoto"), icon: Camera },
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-auto bg-linear-to-br py-12 px-4">
      <Button
        type="button"
        variant="link"
        className="md:absolute mb-10 cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <ArrowLeft />
        {t("navigation.goBack")}
      </Button>
      <div className="max-w-4xl mx-auto">
        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-10 relative">
          {/* Progress Line */}
          <div className="absolute top-6 md:left-40 md:right-40 h-1 bg-gray-200 -z-10">
            <div
              className="h-full bg-linear-to-r from-green-500 to-emerald-600 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>

          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center flex-1 relative"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-linear-to-br from-green-500 to-emerald-600 shadow-lg"
                      : isActive
                        ? "bg-linear-to-br from-green-500 to-emerald-600 shadow-lg scale-110"
                        : "bg-white border-2 border-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Icon
                      className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-400"}`}
                    />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${isActive ? "text-green-600" : "text-gray-500"}`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t("step1.title")}
                </h2>
                <p className="text-gray-600">{t("step1.description")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {t("step1.firstName.label")}
                  </Label>
                  <Input
                    id="firstName"
                    placeholder={t("step1.firstName.placeholder")}
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("step1.lastName.label")}</Label>
                  <Input
                    id="lastName"
                    placeholder={t("step1.lastName.placeholder")}
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    {t("step1.birthDate.label")}
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalID">
                    {t("step1.personalID.label")}
                  </Label>
                  <Input
                    id="personalID"
                    placeholder={t("step1.personalID.placeholder")}
                    value={formData.personalID}
                    onChange={(e) =>
                      handleInputChange("personalID", e.target.value)
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="gender">{t("step1.gender.label")}</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue
                        placeholder={t("step1.gender.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">
                        {t("step1.gender.male")}
                      </SelectItem>
                      <SelectItem value="F">
                        {t("step1.gender.female")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: ID Card Upload */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t("step2.title")}
                </h2>
                <p className="text-gray-600">{t("step2.description")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front Side */}
                <div className="space-y-3">
                  <Label>{t("step2.frontSide.label")}</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-green-500 transition-colors cursor-pointer group">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Upload className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          {t("step2.frontSide.uploadText")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t("step2.frontSide.dragDropText")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div className="space-y-3">
                  <Label>{t("step2.backSide.label")}</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-green-500 transition-colors cursor-pointer group">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Upload className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          {t("step2.backSide.uploadText")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t("step2.backSide.dragDropText")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>{t("step2.note.title")}</strong>{" "}
                  {t("step2.note.description")}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Face Photo */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t("step3.title")}
                </h2>
                <p className="text-gray-600">{t("step3.description")}</p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-green-500 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Camera className="w-12 h-12 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 text-lg">
                        {t("step3.uploadText")}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {t("step3.dragDropText")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>{t("step3.requirements.title")}</strong>
                </p>
                <ul className="text-sm text-amber-800 mt-2 space-y-1 list-disc list-inside">
                  <li>{t("step3.requirements.lookAtCamera")}</li>
                  <li>{t("step3.requirements.goodLighting")}</li>
                  <li>{t("step3.requirements.removeSunglasses")}</li>
                  <li>{t("step3.requirements.neutralExpression")}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-8 h-12"
            >
              {t("buttons.previous")}
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                className="px-8 h-12 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {t("buttons.nextStep")}
              </Button>
            ) : (
              <Button className="px-8 h-12 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                {t("buttons.submit")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
