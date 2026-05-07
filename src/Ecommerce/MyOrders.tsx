import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  patchOrderStatus,
  useGetOrderHistory,
  useProcessPayment,
} from "./hooks/usePaymentQuery";
import type { Order } from "./types/payment";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  checked_out: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

function isPayable(status: string) {
  return status === "pending" || status === "checked_out";
}

export default function MyOrders() {
  const { t } = useTranslation("ecommerce");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetOrderHistory(page, limit);
  const processPayment = useProcessPayment();

  const handlePay = (orderId: string) => {
    const origin = window.location.origin;
    processPayment.mutate(
      {
        orderId,
        successRedirectUri: `${origin}/ecommerce/orders/verify/${orderId}`,
        failRedirectUri: `${origin}/ecommerce/orders/verify/${orderId}`,
      },
      {
        onSuccess: (result) => {
          if (result.payment?.redirect_url) {
            window.location.href = result.payment.redirect_url;
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const orders = (data?.items ?? []).map(patchOrderStatus);
  const totalPages = data?.total_pages ?? 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        {t("orders.title")}
      </h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">
            {t("orders.empty")}
          </h3>
          <p className="text-sm text-slate-500 max-w-60 mb-4">
            {t("orders.emptyDescription")}
          </p>
          <Button
            onClick={() => navigate("/ecommerce")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t("orders.backToShop")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPay={handlePay}
              isPaying={
                processPayment.isPending &&
                processPayment.variables?.orderId === order.id
              }
              t={t}
            />
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600">
                {t("orders.page", { page, total: totalPages })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onPay,
  isPaying,
  t,
}: {
  order: Order;
  onPay: (id: string) => void;
  isPaying: boolean;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  const statusKey = order.status.toLowerCase();
  const colorClass = STATUS_COLORS[statusKey] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {t("orders.orderNumber", { id: order.id.slice(0, 8) })}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}
        >
          {t(`orders.statuses.${statusKey}`, { defaultValue: order.status })}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <ShoppingBag className="w-4 h-4" />
          <span>
            {t("orders.items", { count: order.items.length })}
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-900">
            {order.total_amount}₾
          </span>
        </div>

        {isPayable(statusKey) && (
          <Button
            size="sm"
            onClick={() => onPay(order.id)}
            disabled={isPaying}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
          >
            {isPaying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                {t("orders.pay")}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
