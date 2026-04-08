import { mainApi } from "./index";

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
    getSingleCategory: build.query({
      query: (id) => ({
        url: `category/${id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetSingleCategoryQuery } = extendedApi;
