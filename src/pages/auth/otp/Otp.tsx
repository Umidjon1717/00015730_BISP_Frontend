import * as React from "react";
import { Box } from "@mui/system";
import { CircularProgress, Typography } from "@mui/material";
import {
  useCreateOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/api/customer-api";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import { saveToken } from "@/redux/features/token-slice";
import Timer from "./Timer";
import { clearOtp } from "@/redux/features/otp-slice";
import OTP from "./OtpElement";
import { useSetWishlistMutation } from "@/redux/api/wishlist-api";
import { clearWishlist } from "@/redux/features/wishlist-slice";
import { useParamsHook } from "../../../hooks/useParamsHook";

export default function OTPInput() {
  const { email } = useSelector((state: RootState) => state.otp);
  const dispatch = useDispatch();
  const { getParam } = useParamsHook();

  const wishlist = useSelector((state: RootState) => state.wishlist.value);
  const [setWishlist] = useSetWishlistMutation();

  const [otp, setOtp] = React.useState("");
  const [reload, setReload] = React.useState(true);
  const [verifyOtp, { isLoading, isError, isSuccess }] = useVerifyOtpMutation();
  const [
    createOtp,
    { isLoading: otpLoading, isError: otpError, isSuccess: otpSuccess, error },
  ] = useCreateOtpMutation();
  const navigate = useNavigate();

  const createNewOtp = () => {
    createOtp({ email: email });
    setReload(!reload);
  };

  React.useEffect(() => {
    createOtp({ email: email });
    return () => {
      dispatch(clearOtp());
    };
  }, []);

  React.useEffect(() => {
    if (otp.length >= 4) {
      verifyOtp({
        email,
        otp,
      })
        .unwrap()
        .then((res) => {
          setTimeout(() => {
            dispatch(clearOtp());
          }, 300);
          dispatch(saveToken(res.access_token));
          if (wishlist.length) {
            setWishlist({
              customerId: res?.id,
              wishlist: wishlist.map((item) => item.id),
            })
              .unwrap()
              .then(() => {
                dispatch(clearWishlist());
              });
          }
          getParam("q") === "checkout"
            ? navigate("/checkout")
            : navigate("/auth/profile/self");
        });
    }
  }, [otp]);

  return !email ? (
    <Navigate replace to={"/auth/sign-in"} />
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        justifyContent: "center",
        gap: 2,
        padding: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          boxShadow: "0px 0px 10px #0002",
          borderRadius: "10px",
          py: "50px",
          maxWidth: "600px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingX: { xs: 2, sm: 4 }, // Responsive padding for mobile screens
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: "10px", fontSize: { xs: "20px", sm: "24px" } }}
        >
          Enter verification code
        </Typography>
        {(error as any)?.status === 401 ? (
          <p className="text-red-500 mb-6 text-center">
            Your email is not correct. Please check again ({email})
          </p>
        ) : (
          <p className="text-gray-500 mb-6 text-center">
            Your code was sent to your email ({email})
          </p>
        )}
        <OTP
          error={isError}
          success={isSuccess}
          loading={isLoading || otpLoading || otpError}
          separator={<span></span>}
          value={otp}
          onChange={setOtp}
          length={4}
        />
        {(error as any)?.status === 401 && (
          <Link to="/auth/sign-in" className="mt-6 text-indigo-500">
            Go back
          </Link>
        )}
        {otpLoading && (
          <div className="mt-6">
            <CircularProgress sx={{ color: "#999" }} size={30} />
          </div>
        )}
        {otpSuccess && (
          <Timer
            reload={reload}
            callback={createNewOtp}
            time={180}
            className="mt-6 text-gray-500"
          />
        )}
      </Box>
    </Box>
  );
}
