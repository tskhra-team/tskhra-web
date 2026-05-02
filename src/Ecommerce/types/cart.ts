export interface ServerCartItem {
  id: string;
  product_id: number;
  quantity: number;
  unit_price: number;
  product_title: string;
  product_image_url: string;
  subtotal: number;
  stock_quantity: number;
}

export interface ServerCart {
  id: string;
  user_id: string;
  items: ServerCartItem[];
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface AddItemRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateItemRequest {
  quantity: number;
}

export interface CheckoutResponse {
  cart_id: string;
  status: string;
  total: number;
  item_count: number;
  message: string;
}

export interface CartApiError {
  error_code:
    | "NOT_FOUND"
    | "CONFLICT"
    | "VALIDATION_ERROR"
    | "EXTERNAL_SERVICE_ERROR";
  message: string;
}
