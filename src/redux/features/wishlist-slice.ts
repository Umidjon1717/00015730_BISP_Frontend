import { IProduct } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveStorage } from "../../utils";

export interface IWishlistState {
  value: IProduct[];
}

const wishlistStore = localStorage.getItem("wishlist");
const initialState: IWishlistState = {
  value: wishlistStore ? JSON.parse(wishlistStore) : [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<IProduct>) => {
      const isLiked = state.value.some((item) => item.id === action.payload.id);
      if (!isLiked) {
        state.value.push(action.payload);
      } else {
        state.value = state.value.filter(
          (item) => item.id !== action.payload.id
        );
      }
      saveStorage("wishlist", state.value);
    },
    clearWishlist: (state) => {
      state.value = [];
      localStorage.removeItem("wishlist");
    },
  },
});

export const { toggleLike, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
