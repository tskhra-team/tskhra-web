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
