import { mainApi } from "./index";
import { IWishlistResponse } from "@/types";

const extendedApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    toggleWishlist: build.mutation<unknown, { productId: number; customerId: number }>({
      query: (body) => ({
        url: "like",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist", "Product"],
    }),
    getWishlist: build.query<IWishlistResponse, number>({
      query: (id) => ({
        url: `like/customer/${id}`,
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),

    setWishlist: build.mutation<unknown, { customerId: number; wishlist: number[] }>({
      query: (args) => ({
        url: `like/wishlist/${args.customerId}`,
        method: "POST",
        body: args.wishlist,
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useToggleWishlistMutation,
  useGetWishlistQuery,
  useSetWishlistMutation,
} = extendedApi;
