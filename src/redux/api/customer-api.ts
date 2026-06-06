import { ICustomer, ICustomerDataResponse, OtpResponse, ICheckTokenResponse, ISignInResponse } from "@/types";
import { mainApi } from "./index";

const extendedApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createCustomer: build.mutation<unknown, ICustomer>({
      query: (body) => ({
        url: "customer/auth/signup",
        method: "POST",
        body,
      }),
    }),
    checkToken: build.query<ICheckTokenResponse, unknown>({
      query: () => ({
        url: "customer/auth/check-token",
        method: "GET",
      }),
    }),
    createOtp: build.mutation<OtpResponse, { email: string }>({
      query: (body) => ({
        url: "otp",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: build.mutation<OtpResponse, { email: string; otp: string }>({
      query: (body) => ({
        url: "otp/verify-otp",
        method: "POST",
        body,
      }),
    }),
    signIn: build.mutation<ISignInResponse, { email: string; password: string }>({
      query: (body) => ({
        url: "customer/auth/signin",
        method: "POST",
        body,
      }),
    }),
    googleSignIn: build.mutation<ISignInResponse, { idToken: string }>({
      query: (body) => ({
        url: "customer/auth/google",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: build.mutation<unknown, { email: string }>({
      query: (body) => ({
        url: "customer/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: build.mutation<
      unknown,
      {
        email: string;
        otp: string;
        password: string;
        confirm_password: string;
      }
    >({
      query: (body) => ({
        url: "customer/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    getCustomerById: build.query<ICustomerDataResponse, { id: number }>({
      query: ({ id }) => ({
        url: `customer/${id}`,
        method: "GET",
      }),
    }),
    signOut: build.mutation<unknown, unknown>({
      query: () => ({
        url: "customer/auth/signout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useCreateOtpMutation,
  useVerifyOtpMutation,
  useSignInMutation,
  useGoogleSignInMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetCustomerByIdQuery,
  useCheckTokenQuery,
  useSignOutMutation,
} = extendedApi;
