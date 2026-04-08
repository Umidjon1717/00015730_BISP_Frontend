import { mainApi } from "./index";

const extendedApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getAddress: build.query<any, number>({
      query: (customer_id) => ({
        url: `order-addresses/${customer_id}`,
        method: "GET",
      }),
      providesTags: ["Address"],
    }),
  }),
});

export const { useGetAddressQuery } = extendedApi;
