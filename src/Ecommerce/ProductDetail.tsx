import useEcommerceCart from "@/Ecommerce/hooks/useEcommerceCart";
import useEcommerceFavorites from "@/Ecommerce/hooks/useEcommerceFavorites";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "@/components/ui/star-rating";
import { useAuth } from "@/context/useAuth";
import useGetProfile from "@/features/profile/hooks/useGetProfile";
import { getPlatformColors } from "@/shared/categories/platformColors";
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
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import {
  MOCK_PRODUCTS,
} from "./ProductCatalog";
import { getAverageRating, getReviewsForProduct, type Review } from "./mockReviews";

// ── Product descriptions ─────────────────────────────────────────────

const MOCK_PRODUCT_DESCRIPTIONS: Record<number, string> = {
  1: "Samsung Galaxy S24 Ultra with titanium frame, 200MP camera, and S Pen. Features a 6.8-inch Dynamic AMOLED display and Snapdragon 8 Gen 3 processor for flagship performance.",
  2: "Apple iPhone 15 Pro Max with A17 Pro chip, titanium design, and advanced camera system. 48MP main camera with 5x optical zoom and USB-C connectivity.",
  3: "iPad Pro 12.9\" with M2 chip, Liquid Retina XDR display, and ProMotion technology. Perfect for creative professionals and power users.",
  4: "MacBook Air with M3 chip delivers incredible performance in an impossibly thin design. 15-hour battery life, 18GB unified memory, and a stunning Liquid Retina display.",
  5: "Kindle Paperwhite 2024 with 6.8\" glare-free display, adjustable warm light, and up to 10 weeks of battery life. Waterproof design for reading anywhere.",
  6: "Samsung 55\" OLED TV with Neural Quantum Processor, Dolby Atmos, and Object Tracking Sound. Infinite contrast ratio for the ultimate viewing experience.",
  7: "Sony WH-1000XM5 wireless noise-cancelling headphones with industry-leading noise cancellation, 30-hour battery, and crystal-clear hands-free calling.",
  8: "Canon EOS R50 mirrorless camera with 24.2MP APS-C sensor, 4K video recording, and advanced autofocus. Lightweight and perfect for content creators.",
  9: "PlayStation 5 Slim console with ultra-high speed SSD, ray tracing, and haptic feedback. Smaller, sleeker design with 1TB storage.",
  10: "USB-C Charging Hub 7-in-1 with HDMI 4K output, USB 3.0 ports, SD card reader, and 100W Power Delivery pass-through charging.",
  11: "Levi's 501 Original Fit Jeans in classic straight-leg silhouette. Iconic denim with button fly closure, made from premium cotton.",
  12: "The North Face insulated jacket with DryVent waterproof technology, ThermoBall insulation, and adjustable hood. Built for cold weather adventures.",
  13: "Zara oversized blazer in premium fabric with structured shoulders and flap pockets. Versatile for both casual and professional styling.",
  14: "H&M summer dress in lightweight, breathable fabric with floral print. Features adjustable straps and a flattering A-line silhouette.",
  15: "Nike Air Max 90 sneakers with visible Max Air cushioning, waffle outsole for traction, and iconic design details. A timeless streetwear classic.",
  16: "Adidas Ultraboost 23 running shoes with BOOST midsole for energy return, Primeknit upper, and Continental rubber outsole for grip.",
  17: "Genuine leather crossbody bag with adjustable strap, multiple compartments, and gold-tone hardware. Compact design fits all daily essentials.",
  18: "IKEA KALLAX shelf unit with 4x4 grid design, versatile storage with optional inserts. Perfect for books, decor, and organization.",
  19: "Philips Air Fryer XXL with Rapid Air technology for healthier cooking. Extra-large capacity, digital display, and multiple preset programs.",
  20: "Dyson V15 Detect cordless vacuum with laser dust detection, piezo sensor, and LCD screen showing particle counts. Up to 60 minutes of runtime.",
  21: "Bosch 18V cordless drill set with impact driver, 2 batteries, charger, and 40-piece accessory kit. Professional performance for DIY projects.",
  22: "Premium cotton bedding set in king size with 400 thread count. Includes duvet cover, fitted sheet, and 4 pillowcases. Machine washable.",
  23: "Harry Potter complete book set with all 7 novels in hardcover edition. Collector's box with original artwork and premium binding.",
  24: "Sapiens: A Brief History of Humankind by Yuval Noah Harari. Bestselling exploration of human evolution, culture, and the forces that shaped civilization.",
  25: "Curated vinyl record collection featuring 10 classic jazz albums. Includes works by Miles Davis, John Coltrane, and Thelonious Monk on 180g vinyl.",
  26: "Wilson Pro Staff tennis racket with carbon fiber frame, 97 sq inch head size, and vibration dampening technology. Endorsed by professional players.",
  27: "Premium cork yoga mat with natural antimicrobial surface, non-slip grip, and TPE rubber base. 5mm thick for optimal cushioning during practice.",
  28: "4-person camping tent with waterproof flysheet, fiberglass poles, and mesh ventilation. Quick setup design with integrated rainfly and gear loft.",
  29: "Mountain bike with 29\" wheels, Shimano 21-speed drivetrain, hydraulic disc brakes, and aluminum alloy frame. Front suspension fork for trail riding.",
  30: "65-liter hiking backpack with adjustable torso length, hip belt, and multiple access points. Rain cover included. Ideal for multi-day treks.",
};

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
      <p className="text-sm text-slate-600 leading-relaxed wrap-break-word overflow-hidden">{review.comment}</p>
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
    <form onSubmit={handleSubmit} className="p-5 bg-white rounded-2xl border border-slate-100 space-y-4">
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
          backgroundColor: rating > 0 && comment.trim() ? "#2563EB" : "#94a3b8",
        }}
      >
        <Send className="w-4 h-4" />
        {t("reviews.submit", { defaultValue: "Submit Review" })}
      </button>
    </form>
  );
}

