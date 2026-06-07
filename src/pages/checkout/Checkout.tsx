import { REGIONS } from "@/static";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCheckTokenQuery } from "@/redux/api/customer-api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { useCreateOrderMutation } from "@/redux/api/order-api";
import { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import MapPicker, { PickedLocation } from "@/components/MapPicker";
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

interface CheckoutFormData {
  street: string;
  region: string;
  zip_code: number;
  district: string;
  additional_info?: string;
}

const Checkout = () => {
  const [submitted, setSubmitted] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<PickedLocation | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
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
    setValue,
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

  const handleLocationPick = (loc: PickedLocation) => {
    setPickedLocation(loc);
    if (loc.street)   setValue('street', loc.street, { shouldValidate: true });
    if (loc.district) setValue('district', loc.district, { shouldValidate: true });
    if (loc.region && REGIONS.includes(loc.region))
      setValue('region', loc.region, { shouldValidate: true });
    // scroll form into view after pin drop
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
  };

  const onSubmit: SubmitHandler<CheckoutFormData> = (address) => {
    const total_price = cart?.reduce(
      (sum, product) => sum + product.price * product.amount,
      0
    );
    const order = {
      customerId: data?.customer?.id,
      address: {
        ...address,
        ...(pickedLocation
          ? { latitude: pickedLocation.lat, longitude: pickedLocation.lng }
          : {}),
      },
      order_details: cart?.map((product) => ({
        productId: product.id,
        quantity: product.amount,
      })),
      total_price,
    };

    createOrder(order)
      .unwrap()
      .then((res: any) => {
        const orderId = res?.data?.result?.order?.id
        const amount = res?.data?.result?.order?.total_price ?? total_price
        setSubmitted(true);
        reset();
        navigate(`/checkout/payment?orderId=${orderId}&amount=${amount}`)
      })
      .catch((e) => console.log(e));
  };

  if (!submitted && (!token || cart.length === 0)) {
    return <Navigate replace to="/cart" />;
  }

  return (
    <div className="container max-w-2xl mx-auto mt-10 p-4 dark:bg-gray-800 dark:text-white rounded-lg">
      <h2 className="text-3xl font-semibold mb-2 text-center">Checkout</h2>
      <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
        Pin your delivery location on the map, then confirm the details below.
      </p>

      {/* Map picker */}
      <div className="mb-6">
        <MapPicker onSelect={handleLocationPick} />
        {pickedLocation && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
            📍 Location saved ({pickedLocation.lat.toFixed(5)}, {pickedLocation.lng.toFixed(5)})
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-600" />
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
          Confirm delivery details
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-600" />
      </div>

      <div ref={formRef}>
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
    </div>
  );
};

export default Checkout;
