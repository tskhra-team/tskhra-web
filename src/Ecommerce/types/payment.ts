export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  provider_payment_id: string;
  redirect_url: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: unknown[];
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface OrderWithPayment extends Order {
  payment: Payment;
}

export interface OrderHistoryResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaymentApiError {
  error_code:
    | "NOT_FOUND"
    | "FORBIDDEN"
    | "VALIDATION_ERROR"
    | "PAYMENT_FAILED";
  message: string;
}
