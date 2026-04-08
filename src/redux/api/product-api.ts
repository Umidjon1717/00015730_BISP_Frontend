import { IGetResponseProducts, IProduct, IProductQuery } from "@/types";
import { mainApi } from "./index";

const extendedApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<IGetResponseProducts, IProductQuery>({
      query: (params) => ({
        url: "products",
        method: "GET",
        params,
      }),
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
