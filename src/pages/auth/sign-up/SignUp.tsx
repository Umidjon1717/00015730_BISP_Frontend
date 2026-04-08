import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ICustomer } from "@/types";
import { useCreateCustomerMutation } from "@/redux/api/customer-api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveEmail } from "@/redux/features/otp-slice";
import { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

const schema = yup
  .object({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    confirm_password: yup.string().required(),
    phone_number: yup.string().required(),
  })
  .required();

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createCustomer, { isLoading }] = useCreateCustomerMutation();
  const [rgError, setrgError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: ICustomer) => {
    createCustomer(data)
      .unwrap()
      .then(() => {
        dispatch(
          saveEmail({
            email: data.email,
          })
        );
        setrgError("");
        return navigate("/auth/otp");
      })
      .catch((err) => {
        const errorMessage = err?.data?.message;
        if (typeof errorMessage === "string") {
          setrgError(errorMessage);
        } else if (Array.isArray(errorMessage)) {
          setrgError(errorMessage[0]);
        } else {
          setrgError("An unknown error occurred.");
        }
      });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center p-4 mx-auto min-h-screen lg:py-0 relative">
        <Link to={"/"} className="absolute top-6 left-6 text-xl">
          <FaArrowLeft />
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-[800px] xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign up
            </h1>
            {rgError && (
              <div className="text-red-500 text-sm mb-4 text-center">
                {rgError}
              </div>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-1 md:space-y-2"
              action="#"
            >
              <div className="grid  sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First name
                  </label>
                  <input
                    {...register("first_name")}
                    type="text"
                    name="first_name"
                    id="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="First name"
                  />
                  {errors.first_name?.message && (
                    <p className="text-red-500 text-sm">
                      {errors.first_name?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last name
                  </label>
                  <input
                    {...register("last_name")}
                    type="text"
                    name="last_name"
                    id="last_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Last name"
                  />
                  {errors.last_name?.message && (
                    <p className="text-red-500 text-sm">
                      {errors.last_name?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Email"
                  />
                  {errors.email?.message && (
                    <p className="text-red-500 text-sm">
                      {errors.email?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone_number"
                    className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone number
                  </label>
                  <input
                    {...register("phone_number")}
                    type="text"
                    name="phone_number"
                    id="phone_number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Phone number"
                  />
                  {errors.phone_number?.message && (
                    <p className="text-red-500 text-sm">
                      {errors.phone_number?.message}
                    </p>
                  )}
                </div>
                <div className=" relative">
                  <label
                    htmlFor="password"
                    className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    {...register("password")}
                    autoComplete="off"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Password"
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="text-xl absolute top-[50%] right-4 cursor-pointer text-gray-500 dark:text-gray-300"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                  {errors.password?.message && (
                    <p className="text-red-500 text-sm">
                      {errors.password?.message}
                    </p>
                  )}
                </div>
                <div className=" relative">
                  <label
                    htmlFor="confirm_password"
                    className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    {...register("confirm_password")}
                    autoComplete="off"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    id="confirm_password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Confirm password"
                  />
                  <span
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-xl absolute top-[50%] right-4 cursor-pointer text-gray-500 dark:text-gray-300"
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                  {errors.confirm_password?.message && (
                    <p className="text-red-500 text-sm">
                      {errors.confirm_password?.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  disabled={isLoading}
                  className="p-2.5 mt-2 bg-bg-primary w-full text-white rounded-lg disabled:opacity-70"
                >
                  {isLoading ? "Loading..." : "Sign up"}
                </button>
              </div>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center mt-2">
                Already have an account?{" "}
                <Link
                  to={"/auth/sign-in"}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
