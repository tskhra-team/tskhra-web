import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Facebook, Instagram, Phone } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { BusinessInfo } from "@/Booking/types/booking.types";

type ContactInformationCardProps = {
  info: BusinessInfo;
};

export default function ContactInformationCard({
  info,
}: ContactInformationCardProps) {
  const { t } = useTranslation("booking");
  const [showContactInfo, setShowContactInfo] = useState(false);

  if (!info.phoneNumber && !info.facebookUrl && !info.instagramUrl) {
    return null;
  }

  return (
    <Card className=" rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setShowContactInfo(!showContactInfo)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("businessDetails.sections.contactInformation")}
              </p>
              <span className="font-semibold text-sm">
                {info.phoneNumber ||
                  t("businessDetails.social.facebook") ||
                  t("businessDetails.social.instagram")}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${showContactInfo ? "rotate-180" : ""}`}
          />
        </div>

        {/* Contact Details */}
        {showContactInfo && (
          <div className="space-y-2 mt-4 pt-4 border-t">
            {info.phoneNumber && (
              <a
                href={`tel:${info.phoneNumber}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{info.phoneNumber}</span>
              </a>
            )}

            {info.facebookUrl && (
              <a
                href={info.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/5 hover:text-blue-600 transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Facebook className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">
                  {t("businessDetails.social.facebook")}
                </span>
              </a>
            )}

            {info.instagramUrl && (
              <a
                href={info.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-500/5 hover:text-pink-600 transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                  <Instagram className="w-4 h-4 text-pink-600" />
                </div>
                <span className="text-sm font-medium">
                  {t("businessDetails.social.instagram")}
                </span>
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
