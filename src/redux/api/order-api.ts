import { mainApi } from "./index";

const extendedApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<any, any>({
      query: (body) => ({
        // url: `http://localhost:3000/api/order`,
        url: "order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrderByCustomerId: build.query<any, number>({
      query: (customer_id) => ({
        url: `order/${customer_id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    deleteOrder: build.mutation<any, number>({
      query: (id) => ({
        url: `order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByCustomerIdQuery,
  useDeleteOrderMutation,
} = extendedApi;
