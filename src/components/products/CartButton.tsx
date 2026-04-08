import { addCart } from "@/redux/features/cart-slice";
import { IProduct } from "@/types";
import React from "react";
import { IoCart, IoCartOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";

const CartButton = ({ product }: { product: IProduct }) => {
  const dispatch = useDispatch();
  const cartData = useSelector((state: RootState) => state.cart.value);

  return (
    <button
      onClick={() => dispatch(addCart(product))}

      className="w-[40px] h-[40px] max-sm:h-[35px] max-sm:w-[35px] max-sm:text-lg rounded-full bg-white dark:bg-zinc-700 shadow-md flex items-center justify-center text-[22px] 
    transition-all duration-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
    >
      {cartData?.some((cart) => cart.id === product.id) ? (
        <IoCart />
      ) : (
        <IoCartOutline />
      )}
    </button>
  );
};

export default React.memo(CartButton);
