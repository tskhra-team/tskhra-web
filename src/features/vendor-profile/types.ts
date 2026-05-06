export type SellerStatus = "PENDING" | "APPROVED" | "ACTIVE" | "REJECTED";

export type SellerProfile = {
  supplier_id: number;
  name: string;
  user_id: string;
  identification_number: string;
  legal_address: string;
  contact_phone: string;
  contact_email: string;
  bank_account_number: string;
  status: SellerStatus;
};

export type SellerProfilesResponse = {
  sellers: SellerProfile[];
};

export type RegisterSellerRequest = {
  identification_number: string;
  name: string;
  legal_address: string;
  contact_phone: string;
  contact_email: string;
  bank_account_number: string;
};

export type VerifyIdentificationRequest = {
  identification_number: string;
};

export type ProductSpecification = {
  field_name: string;
  field_value: string;
};

export type CreateProductRequest = {
  category_id: number;
  brand_id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  sku: string;
  specifications: ProductSpecification[];
};

export type UpdateDraftRequest = {
  category_id?: number;
  brand_id?: number;
  title?: string;
  description?: string;
  price?: number;
  specifications?: ProductSpecification[];
};

export type UpdateProductRequest = UpdateDraftRequest;

export type VendorDraft = {
  task_id: string;
  status: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  sku: string;
  category_id: number;
  brand_id?: number;
  specifications: ProductSpecification[];
  images: string[];
  cover_image_url: string | null;
  created_at: string;
};

export type VendorLiveProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  stock_quantity: number;
  sku: string;
  cover_image_url: string;
  images: string[];
  category_id: number;
  brand_id?: number;
  specifications: ProductSpecification[];
};

export type VendorProductsResponse = {
  live_products: VendorLiveProduct[];
  drafts: VendorDraft[];
};
