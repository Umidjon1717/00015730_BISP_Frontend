export interface IGetResponseProducts {
  data: IGetProducts;
  message: string;
  statusCode: number;
}
export interface IGetProducts {
  limit: number;
  page: number;
  products: IProduct[];
  total: number;
  totalPages: number;
}
export interface IReview {
  id: number;
  comment: string;
}
export interface IProduct {
  categoryId?: number;
  id: number;
  name: string;
  stock: number;
  images: string[];
  description: string;
  averageRating: number;
  price: number;
  sku: string;
  colors: string[];
  tags: string[];
  is_liked: boolean;
  discount: {
    percent: number;
  };
  reviews: IReview[];
}
export interface IProductQuery {
  filter?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  priceOrder?: "asc" | "desc";
  categoryId?: number;
}
export interface ICustomer {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  confirm_password?: string;
  phone_number: string;
}

export interface ICustomerDataResponse {
  statusCode: number;
  message: string;
  data: {
    customer: ICustomer;
  };
}
export interface OtpResponse {
  id?: number;
  access_token: string;
  statusCode: number;
  message: string;
}
