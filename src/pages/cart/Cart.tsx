import { RootState } from "@/redux";
import {
  decrementAmountCart,
  ICartProduct,
  incrementAmountCart,
  deleteCart,
} from "@/redux/features/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { IoTrashOutline } from "react-icons/io5";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import empty_cart from "@/assets/images/image.png";
import { getImageBaseUrl } from "@/config/env";
const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart.value);
  const token = useSelector((state: RootState) => state.token.access_token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageBaseUrl = getImageBaseUrl();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const subtotal = cart.reduce((acc, product) => {
    const discountPercent = product?.discount?.percent ?? 0; 
    const discountedPrice = product.price / (1 - discountPercent / 100); 
    return acc + discountedPrice * product.amount;
  }, 0);

  const total = cart.reduce(
    (sum, product) => sum + product.price * product.amount,
    0
  );

  const handleCheckout = () => {
    token ? navigate("/checkout") : navigate("/auth/sign-in?q=checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full">
        <div className="w-full max-w-md flex flex-col items-center px-4 sm:px-0">
          <img
            src={empty_cart}
            alt="Empty Cart"
            className="w-40 h-40 sm:w-48 sm:h-48 object-contain opacity-80"
          />
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-white mt-4 text-center">
            Your cart is empty.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center text-sm sm:text-base">
            Looks like you haven’t added anything yet.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-6 px-4 py-2 sm:px-6 sm:py-3 bg-[#B88E2F] text-white rounded-md shadow-md hover:bg-[#a07424] transition text-sm sm:text-base"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 flex  flex-col lg:flex-row items-start gap-6 dark:bg-zinc-900">
      <div className="w-full lg:w-2/3">
        <div className=" dark:bg-zinc-900 md:p-3 py-0 rounded-t-lg ">
          <table className="w-full table-auto text-left hidden md:table">
            <thead>
              <tr className="font-semibold text-base bg-slate-50 dark:bg-zinc-800">
                <th className="px-4 py-3 text-center">Product</th>
                <th className="px-4 py-3 text-center">Price</th>
                <th className="px-4 py-3 text-center">Quantity</th>
                <th className="px-4 py-3 text-center">Subtotal</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((product: ICartProduct) => (
                  <tr
                    key={product.id}
                    className="border-b dark:hover:bg-zinc-900 transition"
                  >
                    <td className="px-3 py-4 flex items-center gap-3">
                      <img
                        src={
                          imageBaseUrl + product.images[0]
                        }
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <p className="font-semibold text-base text-black dark:text-white">
                        {product.name}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-center text-black dark:text-white">
                      Rs.{product.price.toFixed(2)}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <div className="flex items-center justify-between shadow-sm py-2 px-2 rounded-md">
                        <button
                          disabled={product.amount <= 1}
                          onClick={() =>
                            dispatch(decrementAmountCart(product.id))
                          }
                          className="text-[18px] px-3 py-2 rounded-md transition-all duration-300 
                            bg-gray-200 dark:bg-zinc-700 dark:text-white text-gray-700 
                            hover:bg-gray-300 dark:hover:bg-zinc-600 
                              disabled:opacity-50 "
                        >
                          −
                        </button>
                        <span
                          className="text-[18px] select-none font-semibold text-center 
                          bg-white dark:bg-zinc-900 dark:text-white 
                          px-3 py-2"
                        >
                          {product.amount}
                        </span>
                        <button
                          disabled={product.stock <= product.amount}
                          onClick={() =>
                            dispatch(incrementAmountCart(product.id))
                          }
                          className="text-[18px] px-3 py-2 rounded-lg transition-all duration-300 
                                  bg-gray-200 dark:bg-zinc-700 dark:text-white text-gray-700 
                                  hover:bg-gray-300 dark:hover:bg-zinc-600 
                                  disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center text-black dark:text-white">
                      Rs.{(product.price * product.amount).toFixed(2)}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <button
                        onClick={() => dispatch(deleteCart(product.id))}
                        className="bg-[#B88E2F] text-white p-2 rounded-md hover:bg-[#a07424] transition"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-gray-500 text-lg text-center py-3 dark:text-white"
                  >
                    Your cart is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="md:hidden md:p-4 py-4 sm:p-0">
            {cart.length > 0 ? (
              cart.map((product: ICartProduct) => (
                <div
                  key={product.id}
                  className="border border-[#F9F1E7] dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900 shadow-sm rounded-xl mb-4 flex flex-col gap-4 transition-transform max-sm:gap-1.5"
                >
                  <div className="flex gap-6 items-center">
                    <img
                      src={
                        imageBaseUrl + product.images[0]
                      }
                      alt={product.name}
                      className="w-28 h-28 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-xl text-black dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Rs. {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Quantity:
                    </p>
                    <div className="flex items-center dark:bg-zinc-800 px-3 py-2 rounded-md shadow-sm">
                      <button
                        disabled={product.amount <= 1}
                        onClick={() =>
                          dispatch(decrementAmountCart(product.id))
                        }
                        className="text-xl px-3 py-1 rounded-md bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 disabled:opacity-50 transition"
                      >
                        −
                      </button>
                      <span className="text-lg font-semibold text-center w-8 dark:text-white">
                        {product.amount}
                      </span>
                      <button
                        disabled={product.stock <= product.amount}
                        onClick={() =>
                          dispatch(incrementAmountCart(product.id))
                        }
                        className="text-xl px-3 py-1 rounded-lg bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 disabled:opacity-50 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between ">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Subtotal:
                    </p>
                    <p className="text-lg font-semibold text-black dark:text-white">
                      Rs. {(product.price * product.amount).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => dispatch(deleteCart(product.id))}
                      className="bg-[#B88E2F] text-white px-4 py-2 flex items-center gap-2 rounded-md hover:bg-red-600 transition shadow-md"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-lg text-center py-5 dark:text-white">
                Your cart is empty.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:sticky lg:top-[90px] lg:w-1/3  dark:bg-zinc-800 p-4 rounded-md shadow-md max-sm:py-6">
        <h3 className="text-2xl font-bold mb-10 max-sm:mb-6 text-center text-black dark:text-white">
          Cart Totals
        </h3>

        <div className="flex justify-between mb-6 max-sm:mb-4">
          <p className="text-lg font-bold text-black dark:text-white ">
            Original Price:
          </p>
          <p className="text-lg text-[#9F9F9F] dark:text-[#B88E2F]">
            Rs.{subtotal.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between mb-6 max-sm:mb-4">
          <p className="text-lg font-bold text-black dark:text-white">
            Discounted Price (Total):
          </p>
          <p className="text-lg text-[#B88E2F] dark:text-[#FFD700]">
            Rs.{total.toFixed(2)}
          </p>
        </div>

        <div
          onClick={handleCheckout}
          className="flex justify-center pt-10 max-sm:pt-4"
        >
          <button
            className="w-full py-3 text-lg font-semibold transition-all duration-300 border rounded-lg shadow-md text-white bg-bg-primary hover:opacity-85 active:scale-95 
           dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:text-gray-200 max-sm:text-[16px] max-sm:py-2"
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
