import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  CreditCard,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SellerProfile, SellerStatus } from "./types";

const statusConfig: Record<
  SellerStatus,
  { className: string; translationKey: string }
> = {
  PENDING: {
    className: "bg-amber-100 text-amber-700 border-amber-200",
    translationKey: "sellerProfiles.statusPending",
  },
  APPROVED: {
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    translationKey: "sellerProfiles.statusApproved",
  },
  ACTIVE: {
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    translationKey: "sellerProfiles.statusApproved",
  },
  REJECTED: {
    className: "bg-red-100 text-red-700 border-red-200",
    translationKey: "sellerProfiles.statusRejected",
  },
};

type SellerProfileCardProps = {
  profile: SellerProfile;
};

export default function SellerProfileCard({ profile }: SellerProfileCardProps) {
  const { t } = useTranslation("profile");
  const status = statusConfig[profile.status] || statusConfig.PENDING;

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">
                {profile.name}
              </h3>
              <p className="text-sm text-slate-500">
                ID: {profile.identification_number}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={status.className}>
            {t(status.translationKey)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{profile.legal_address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{profile.contact_phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{profile.contact_email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{profile.bank_account_number}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
