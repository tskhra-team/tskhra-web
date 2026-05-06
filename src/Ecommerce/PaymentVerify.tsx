import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useVerifyPayment } from "./hooks/usePaymentQuery";

export default function PaymentVerify() {
  const { t } = useTranslation("ecommerce");
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const verifyPayment = useVerifyPayment();

  useEffect(() => {
    if (orderId && !verifyPayment.isSuccess && !verifyPayment.isError) {
      verifyPayment.mutate(orderId);
    }
  }, [orderId]);

  if (verifyPayment.isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-base text-slate-600">{t("payment.verifying")}</p>
      </div>
    );
  }

  const isPaid = verifyPayment.data?.payment?.status === "completed" || verifyPayment.isSuccess;

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto px-4">
      {isPaid && !verifyPayment.isError ? (
        <>
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {t("payment.success")}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {t("payment.successDescription")}
          </p>
          <Button
            onClick={() => navigate("/ecommerce/orders")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t("payment.backToOrders")}
          </Button>
        </>
      ) : (
        <>
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {t("payment.failed")}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {t("payment.failedDescription")}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/ecommerce/orders")}
            >
              {t("payment.backToOrders")}
            </Button>
            <Button
              onClick={() => orderId && verifyPayment.mutate(orderId)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t("payment.tryAgain")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
