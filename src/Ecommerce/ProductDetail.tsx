import useEcommerceCart from "@/Ecommerce/hooks/useEcommerceCart";
import useEcommerceFavorites from "@/Ecommerce/hooks/useEcommerceFavorites";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "@/components/ui/star-rating";
import { useAuth } from "@/context/useAuth";
import useGetProfile from "@/features/profile/hooks/useGetProfile";
import { getPlatformColors } from "@/shared/categories/platformColors";
import useGetEcommerceProduct from "@/shared/api/useGetEcommerceProduct";
import type { DetailedEcommerceProduct } from "@/shared/api/useGetEcommerceProduct";
import useGetEcommerceProducts from "@/shared/api/useGetEcommerceProducts";
import type { EcommerceProduct } from "@/shared/api/useGetEcommerceProducts";
import {
  ChevronRight,
  Heart,
  MessageSquare,
  Package,
  Send,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { GiShoppingCart } from "react-icons/gi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { getAverageRating, getReviewsForProduct, type Review } from "./mockReviews";
import type { Product } from "./ProductCatalog";

function toCartProduct(p: DetailedEcommerceProduct): Product {
  return {
    id: p.id,
    name: p.title,
    price: p.price,
    image: p.image_url || p.images[0] || "",
    store: "Alta",
    condition: p.stock_quantity > 0 ? "New" : "Used",
    category: p.category?.parent?.name ?? p.category?.name ?? "General",
    subcategory: p.category?.name ?? "",
  };
}

// ── Review Card ───────────────────────────────────────────────────────

function ReviewCard({
  review,
  isOwn,
  onDelete,
}: {
  review: Review;
  isOwn?: boolean;
  onDelete?: (id: number) => void;
}) {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-slate-200">
          <AvatarImage src={review.userAvatar} alt={review.userName} />
          <AvatarFallback className="text-sm bg-blue-50 text-blue-700">
            {review.userName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm truncate">
            {review.userName}
          </p>
          <p className="text-xs text-slate-400">
            {new Date(review.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <StarRating rating={review.rating} size="sm" />
        {isOwn && onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-sm text-slate-600 leading-relaxed wrap-break-word overflow-hidden">
        {review.comment}
      </p>
    </div>
  );
}

// ── Review Form ───────────────────────────────────────────────────────

function ReviewForm({
  onSubmit,
  t,
}: {
  onSubmit: (rating: number, comment: string) => void;
  t: (key: string, options?: Record<string, string>) => string;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") return;
    onSubmit(rating, comment.trim());
    setRating(0);
    setComment("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-white rounded-2xl border border-slate-100 space-y-4"
    >
      <h3 className="font-semibold text-slate-900 text-sm">
        {t("reviews.writeReview", { defaultValue: "Write a Review" })}
      </h3>
      <div className="space-y-1.5">
        <p className="text-xs text-slate-500">
          {t("reviews.yourRating", { defaultValue: "Your Rating" })}
        </p>
        <StarRating rating={rating} interactive onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("reviews.commentPlaceholder", {
          defaultValue: "Share your experience with this product...",
        })}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 resize-none transition-all"
        rows={3}
      />
      <button
        type="submit"
        disabled={rating === 0 || comment.trim() === ""}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        style={{
          backgroundColor:
            rating > 0 && comment.trim() ? "#2563EB" : "#94a3b8",
        }}
      >
        <Send className="w-4 h-4" />
        {t("reviews.submit", { defaultValue: "Submit Review" })}
      </button>
    </form>
  );
}

// ── Related Product Card ──────────────────────────────────────────────

function RelatedProductCard({ product }: { product: EcommerceProduct }) {
  return (
    <Link
      to={`/ecommerce/product/${product.id}`}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {product.cover_image_url ? (
          <img
            src={product.cover_image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Package className="w-10 h-10" />
          </div>
        )}
        {product.stock_quantity <= 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-red-50/90 backdrop-blur-sm text-[11px] font-medium text-red-600">
            Out of stock
          </span>
        )}
      </div>
      <div className="p-3">
        {product.brand && (
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">
            {product.brand.name}
          </p>
        )}
        <h3 className="font-semibold text-slate-900 text-sm truncate">
          {product.title}
        </h3>
        <p className="text-base font-bold text-slate-900 mt-1">
          {product.price.toFixed(2)}₾
        </p>
      </div>
    </Link>
  );
}

// ── Loading Skeleton ──────────────────────────────────────────────────

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-200 rounded-2xl aspect-square animate-pulse" />
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-20 bg-slate-200 rounded animate-pulse" />
            <div className="flex gap-3">
              <div className="h-9 w-24 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-9 w-24 bg-slate-200 rounded-xl animate-pulse" />
            </div>
            <div className="h-8 w-28 bg-slate-200 rounded animate-pulse" />
            <div className="h-14 bg-slate-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("ecommerce");
  const colors = getPlatformColors("ecommerce");
  const { isFavorite, toggleFavorite } = useEcommerceFavorites();
  const { addToCart, isInCart, isMutating } = useEcommerceCart();
  const { isAuthenticated, login } = useAuth();
  const { data: profile } = useGetProfile();

  const productId = id ? Number(id) : null;
  const { data, isLoading, isError } = useGetEcommerceProduct(productId);
  const product = data?.product ?? null;

  const [selectedImage, setSelectedImage] = useState(0);

  const reviews = productId ? getReviewsForProduct(productId) : [];
  const avgRating = productId ? getAverageRating(productId) : 0;
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);

  const { data: relatedData } = useGetEcommerceProducts(
    {
      category_id: product?.category_id ?? null,
      limit: 4,
    },
    product != null
  );

  const relatedProducts =
    relatedData?.items.filter((p) => p.id !== productId) ?? [];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [productId]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">
            {t("productNotFound", { defaultValue: "Product not found" })}
          </h1>
          <Link
            to="/ecommerce"
            className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: colors.active.icon }}
          >
            {t("backToShop", { defaultValue: "Back to shop" })}
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [
    product.image_url,
    ...product.images,
  ].filter(Boolean);

  const currentImage = allImages[selectedImage] || allImages[0] || "";

  const parentCategory = product.category?.parent;
  const categoryName = product.category?.name;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
          <Link
            to="/ecommerce"
            className="hover:text-slate-800 transition-colors"
          >
            {t("nav.products", { defaultValue: "Shop" })}
          </Link>
          {parentCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                to={`/ecommerce/category/${parentCategory.slug}`}
                className="hover:text-slate-800 transition-colors"
              >
                {parentCategory.name}
              </Link>
            </>
          )}
          {categoryName && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                to={
                  parentCategory
                    ? `/ecommerce/category/${parentCategory.slug}?sub=${product.category.slug}`
                    : `/ecommerce/category/${product.category.slug}`
                }
                className="hover:text-slate-800 transition-colors"
              >
                {categoryName}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium truncate max-w-50 sm:max-w-none">
            {product.title}
          </span>
        </nav>

        {/* ── Product Main Section ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="relative aspect-square">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                    <Package className="w-16 h-16" />
                  </div>
                )}
                {/* Stock badge */}
                {product.stock_quantity <= 0 && (
                  <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-red-50/90 backdrop-blur-sm text-xs font-medium text-red-600">
                    {t("productDetail.outOfStock", {
                      defaultValue: "Out of stock",
                    })}
                  </span>
                )}
                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors cursor-pointer"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isFavorite(product.id)
                        ? "fill-rose-500 text-rose-500"
                        : "text-slate-400 hover:text-rose-400"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === idx
                        ? "border-blue-500 shadow-md"
                        : "border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              {product.brand && (
                <div className="flex items-center gap-2 mb-2">
                  {product.brand.logo_url && (
                    <img
                      src={product.brand.logo_url}
                      alt={product.brand.name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <p className="text-sm text-slate-500 uppercase tracking-wide">
                    {product.brand.name}
                  </p>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {product.title}
              </h1>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Product features */}
            <div className="flex flex-wrap gap-3">
              {product.stock_quantity > 0 ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  {t("productDetail.inStock", { defaultValue: "In Stock" })}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
                  <Package className="w-4 h-4" />
                  {t("productDetail.outOfStock", {
                    defaultValue: "Out of stock",
                  })}
                </div>
              )}
              {product.brand && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium">
                  <Star className="w-4 h-4" />
                  {product.brand.name}
                </div>
              )}
              {categoryName && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium">
                  <Package className="w-4 h-4" />
                  {categoryName}
                </div>
              )}
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-slate-400">
                SKU: {product.sku}
              </p>
            )}

            {/* ── Price ────────────────────────────────────────────── */}
            <p className="text-2xl font-bold text-slate-900">
              {product.price.toFixed(2)}₾
            </p>

            {/* ── Add to Cart Button ───────────────────────────────── */}
            <button
              onClick={() => addToCart(toCartProduct(product))}
              disabled={product.stock_quantity <= 0 || isMutating}
              className={`w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-base font-semibold transition-all duration-200 cursor-pointer ${
                product.stock_quantity <= 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : isInCart(product.id)
                    ? "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <GiShoppingCart className="w-5 h-5" />
              {product.stock_quantity <= 0
                ? t("productDetail.outOfStock", { defaultValue: "Out of stock" })
                : isInCart(product.id)
                  ? t("cart.addMore")
                  : t("cart.addToCart")}
            </button>

            {/* ── Specifications ────────────────────────────────────── */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-semibold text-slate-900 text-sm mb-4">
                  {t("productDetail.specifications", {
                    defaultValue: "Specifications",
                  })}
                </h3>
                <div className="space-y-2">
                  {product.specifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                    >
                      <span className="text-sm text-slate-500">
                        {spec.field_name}
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {spec.field_value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews Section ─────────────────────────────────────── */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                {t("reviews.title", { defaultValue: "Customer Reviews" })}
              </h2>
              {localReviews.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 w-fit">
                  <StarRating rating={avgRating} size="sm" />
                  <span className="text-sm font-semibold text-slate-700">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({localReviews.length})
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <MessageSquare className="w-4 h-4" />
              {localReviews.length}{" "}
              {t("reviews.reviewCount", { defaultValue: "reviews" })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Review Form / Login Prompt */}
            <div className="lg:col-span-1">
              {isAuthenticated ? (
                <ReviewForm
                  t={t}
                  onSubmit={(rating, comment) => {
                    const userName =
                      profile?.firstName && profile?.lastName
                        ? `${profile.firstName} ${profile.lastName}`
                        : profile?.userName ?? "You";
                    const newReview: Review = {
                      id: Date.now(),
                      productId: productId!,
                      userId: profile?.userName ?? "current-user",
                      userName,
                      userAvatar: profile?.avatar ?? "",
                      rating,
                      comment,
                      date: new Date().toISOString().split("T")[0],
                    };
                    setLocalReviews((prev) => [newReview, ...prev]);
                  }}
                />
              ) : (
                <div className="p-5 bg-white rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-3 py-8">
                  <MessageSquare className="w-10 h-10 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">
                    {t("reviews.loginRequired", {
                      defaultValue: "Log in to leave a review",
                    })}
                  </p>
                  <button
                    onClick={login}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: colors.active.icon }}
                  >
                    {t("reviews.loginButton", { defaultValue: "Log In" })}
                  </button>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-3 max-h-150 overflow-y-auto pr-1 scrollbar-thin">
              {localReviews.length > 0 ? (
                localReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isOwn={
                      review.userId ===
                      (profile?.userName ?? "current-user")
                    }
                    onDelete={(id) =>
                      setLocalReviews((prev) =>
                        prev.filter((r) => r.id !== id)
                      )
                    }
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-2xl border border-slate-100">
                  <MessageSquare className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-slate-500 text-sm font-medium">
                    {t("reviews.noReviews", {
                      defaultValue:
                        "No reviews yet. Be the first to review!",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Related Products ────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {t("productDetail.relatedTitle", {
                  defaultValue: "Related Products",
                })}
              </h2>
              {product.category && (
                <Link
                  to={
                    parentCategory
                      ? `/ecommerce/category/${parentCategory.slug}?sub=${product.category.slug}`
                      : `/ecommerce/category/${product.category.slug}`
                  }
                  className="text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ color: colors.active.icon }}
                >
                  {t("productDetail.viewAll", { defaultValue: "View all" })}
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((rp) => (
                <RelatedProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
