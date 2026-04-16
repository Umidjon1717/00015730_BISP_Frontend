import { IProduct } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveStorage } from "@/utils";

interface CompareState {
  value: IProduct[];
}

const compareStore = localStorage.getItem("compare");

const initialState: CompareState = {
  value: compareStore ? JSON.parse(compareStore) : [],
};

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    toggleCompare: (state, action: PayloadAction<IProduct>) => {
      const exists = state.value.some((item) => item.id === action.payload.id);

      if (exists) {
        state.value = state.value.filter((item) => item.id !== action.payload.id);
      } else {
        state.value.push(action.payload);
      }

      saveStorage("compare", state.value);
    },
    removeCompare: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((item) => item.id !== action.payload);
      saveStorage("compare", state.value);
    },
    clearCompare: (state) => {
      state.value = [];
      localStorage.removeItem("compare");
    },
  },
});

export const { toggleCompare, removeCompare, clearCompare } =
  compareSlice.actions;

export default compareSlice.reducer;