// ── Component ──────────────────────────────────────────────────────────

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("ecommerce");
  const colors = getPlatformColors("ecommerce");
  const { isFavorite, toggleFavorite } = useEcommerceFavorites();
  const { addToCart, isInCart } = useEcommerceCart();
  const { isAuthenticated, login } = useAuth();
  const { data: profile } = useGetProfile();

  const productId = Number(id);
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  const description = MOCK_PRODUCT_DESCRIPTIONS[productId];
  const reviews = getReviewsForProduct(productId);
  const avgRating = getAverageRating(productId);
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);

  // Related products: same category, excluding current
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return MOCK_PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id
    ).slice(0, 4);
  }, [product]);

  // Build category slug for breadcrumb link
  const categorySlug = product?.category.toLowerCase().replace(/\s+/g, "-");

  if (!product) {
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link
            to="/ecommerce"
            className="hover:text-slate-800 transition-colors"
          >
            {t("nav.products", { defaultValue: "Shop" })}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            to={`/ecommerce/category/${categorySlug}`}
            className="hover:text-slate-800 transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium truncate max-w-50 sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* ── Product Main Section ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="relative aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Condition badge */}
              <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700">
                {product.condition}
              </span>
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

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <p className="text-sm text-slate-500 mb-1">
                {product.category} / {product.subcategory}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {product.name}
              </h1>
            </div>

            {/* Description */}
            {description && (
              <p className="text-slate-600 leading-relaxed">
                {description}
              </p>
            )}

            {/* Product features */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium">
                <Package className="w-4 h-4" />
                {product.condition}
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                {t("productDetail.verified", { defaultValue: "Verified" })}
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium">
                <Star className="w-4 h-4" />
                {product.subcategory}
              </div>
            </div>

            {/* ── Price ────────────────────────────────────────────── */}
            <p className="text-2xl font-bold text-slate-900">
              {product.price}₾
            </p>

            {/* ── Add to Cart Button ───────────────────────────────── */}
            <button
              onClick={() => addToCart(product)}
              className={`w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-base font-semibold transition-all duration-200 cursor-pointer ${
                isInCart(product.id)
                  ? "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              }`}
            >
              <GiShoppingCart className="w-5 h-5" />
              {isInCart(product.id)
                ? t("cart.addMore")
                : t("cart.addToCart")}
            </button>
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
                      productId: productId,
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
                    isOwn={review.userId === (profile?.userName ?? "current-user")}
                    onDelete={(id) =>
                      setLocalReviews((prev) => prev.filter((r) => r.id !== id))
                    }
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-2xl border border-slate-100">
                  <MessageSquare className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-slate-500 text-sm font-medium">
                    {t("reviews.noReviews", {
                      defaultValue: "No reviews yet. Be the first to review!",
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
              <Link
                to={`/ecommerce/catalog?category=${encodeURIComponent(product.category)}`}
                className="text-sm font-semibold transition-colors hover:opacity-80"
                style={{ color: colors.active.icon }}
              >
                {t("productDetail.viewAll", { defaultValue: "View all" })}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/ecommerce/product/${rp.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-medium text-slate-700">
                      {rp.condition}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">
                      {rp.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {rp.category}
                    </p>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {rp.price}₾
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
