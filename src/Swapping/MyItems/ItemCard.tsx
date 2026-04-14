import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useDeleteItem from "@/Swapping/MyItems/useDeleteItem";
import type { Item } from "@/Swapping/MyItems/useGetMyItems";
import { ArrowRightLeft, Calendar, Loader2, MapPin, Pencil, Trash2 } from "lucide-react";

export function ItemCard({ item }: { item: Item }) {
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();

  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const CONDITION_STYLES: Record<string, string> = {
    NEW: "bg-green-100 text-green-800 border-green-200",
    LIKE_NEW: "bg-blue-100 text-blue-800 border-blue-200",
    USED: "bg-orange-100 text-orange-800 border-orange-200",
    DAMAGED: "bg-red-100 text-red-800 border-red-200",
  };

  const CONDITION_LABELS: Record<string, string> = {
    NEW: "New",
    LIKE_NEW: "Like New",
    USED: "Used",
    DAMAGED: "Damaged",
  };

  const TRADE_RANGE_LABELS: Record<string, string> = {
    CITY_WIDE: "City Wide",
    COUNTRY_WIDE: "Country Wide",
  };

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {item.description}
            </CardDescription>
          </div>
          {item.estimatedValue && (
            <span className="text-lg font-bold text-swap-primary shrink-0">
              {item.estimatedValue} ₾
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={CONDITION_STYLES[item.condition] || ""}
          >
            {CONDITION_LABELS[item.condition] || item.condition}
          </Badge>
          <Badge variant="secondary">{item.category}</Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3" />
            {TRADE_RANGE_LABELS[item.tradeRange] || item.tradeRange}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {item.city}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1">
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={isDeleting}
            onClick={() => deleteItem(item.id)}
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
