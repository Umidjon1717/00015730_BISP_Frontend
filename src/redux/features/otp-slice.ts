import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface OTPState {
  email: string;
}

const initialState: OTPState = {
  email: sessionStorage.getItem("otp_email") || "",
};

export const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    saveEmail: (state, action: PayloadAction<{ email: string }>) => {
      state.email = action.payload.email;
      sessionStorage.setItem("otp_email", action.payload.email);
    },
    clearOtp: (state) => {
      state.email = "";
      sessionStorage.removeItem("otp_email");
    },
  },
});

export const { saveEmail, clearOtp } = otpSlice.actions;
export default otpSlice.reducer;
