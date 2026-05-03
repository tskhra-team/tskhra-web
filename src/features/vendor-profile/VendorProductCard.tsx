import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Package, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type VendorProductCardProps = {
  title: string;
  price: number;
  imageUrl: string | null;
  status: "live" | "draft" | "pending";
  onDelete?: () => void;
  isDeleting?: boolean;
};

const statusStyles = {
  live: "bg-emerald-100 text-emerald-700 border-emerald-200",
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function VendorProductCard({
  title,
  price,
  imageUrl,
  status,
  onDelete,
  isDeleting,
}: VendorProductCardProps) {
  const { t } = useTranslation("profile");

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">
                  {title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-sm font-medium text-indigo-600">
                    ₾{price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="outline"
                  className={statusStyles[status]}
                >
                  {t(`myProducts.status.${status}`)}
                </Badge>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
