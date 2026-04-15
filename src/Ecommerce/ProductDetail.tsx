import useEcommerceCart from "@/Ecommerce/hooks/useEcommerceCart";
import useEcommerceFavorites from "@/Ecommerce/hooks/useEcommerceFavorites";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "@/components/ui/star-rating";
import { useAuth } from "@/context/useAuth";
import useGetProfile from "@/features/profile/hooks/useGetProfile";
import { getPlatformColors } from "@/shared/categories/platformColors";
import {
  ChevronRight,
  ExternalLink,
  Heart,
  MessageSquare,
  Package,
  Send,
  ShieldCheck,
  ShoppingCart,
  Star,
  Trash2,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import {
  MOCK_PRODUCTS,
  STORE_COLORS,
  type Store,
} from "./ProductCatalog";
import { getAverageRating, getReviewsForProduct, type Review } from "./mockReviews";

// ── Multi-store pricing data ──────────────────────────────────────────

interface StorePrice {
  store: Store;
  price: number;
  condition: string;
  inStock: boolean;
  url: string;
}

interface ProductDetails {
  id: number;
  description: string;
  storePrices: StorePrice[];
}

// Mock descriptions & multi-store pricing for each product
const MOCK_PRODUCT_DETAILS: ProductDetails[] = [
  {
    id: 1,
    description:
      "Samsung Galaxy S24 Ultra with titanium frame, 200MP camera, and S Pen. Features a 6.8-inch Dynamic AMOLED display and Snapdragon 8 Gen 3 processor for flagship performance.",
    storePrices: [
      { store: "Alta", price: 3499, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 3649, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 3199, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 2,
    description:
      "Apple iPhone 15 Pro Max with A17 Pro chip, titanium design, and advanced camera system. 48MP main camera with 5x optical zoom and USB-C connectivity.",
    storePrices: [
      { store: "Alta", price: 4399, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 4299, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 3999, condition: "Like New", inStock: false, url: "#" },
    ],
  },
  {
    id: 3,
    description:
      "iPad Pro 12.9\" with M2 chip, Liquid Retina XDR display, and ProMotion technology. Perfect for creative professionals and power users.",
    storePrices: [
      { store: "Alta", price: 3899, condition: "Like New", inStock: true, url: "#" },
      { store: "Elit", price: 4099, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 3599, condition: "Used", inStock: true, url: "#" },
    ],
  },
  {
    id: 4,
    description:
      "MacBook Air with M3 chip delivers incredible performance in an impossibly thin design. 15-hour battery life, 18GB unified memory, and a stunning Liquid Retina display.",
    storePrices: [
      { store: "Alta", price: 4999, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 5199, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 4599, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 5,
    description:
      "Kindle Paperwhite 2024 with 6.8\" glare-free display, adjustable warm light, and up to 10 weeks of battery life. Waterproof design for reading anywhere.",
    storePrices: [
      { store: "Alta", price: 429, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 399, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 349, condition: "Like New", inStock: false, url: "#" },
    ],
  },
  {
    id: 6,
    description:
      "Samsung 55\" OLED TV with Neural Quantum Processor, Dolby Atmos, and Object Tracking Sound. Infinite contrast ratio for the ultimate viewing experience.",
    storePrices: [
      { store: "Alta", price: 3499, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 3299, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 2999, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 7,
    description:
      "Sony WH-1000XM5 wireless noise-cancelling headphones with industry-leading noise cancellation, 30-hour battery, and crystal-clear hands-free calling.",
    storePrices: [
      { store: "Alta", price: 899, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 949, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 799, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 8,
    description:
      "Canon EOS R50 mirrorless camera with 24.2MP APS-C sensor, 4K video recording, and advanced autofocus. Lightweight and perfect for content creators.",
    storePrices: [
      { store: "Alta", price: 2299, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 2199, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 1999, condition: "Used", inStock: true, url: "#" },
    ],
  },
  {
    id: 9,
    description:
      "PlayStation 5 Slim console with ultra-high speed SSD, ray tracing, and haptic feedback. Smaller, sleeker design with 1TB storage.",
    storePrices: [
      { store: "Alta", price: 1699, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 1649, condition: "New", inStock: false, url: "#" },
      { store: "Informal", price: 1599, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 10,
    description:
      "USB-C Charging Hub 7-in-1 with HDMI 4K output, USB 3.0 ports, SD card reader, and 100W Power Delivery pass-through charging.",
    storePrices: [
      { store: "Alta", price: 99, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 89, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 79, condition: "New", inStock: true, url: "#" },
    ],
  },
  {
    id: 11,
    description:
      "Levi's 501 Original Fit Jeans in classic straight-leg silhouette. Iconic denim with button fly closure, made from premium cotton.",
    storePrices: [
      { store: "Alta", price: 209, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 199, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 189, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 12,
    description:
      "The North Face insulated jacket with DryVent waterproof technology, ThermoBall insulation, and adjustable hood. Built for cold weather adventures.",
    storePrices: [
      { store: "Alta", price: 649, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 619, condition: "New", inStock: false, url: "#" },
      { store: "Informal", price: 599, condition: "Used", inStock: true, url: "#" },
    ],
  },
  {
    id: 13,
    description:
      "Zara oversized blazer in premium fabric with structured shoulders and flap pockets. Versatile for both casual and professional styling.",
    storePrices: [
      { store: "Alta", price: 249, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 219, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 189, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 14,
    description:
      "H&M summer dress in lightweight, breathable fabric with floral print. Features adjustable straps and a flattering A-line silhouette.",
    storePrices: [
      { store: "Alta", price: 129, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 139, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 99, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 15,
    description:
      "Nike Air Max 90 sneakers with visible Max Air cushioning, waffle outsole for traction, and iconic design details. A timeless streetwear classic.",
    storePrices: [
      { store: "Alta", price: 419, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 399, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 389, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 16,
    description:
      "Adidas Ultraboost 23 running shoes with BOOST midsole for energy return, Primeknit upper, and Continental rubber outsole for grip.",
    storePrices: [
      { store: "Alta", price: 479, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 449, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 399, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 17,
    description:
      "Genuine leather crossbody bag with adjustable strap, multiple compartments, and gold-tone hardware. Compact design fits all daily essentials.",
    storePrices: [
      { store: "Alta", price: 179, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 199, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 149, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 18,
    description:
      "IKEA KALLAX shelf unit with 4x4 grid design, versatile storage with optional inserts. Perfect for books, decor, and organization.",
    storePrices: [
      { store: "Alta", price: 229, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 219, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 199, condition: "Used", inStock: true, url: "#" },
    ],
  },
  {
    id: 19,
    description:
      "Philips Air Fryer XXL with Rapid Air technology for healthier cooking. Extra-large capacity, digital display, and multiple preset programs.",
    storePrices: [
      { store: "Alta", price: 449, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 479, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 399, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 20,
    description:
      "Dyson V15 Detect cordless vacuum with laser dust detection, piezo sensor, and LCD screen showing particle counts. Up to 60 minutes of runtime.",
    storePrices: [
      { store: "Alta", price: 1999, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 1899, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 1749, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 21,
    description:
      "Bosch 18V cordless drill set with impact driver, 2 batteries, charger, and 40-piece accessory kit. Professional performance for DIY projects.",
    storePrices: [
      { store: "Alta", price: 379, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 369, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 349, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 22,
    description:
      "Premium cotton bedding set in king size with 400 thread count. Includes duvet cover, fitted sheet, and 4 pillowcases. Machine washable.",
    storePrices: [
      { store: "Alta", price: 159, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 179, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 129, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 23,
    description:
      "Harry Potter complete book set with all 7 novels in hardcover edition. Collector's box with original artwork and premium binding.",
    storePrices: [
      { store: "Alta", price: 149, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 139, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 129, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 24,
    description:
      "Sapiens: A Brief History of Humankind by Yuval Noah Harari. Bestselling exploration of human evolution, culture, and the forces that shaped civilization.",
    storePrices: [
      { store: "Alta", price: 45, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 39, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 29, condition: "Used", inStock: true, url: "#" },
    ],
  },
  {
    id: 25,
    description:
      "Curated vinyl record collection featuring 10 classic jazz albums. Includes works by Miles Davis, John Coltrane, and Thelonious Monk on 180g vinyl.",
    storePrices: [
      { store: "Alta", price: 249, condition: "Used", inStock: true, url: "#" },
      { store: "Elit", price: 279, condition: "New", inStock: false, url: "#" },
      { store: "Informal", price: 219, condition: "Used", inStock: true, url: "#" },
    ],
  },
  {
    id: 26,
    description:
      "Wilson Pro Staff tennis racket with carbon fiber frame, 97 sq inch head size, and vibration dampening technology. Endorsed by professional players.",
    storePrices: [
      { store: "Alta", price: 299, condition: "Used", inStock: true, url: "#" },
      { store: "Elit", price: 349, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 269, condition: "Used", inStock: true, url: "#" },
    ],
  },
  {
    id: 27,
    description:
      "Premium cork yoga mat with natural antimicrobial surface, non-slip grip, and TPE rubber base. 5mm thick for optimal cushioning during practice.",
    storePrices: [
      { store: "Alta", price: 99, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 109, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 89, condition: "New", inStock: true, url: "#" },
    ],
  },
  {
    id: 28,
    description:
      "4-person camping tent with waterproof flysheet, fiberglass poles, and mesh ventilation. Quick setup design with integrated rainfly and gear loft.",
    storePrices: [
      { store: "Alta", price: 399, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 379, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 349, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 29,
    description:
      "Mountain bike with 29\" wheels, Shimano 21-speed drivetrain, hydraulic disc brakes, and aluminum alloy frame. Front suspension fork for trail riding.",
    storePrices: [
      { store: "Alta", price: 1399, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 1349, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 1299, condition: "Like New", inStock: true, url: "#" },
    ],
  },
  {
    id: 30,
    description:
      "65-liter hiking backpack with adjustable torso length, hip belt, and multiple access points. Rain cover included. Ideal for multi-day treks.",
    storePrices: [
      { store: "Alta", price: 199, condition: "New", inStock: true, url: "#" },
      { store: "Elit", price: 219, condition: "New", inStock: true, url: "#" },
      { store: "Informal", price: 179, condition: "Like New", inStock: true, url: "#" },
    ],
  },
];

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
      <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
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
  const details = MOCK_PRODUCT_DETAILS.find((d) => d.id === productId);
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

  // Sort store prices: in-stock first, then by price ascending
  const sortedPrices = useMemo(() => {
    if (!details) return [];
    return [...details.storePrices].sort((a, b) => {
      if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
      return a.price - b.price;
    });
  }, [details]);

  const bestPrice = useMemo(() => {
    const inStock = sortedPrices.filter((sp) => sp.inStock);
    return inStock.length > 0 ? Math.min(...inStock.map((sp) => sp.price)) : null;
  }, [sortedPrices]);

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
              {/* Store badge */}
              <span
                className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: STORE_COLORS[product.store].bg,
                  color: STORE_COLORS[product.store].text,
                }}
              >
                {product.store}
              </span>
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
            {details?.description && (
              <p className="text-slate-600 leading-relaxed">
                {details.description}
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

            {/* ── Price Comparison Cards ──────────────────────────── */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                {t("productDetail.compareTitle", {
                  defaultValue: "Compare prices across stores",
                })}
              </h2>
              <div className="space-y-3">
                {sortedPrices.map((sp) => {
                  const isBest = sp.inStock && sp.price === bestPrice;
                  return (
                    <div
                      key={sp.store}
                      className={`relative flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                        isBest
                          ? "border-green-200 bg-green-50/50 shadow-sm"
                          : sp.inStock
                          ? "border-slate-100 bg-white hover:border-slate-200"
                          : "border-slate-100 bg-slate-50 opacity-60"
                      }`}
                    >
                      {/* Best price badge */}
                      {isBest && (
                        <div className="absolute -top-2.5 left-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500 text-white text-[11px] font-bold">
                          <Trophy className="w-3 h-3" />
                          {t("productDetail.bestPrice", {
                            defaultValue: "Best Price",
                          })}
                        </div>
                      )}

                      {/* Store info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{
                            backgroundColor: STORE_COLORS[sp.store].bg,
                            color: STORE_COLORS[sp.store].text,
                          }}
                        >
                          {sp.store.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm">
                            {sp.store}
                          </p>
                          <p className="text-xs text-slate-500">
                            {sp.condition}
                            {!sp.inStock && (
                              <span className="ml-1.5 text-red-500 font-medium">
                                {t("productDetail.outOfStock", {
                                  defaultValue: "Out of stock",
                                })}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Price & action */}
                      <div className="flex items-center gap-4 shrink-0">
                        <span
                          className={`text-xl font-bold ${
                            isBest ? "text-green-700" : "text-slate-900"
                          }`}
                        >
                          {sp.price}₾
                        </span>
                        <a
                          href={sp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            sp.inStock
                              ? "text-white hover:opacity-90"
                              : "text-slate-400 bg-slate-200 pointer-events-none"
                          }`}
                          style={
                            sp.inStock
                              ? { backgroundColor: colors.active.icon }
                              : undefined
                          }
                        >
                          {t("productDetail.goToStore", {
                            defaultValue: "Go to Store",
                          })}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Add to Cart Button ───────────────────────────────── */}
            <button
              onClick={() => addToCart(product)}
              className={`w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-base font-semibold transition-all duration-200 cursor-pointer ${
                isInCart(product.id)
                  ? "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
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
                    <span
                      className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{
                        backgroundColor: STORE_COLORS[rp.store].bg,
                        color: STORE_COLORS[rp.store].text,
                      }}
                    >
                      {rp.store}
                    </span>
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-medium text-slate-700">
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
