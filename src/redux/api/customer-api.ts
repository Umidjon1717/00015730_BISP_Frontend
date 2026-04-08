import { ICustomer, ICustomerDataResponse, OtpResponse } from "@/types";
import { mainApi } from "./index";

const extendedApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    createCustomer: build.mutation<any, ICustomer>({
      query: (body) => ({
        url: "customer/auth/signup",
        method: "POST",
        body,
      }),
    }),
    checkToken: build.query<any, any>({
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
    signIn: build.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: "customer/auth/signin",
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
    signOut: build.mutation<any, any>({
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
  useGetCustomerByIdQuery,
  useCheckTokenQuery,
  useSignOutMutation,
} = extendedApi;
