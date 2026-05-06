import { publicInstancePython } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ProductBrand } from "./useGetEcommerceProducts";

export interface ProductSpecification {
  field_name: string;
  field_value: string;
}

export interface DetailedProductCategory {
  id: number;
  name: string;
  slug: string;
  parent: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

export interface DetailedEcommerceProduct {
  id: number;
  category_id: number;
  supplier_id: number;
  brand: ProductBrand;
  image_url: string;
  title: string;
  description: string;
  price: number;
  sku: string;
  stock_quantity: number;
  images: string[];
  specifications: ProductSpecification[];
  category: DetailedProductCategory;
}

interface ProductResponse {
  product: DetailedEcommerceProduct;
}

const getEcommerceProduct = async (productId: number) => {
  const response = await publicInstancePython.get<ProductResponse>(
    `/ecommerce/products/${productId}`
  );
  return response.data;
};

const useGetEcommerceProduct = (productId: number | null) => {
  return useQuery<ProductResponse, AxiosError<ErrorResponse>>({
    queryFn: () => getEcommerceProduct(productId!),
    queryKey: ["getEcommerceProduct", productId],
    staleTime: 100 * 60 * 1000,
    enabled: productId != null,
  });
};

export default useGetEcommerceProduct;
