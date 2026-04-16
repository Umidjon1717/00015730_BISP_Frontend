import { yupResolver } from "@hookform/resolvers/yup";
import { useForgotPasswordMutation } from "@/redux/api/customer-api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
});

interface IForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [requestError, setRequestError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordForm>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: IForgotPasswordForm) => {
    forgotPassword({ email: data.email })
      .unwrap()
      .then(() => {
        setRequestError("");
        toast.success("Reset code sent to your email.", {
          position: "top-right",
        });
        navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
      })
      .catch((err) => {
        const errorMessage = err?.data?.message;
        if (typeof errorMessage === "string") {
          setRequestError(errorMessage);
        } else if (Array.isArray(errorMessage)) {
          setRequestError(errorMessage[0]);
        } else {
          setRequestError("Unable to send reset code. Please try again.");
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <Link to="/auth/sign-in" className="absolute top-6 left-6 text-xl">
        <FaArrowLeft />
      </Link>

      <div className="max-w-md w-full bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6 text-center">
          Enter your email and we will send you a 4-digit code to reset your
          password.
        </p>

        {requestError && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {requestError}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-bg-primary text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70"
          >
            {isLoading ? "Sending..." : "Send reset code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
