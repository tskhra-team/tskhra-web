import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/useAuth";
import { Loader2, Minus, Plus, Trash2, X } from "lucide-react";
import { TbArrowNarrowUpDashed } from "react-icons/tb";
import { GiShoppingCart } from "react-icons/gi";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { STORE_COLORS } from "./ProductCatalog";
import useEcommerceCart from "./hooks/useEcommerceCart";

export default function ShoppingCart() {
  const location = useLocation();
  const { t } = useTranslation("ecommerce");
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const {
    items,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    isLoading,
    isCheckingOut,
    isMutating,
  } = useEcommerceCart();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Only show on ecommerce routes
  if (!location.pathname.startsWith("/ecommerce")) return null;

  const renderCartBody = () => {
    if (isAuthenticated && isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <GiShoppingCart className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">
            {t("cart.loginRequired")}
          </h3>
          <p className="text-sm text-slate-500 max-w-60 mb-4">
            {t("cart.emptyDescription")}
          </p>
          <Button
            onClick={login}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t("cart.loginButton")}
          </Button>
        </motion.div>
      );
    }

    if (items.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <GiShoppingCart className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">
            {t("cart.emptyTitle")}
          </h3>
          <p className="text-sm text-slate-500 max-w-60">
            {t("cart.emptyDescription")}
          </p>
        </motion.div>
      );
    }

    return items.map((item) => (
      <motion.div
        key={item.id}
        layout
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.25 }}
        className="flex gap-4 p-3 rounded-2xl bg-slate-50/80 border border-slate-100"
      >
        {/* Product Image */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white">
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
          {item.product.store &&
            STORE_COLORS[item.product.store] && (
              <span
                className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{
                  backgroundColor: STORE_COLORS[item.product.store].bg,
                  color: STORE_COLORS[item.product.store].text,
                }}
              >
                {item.product.store}
              </span>
            )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 truncate">
              {item.product.name}
            </h4>
            {item.product.category && (
              <p className="text-xs text-slate-500 mt-0.5">
                {item.product.category}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            {/* Quantity Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
                disabled={isMutating}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-slate-800">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
                disabled={isMutating}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Price */}
            <p className="text-sm font-bold text-slate-900">
              {item.subtotal}₾
            </p>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(item.product.id)}
          disabled={isMutating}
          className="self-start p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </motion.div>
    ));
  };

  return (
    <>
    {/* ── Scroll to Top Button ─────────────────────────────── */}
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          key="scroll-top"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-600 border border-slate-200 shadow-md hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <TbArrowNarrowUpDashed className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </motion.button>
      )}
    </AnimatePresence>

    <Sheet open={open} onOpenChange={setOpen}>
      {/* ── Floating Cart Button ──────────────────────────────── */}
      <SheetTrigger asChild>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <GiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />

          {/* Badge */}
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex items-center justify-center min-w-4.5 h-4.5 sm:min-w-5.5 sm:h-5.5 px-1 rounded-full bg-rose-500 text-white text-[10px] sm:text-xs font-bold ring-2 ring-white"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </SheetTrigger>

      {/* ── Slide-Out Sidebar ─────────────────────────────────── */}
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex flex-col w-full sm:max-w-md p-0"
      >
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <SheetTitle className="text-lg">{t("cart.title")}</SheetTitle>
            <SheetDescription className="text-xs">
              {t("cart.itemCount", { count: totalItems })}
            </SheetDescription>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                disabled={isMutating}
                className="text-xs text-slate-500 hover:text-rose-600"
              >
                {t("cart.clearAll")}
              </Button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </SheetHeader>

        {/* Cart Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
          <AnimatePresence mode="popLayout">
            {renderCartBody()}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-slate-100 px-6 py-5 gap-4">
            {/* Price Breakdown */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>
                  {t("cart.subtotal", { count: totalItems })}
                </span>
                <span>{totalPrice}₾</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{t("cart.shipping")}</span>
                <span className="text-green-600 font-medium">{t("cart.shippingFree")}</span>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900">{t("cart.total")}</span>
                <span className="text-xl font-bold text-slate-900">
                  {totalPrice}₾
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/20"
              onClick={() => {
                checkout(() => {
                  setOpen(false);
                  navigate("/ecommerce/orders");
                });
              }}
              disabled={isCheckingOut || isMutating}
            >
              {isCheckingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t("cart.checkout")
              )}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
    </>
  );
}
