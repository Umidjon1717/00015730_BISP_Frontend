import { yupResolver } from "@hookform/resolvers/yup";
import { useResetPasswordMutation } from "@/redux/api/customer-api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  otp: yup
    .string()
    .required("OTP is required.")
    .matches(/^\d{4}$/, "OTP must be a 4-digit code."),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters.")
    .required("Password is required."),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match.")
    .required("Please confirm your password."),
});

interface IResetPasswordForm {
  email: string;
  otp: string;
  password: string;
  confirm_password: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const emailFromQuery = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IResetPasswordForm>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: emailFromQuery,
      otp: "",
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    setValue("email", emailFromQuery);
  }, [emailFromQuery, setValue]);

  const onSubmit = (data: IResetPasswordForm) => {
    resetPassword(data)
      .unwrap()
      .then(() => {
        setResetError("");
        toast.success("Password updated successfully.", {
          position: "top-right",
        });
        navigate("/auth/sign-in");
      })
      .catch((err) => {
        const errorMessage = err?.data?.message;
        if (typeof errorMessage === "string") {
          setResetError(errorMessage);
        } else if (Array.isArray(errorMessage)) {
          setResetError(errorMessage[0]);
        } else {
          setResetError("Unable to reset password. Please try again.");
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <Link
        to={emailFromQuery ? `/forgot-password` : "/auth/sign-in"}
        className="absolute top-6 left-6 text-xl"
      >
        <FaArrowLeft />
      </Link>

      <div className="max-w-md w-full bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6 text-center">
          We sent a 4-digit code to your email. Enter it below with your new
          password.
        </p>

        {resetError && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {resetError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className={`w-full px-4 py-2 border ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 dark:bg-gray-700 dark:text-white`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              OTP
            </label>
            <input
              {...register("otp")}
              type="text"
              inputMode="numeric"
              maxLength={4}
              className={`w-full px-4 py-2 border ${
                errors.otp
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 dark:bg-gray-700 dark:text-white`}
              placeholder="1234"
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-2 border ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 dark:bg-gray-700 dark:text-white`}
                placeholder="••••••••"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xl absolute top-[50%] right-4 cursor-pointer -translate-y-1/2 text-gray-500 dark:text-gray-300"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm password
            </label>
            <div className="relative">
              <input
                {...register("confirm_password")}
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full px-4 py-2 border ${
                  errors.confirm_password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 dark:bg-gray-700 dark:text-white`}
                placeholder="••••••••"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-xl absolute top-[50%] right-4 cursor-pointer -translate-y-1/2 text-gray-500 dark:text-gray-300"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {errors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-bg-primary text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70"
          >
            {isLoading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
