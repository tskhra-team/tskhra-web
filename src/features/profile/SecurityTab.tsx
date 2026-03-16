import { Button } from "@/components/ui/button";
import { AlertTriangle, Lock, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SecurityTab() {
  const { t } = useTranslation("profile");

  const handleChangePassword = () => {
    // TODO: Implement change password modal
    console.log("Change password clicked");
  };

  const handleChangeEmail = () => {
    // TODO: Implement change email modal
    console.log("Change email clicked");
  };

  const handleDeleteAccount = () => {
    // TODO: Implement delete account confirmation modal
    console.log("Delete account clicked");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Change Password Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-linear-to-br from-indigo-50 to-indigo-100 rounded-lg">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-1">
              {t("security.changePassword.title")}
            </h3>
            <p className="text-sm text-slate-500">
              {t("security.changePassword.description")}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleChangePassword}
          className="w-full hover:bg-slate-50 hover:border-indigo-400"
        >
          {t("security.changePassword.button")}
        </Button>
      </section>

      {/* Change Email Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-linear-to-br from-indigo-50 to-indigo-100 rounded-lg">
            <Mail className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-1">
              {t("security.changeEmail.title")}
            </h3>
            <p className="text-sm text-slate-500">
              {t("security.changeEmail.description")}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleChangeEmail}
          className="w-full hover:bg-slate-50 hover:border-indigo-400"
        >
          {t("security.changeEmail.button")}
        </Button>
      </section>

      {/* Delete Account Card */}
      <section className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-linear-to-br from-rose-50 to-rose-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-rose-900 tracking-tight mb-1">
              {t("security.deleteAccount.title")}
            </h3>
            <p className="text-sm text-rose-600">
              {t("security.deleteAccount.description")}
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          className="w-full"
        >
          {t("security.deleteAccount.button")}
        </Button>
      </section>
    </div>
  );
}
