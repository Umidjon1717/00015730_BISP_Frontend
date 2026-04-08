import { IGetResponseProducts, IProduct, IProductQuery } from "@/types";
import { mainApi } from "./index";

function normalizeProductsResponse(res: any): IGetResponseProducts {
  // Expected shape in this app:
  // { statusCode, message, data: { products, page, limit, total, totalPages } }
  const products: IProduct[] | undefined =
    res?.data?.products ??
    res?.products ??
    res?.data ??
    (Array.isArray(res) ? res : undefined);

  if (!Array.isArray(products)) {
    // Never throw here — throwing breaks rendering and leaves the UI in a "no data" state.
    // Fall back to empty so the app remains usable even if backend shape changes.
    return {
      statusCode: Number(res?.statusCode ?? res?.status ?? 200),
      message: String(res?.message ?? "OK"),
      data: {
        products: [],
        page: 1,
        limit: 0,
        total: 0,
        totalPages: 1,
      },
    };
  }

  const page = Number(res?.data?.page ?? res?.page ?? 1);
  const limit = Number(res?.data?.limit ?? res?.limit ?? products.length);
  const total = Number(res?.data?.total ?? res?.total ?? products.length);
  const totalPages = Number(res?.data?.totalPages ?? res?.totalPages ?? 1);

  return {
    statusCode: Number(res?.statusCode ?? res?.status ?? 200),
    message: String(res?.message ?? "OK"),
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
      transformResponse: (res: any) => normalizeProductsResponse(res),
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
