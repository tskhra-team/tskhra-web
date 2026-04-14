import { MOCK_PRODUCTS, STORE_COLORS } from "@/Ecommerce/ProductCatalog";
import { MOCK_REVIEWS } from "@/Ecommerce/mockReviews";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import StarRating from "@/components/ui/star-rating";
import useGetProfile from "@/features/profile/hooks/useGetProfile";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ReviewsTab() {
  const navigate = useNavigate();
  const { t } = useTranslation("profile");
  const { data: profile } = useGetProfile();

  // Match real user reviews + show some mock reviews for demo
  const myReviews = MOCK_REVIEWS.filter(
    (r) => r.userId === profile?.userName || r.userId === "u1",
  );

  if (myReviews.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-6">{t("reviews.title")}</h2>
        <div className="min-h-[40vh] flex flex-col items-center justify-center py-16 px-4">
          <div className="p-6 bg-linear-to-br from-amber-50 to-yellow-50 rounded-full mb-5 shadow-sm">
            <MessageSquare className="w-12 h-12 text-amber-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">
            {t("reviews.noReviewsTitle")}
          </h3>
          <p className="text-slate-500 text-center max-w-md mb-6 leading-relaxed">
            {t("reviews.noReviewsDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("reviews.title")}</h2>
        <span className="text-sm text-slate-500">
          {myReviews.length} {t("reviews.reviewCount")}
        </span>
      </div>

      <div className="space-y-4">
        {myReviews.map((review) => {
          const product = MOCK_PRODUCTS.find((p) => p.id === review.productId);
          if (!product) return null;

          return (
            <Card
              key={review.id}
              className="group overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md hover:border-indigo-200"
              onClick={() => navigate(`/ecommerce/product/${product.id}`)}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Product Image */}
                <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span
                    className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-bold"
                    style={{
                      backgroundColor: STORE_COLORS[product.store].bg,
                      color: STORE_COLORS[product.store].text,
                    }}
                  >
                    {product.store}
                  </span>
                </div>

                {/* Review Content */}
                <div className="flex-1 p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {product.category} / {product.subcategory}
                      </p>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {review.comment}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-slate-200">
                        <AvatarImage
                          src={review.userAvatar}
                          alt={review.userName}
                        />
                        <AvatarFallback className="text-[10px] bg-blue-50 text-blue-700">
                          {review.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-slate-500">
                        {review.userName}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
