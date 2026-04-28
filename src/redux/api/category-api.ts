import { mainApi } from "./index";
import { ICategoryResponse } from "@/types";

const extendedApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query({
      query: (params) => ({
        url: "category",
        method: "GET",
        params,
      }),
      providesTags: ["Category"],
    }),
    getSingleCategory: build.query<ICategoryResponse, number | undefined>({
      query: (id) => ({
        url: `category/${id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetSingleCategoryQuery } = extendedApi;
