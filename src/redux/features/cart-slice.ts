import { IProduct } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICartProduct extends IProduct {
  amount: number;
}

export interface CartState {
  value: ICartProduct[];
}

const cartStore = localStorage.getItem("cart");
const initialState: CartState = {
  value: cartStore ? JSON.parse(cartStore) : [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart(state, action: PayloadAction<IProduct>) {
      let index = state.value.findIndex((item) => item.id === action.payload.id);
      if (index < 0) {
        state.value.push({ ...action.payload, amount: 1 });
        localStorage.setItem("cart", JSON.stringify(state.value));
      }
    },
    deleteCart(state, action: PayloadAction<number>) {
      state.value = state.value.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.value));
    },
    incrementAmountCart(state, action: PayloadAction<number>) {
      state.value = state.value.map((item) =>
        item.id === action.payload ? { ...item, amount: item.amount + 1 } : item
      );
      localStorage.setItem("cart", JSON.stringify(state.value));
    },
    decrementAmountCart(state, action: PayloadAction<number>) {
      state.value = state.value.map((item) =>
        item.id === action.payload && item.amount > 1
          ? { ...item, amount: item.amount - 1 }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(state.value));
    },
    clearCart(state) {
      state.value = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addCart, incrementAmountCart, clearCart, decrementAmountCart, deleteCart } =
  cartSlice.actions;
export default cartSlice.reducer;
