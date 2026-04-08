import { REGIONS } from "@/static";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCheckTokenQuery } from "@/redux/api/customer-api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import { useCreateOrderMutation } from "@/redux/api/order-api";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { clearCart } from "@/redux/features/cart-slice";
// import { useGetAddressQuery } from "@/redux/api/order-address-api";

const schema = yup
  .object({
    street: yup.string().required("Street is required"),
    region: yup.string().required("Region is required"),
    zip_code: yup
      .number()
      .required("Zip code is required")
      .typeError("Zip code must be a number"),
    district: yup.string().required("District is required"),
    additional_info: yup.string().optional(),
  })
  .required();

const Checkout = () => {
  const dispatch = useDispatch();
  const { data } = useCheckTokenQuery(null);
  const cart = useSelector((state: RootState) => state.cart.value);
  const token = useSelector((state: RootState) => state.token.access_token);
  // const { data: orderAddressData } = useGetAddressQuery(data?.customer?.id);
  // console.log(orderAddressData);
  
  const [createOrder] = useCreateOrderMutation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      district: "",
      region: "",
      street: "",
      additional_info: "",
    },
  });

  const onSubmit: SubmitHandler<any> = (address) => {
    const total_price = cart?.reduce(
      (sum, product) => sum + product.price * product.amount,
      0
    );
    let order = {
      customerId: data?.customer?.id,
      address,
      order_details: cart?.map((product) => ({
        productId: product.id,
        quantity: product.amount,
      })),
      total_price,
    };

    createOrder(order)
      .unwrap()
      .then(() => {
        navigate("/auth/profile/order");
        setTimeout(() => {
          dispatch(clearCart());
          reset();
        }, 250);
      })
      .catch((e) => console.log(e));
  };

  if (!token || cart.length === 0) {
    return <Navigate replace to="/cart" />;
  }

  return (
    <div className="container max-w-2xl mx-auto mt-10 p-4 dark:bg-gray-800 dark:text-white rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center">Checkout</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <select
            className={`w-full p-3 border ${
              errors.region ? "border-red-500" : "border-gray-300"
            } rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white`}
            {...register("region")}
            onFocus={() => setFocus("region")}
          >
            <option value="" disabled>
              Choose region
            </option>
            {REGIONS?.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>
          )}
        </div>

        <div>
          <input
            className={`w-full p-3 border ${
              errors.district ? "border-red-500" : "border-gray-300"
            } rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white`}
            {...register("district")}
            type="text"
            placeholder="District"
            onFocus={() => setFocus("district")}
          />
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">
              {errors.district.message}
            </p>
          )}
        </div>

        <div>
          <input
            className={`w-full p-3 border ${
              errors.street ? "border-red-500" : "border-gray-300"
            } rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white`}
            {...register("street")}
            type="text"
            placeholder="Street"
            onFocus={() => setFocus("street")}
          />
          {errors.street && (
            <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
          )}
        </div>

        <div>
          <input
            className={`w-full p-3 border ${
              errors.zip_code ? "border-red-500" : "border-gray-300"
            } rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white`}
            {...register("zip_code")}
            type="number"
            placeholder="Zip Code"
            onFocus={() => setFocus("zip_code")}
          />
          {errors.zip_code && (
            <p className="text-red-500 text-sm mt-1">
              {errors.zip_code.message}
            </p>
          )}
        </div>

        <div>
          <input
            className={`w-full p-3 border ${
              errors.additional_info ? "border-red-500" : "border-gray-300"
            } rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white`}
            {...register("additional_info")}
            type="text"
            placeholder="Additional info"
            onFocus={() => setFocus("additional_info")}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
