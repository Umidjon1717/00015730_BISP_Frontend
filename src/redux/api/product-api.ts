import { IGetResponseProducts, IProduct, IProductQuery } from "@/types";
import { mainApi } from "./index";

interface RawProductResponse {
  statusCode?: number;
  status?: number;
  message?: string;
  data?: {
    products?: IProduct[];
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  products?: IProduct[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

function normalizeProductsResponse(res: unknown): IGetResponseProducts {
  const response = (res ?? {}) as RawProductResponse;

  // Expected shape in this app:
  // { statusCode, message, data: { products, page, limit, total, totalPages } }
  const products: IProduct[] | undefined =
    Array.isArray(response?.data?.products)
      ? response.data.products
      : Array.isArray(response?.products)
      ? response.products
      : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(res)
      ? res
      : undefined;

  if (!Array.isArray(products)) {
    return {
      statusCode: Number(response?.statusCode ?? response?.status ?? 200),
      message: String(response?.message ?? "OK"),
      data: {
        products: [],
        page: 1,
        limit: 0,
        total: 0,
        totalPages: 1,
      },
    };
  }

  const page = Number(response?.data?.page ?? response?.page ?? 1);
  const limit = Number(response?.data?.limit ?? response?.limit ?? products.length);
  const total = Number(response?.data?.total ?? response?.total ?? products.length);
  const totalPages = Number(response?.data?.totalPages ?? response?.totalPages ?? 1);

  return {
    statusCode: Number(response?.statusCode ?? response?.status ?? 200),
    message: String(response?.message ?? "OK"),
    data: {
      products,
      page,
      limit,
      total,
      totalPages,
    },
  };
}

const extendedApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<IGetResponseProducts, IProductQuery>({
      query: (params) => ({
        url: "products",
        method: "GET",
        params,
      }),
      transformResponse: (res: unknown) => normalizeProductsResponse(res),
      providesTags: ["Product"],
    }),
    getSingleProduct: build.query<IProduct, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery, useGetSingleProductQuery } = extendedApi;
