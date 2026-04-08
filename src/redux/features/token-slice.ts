import { clearStorage, getStorage, saveStorage } from "@/utils";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TokenState {
  access_token: string;
}

const initialState: TokenState = {
  access_token: getStorage("access_token") || "",
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    saveToken: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload;
      saveStorage("access_token", action.payload);
    },
    clearToken: (state) => {
      state.access_token = "";
      clearStorage("access_token");
    },
  },
});

export const { clearToken, saveToken } = tokenSlice.actions;
export default tokenSlice.reducer;
