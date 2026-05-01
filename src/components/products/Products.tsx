import { FC, memo, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IProduct } from "../../types";
import Heart from "./Heart";
import Discount from "./Discount";
import CartButton from "./CartButton";
import { resolveImageUrl } from "@/config/env";
import { useDispatch, useSelector } from "react-redux";
import { toggleCompare } from "@/redux/features/compare-slice";
import { RootState } from "@/redux";
import toast from "react-hot-toast";
import { LuGitCompareArrows } from "react-icons/lu";

interface IProductProps {
  data: IProduct[];
  title?: ReactNode;
  grid?: boolean;
}
const Products: FC<IProductProps> = ({ data, title, grid }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const compareItems = useSelector((state: RootState) => state.compare.value);

  const handleCompareToggle = (product: IProduct) => {
    const exists = compareItems.some((item) => item.id === product.id);
    dispatch(toggleCompare(product));

    toast.success(
      exists ? "Product removed from compare list" : "Product added to compare list",
      {
        position: "top-right",
      }
    );

    if (!exists && compareItems.length >= 1) {
      navigate("/compare");
    }
  };

  const productItems = data?.map((product: IProduct) => (
    <div
      key={product.id}
      className="relative overflow-hidden group rounded-lg shadow bg-white dark:bg-zinc-800"
    >
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className={`relative w-full overflow-hidden cursor-pointer transition-all duration-300 ${
          grid || !pathname.startsWith("/shop")
            ? "h-[301px] max-[620px]:h-[240px] max-[450px]:h-[180px]"
            : "h-[500px] max-[620px]:h-[400px] max-[450px]:h-[300px]"
        } `}
      >
        <img
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-300"
          src={resolveImageUrl(product.images?.[0])}
          alt={product.name}
        />
      </div>


      <div className="absolute top-2 flex flex-col gap-2 max-sm:gap-1 right-[-50px] group-hover:right-2 duration-300 max-md:right-2">
        <Heart product={product} />
        <CartButton product={product} />
        <button
          onClick={() => handleCompareToggle(product)}
          aria-label={
            compareItems.some((item) => item.id === product.id)
              ? "Remove from compare"
              : "Add to compare"
          }
          className={`grid h-10 w-10 place-items-center rounded-full border transition-colors duration-200 ${
            compareItems.some((item) => item.id === product.id)
              ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
              : "border-gray-300 bg-white/90 text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-gray-200 dark:hover:border-white dark:hover:bg-white dark:hover:text-zinc-900"
          }`}
        >
          <LuGitCompareArrows className="h-5 w-5" />
        </button>
      </div>

      {!!product.discount?.percent && (
        <Discount percent={Number(product.discount?.percent)} />
      )}

      <div className="dark:bg-zinc-800 transition-colors duration-300 p-4 max-[500px]:p-3">
        <div className="space-y-3">
          <h2 className="line-clamp-1 text-[20px] font-semibold leading-8 max-[620px]:text-lg">
            {product.name}
          </h2>
          <p className="line-clamp-1 text-gray-500 dark:text-gray-300 text-sm">
            {product.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
            <strong className="text-gray-900 max-sm:text-[14px] dark:text-white text-lg font-semibold">
              {product.price.toLocaleString()} USD
            </strong>
            {!!product.discount?.percent && (
              <s className="text-gray-400 max-sm:text-[12px]">
                {(
                  product.price /
                  (1 - Number(product.discount?.percent / 100))
                ).toLocaleString()}{" "}
                USD
              </s>
            )}
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="container my-10 max-[620px]:my-4">
      <h2 className="font-poppins-bold text-[38px] max-sm:text-[25px] mb-8 text-center max-[620px]:text-2xl">
        {title ? title : ""}
      </h2>
      <div
        className={`grid gap-8 ${
          grid || !pathname.startsWith("/shop")
            ? "grid-cols-4  max-[1240px]:grid-cols-3 max-[990px]:grid-cols-2 max-[620px]:gap-2"
            : "max-w-[600px] mx-auto"
        } `}
      >
        {productItems}
      </div>
    </div>
  );
};

export default memo(Products);
