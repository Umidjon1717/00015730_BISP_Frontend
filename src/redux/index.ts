import { configureStore } from "@reduxjs/toolkit";
import { mainApi } from "./api";
import tokenSlice from "./features/token-slice";
import otpSlice from "./features/otp-slice";
import wishlist from "./features/wishlist-slice";
import { cartSlice } from "./features/cart-slice";

export const store = configureStore({
  reducer: {
    otp: otpSlice,
    token: tokenSlice,
    wishlist,
    cart: cartSlice.reducer,
    [mainApi.reducerPath]: mainApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mainApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
