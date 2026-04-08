import { useOutsideClick } from "@/hooks/useOutsideClick";
import React, { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo.svg";
import { useGetProductsQuery } from "@/redux/api/product-api";
import { IProduct } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import Switcher from "./Switcher";
import { getImageBaseUrl } from "@/config/env";

const HeaderSearch: FC<{ searchOpen: boolean; setSearchOpen: any }> = ({
  setSearchOpen,
  searchOpen,
}) => {
  const navigate = useNavigate();
  const imageBaseUrl = getImageBaseUrl();

  const [value, setValue] = useState<string>("");
  const handleClear = () => {
    setSearchOpen(false);
  };
  const ref = useOutsideClick(handleClear);
  const debouncedValue = useDebounce(value.trim());
  const { data, isSuccess, isFetching } = useGetProductsQuery(
    { limit: 10, filter: debouncedValue },
    { skip: !debouncedValue }
  );
  const handlClose = () => {
    setSearchOpen(false);
    setValue("");
  };

  return (
    <div
      ref={ref}
      className={`absolute  top-0 bg-white dark:bg-zinc-950 p-6 flex flex-col items-center gap-4 shadow-lg min-h-[250px] rounded-b-3xl w-full transition-all duration-500 ${
        searchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={() => {
          navigate("/"), setSearchOpen(false);
        }}
        className="absolute left-5 top-5 flex hover:opacity-70 duration-300 max-[1300px]:hidden"
      >
        <img src={logo} alt="logo.svg" />
        <h2 className="ml-1 text-[30px] font-montserrat font-semibold cursor-pointer">
          Furnishings
        </h2>
      </div>
      <div className="flex items-center w-full max-w-2xl">
        <input
          type="text"
          placeholder="Search for products"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-3 border rounded-l-lg outline-none text-gray-700 dark:bg-zinc-800 dark:border-zinc-500 dark:text-zinc-200 text-sm duration-200 border-r-0"
        />
        <button
          onClick={() => setSearchOpen(false)}
          className="p-3 text-[14.5px] bg-bg-primary text-white rounded-r-lg hover:bg-amber-600 transition duration-300"
        >
          Cancel
        </button>
      </div>
      <div className="absolute right-5 top-5 flex hover:opacity-70 duration-300 max-[1300px]:hidden">
        <Switcher />
      </div>
      {
        // qidirilgan productslar
        !isFetching && value.trim() && isSuccess && (
          <div className=" max-w-2xl w-full flex flex-col gap-1">
            {data?.data?.products?.map((product: IProduct) => (
              <Link
                key={product.id}
                onClick={handlClose}
                className="flex items-center gap-3 border-b p-1 hover:bg-slate-100 last:border-b-0"
                to={`/product/${product.id}`}
              >
                <img
                  src={imageBaseUrl + product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 object-contain"
                />
                <span>{product.name}</span>
              </Link>
            ))}
          </div>
        )
      }
      {
        // taklif qilinyotgan keylar
        !value.trim() && (
          <div className="flex flex-wrap gap-3 max-w-2xl justify-center">
            {[
              "Sofa",
              "Table",
              "Chair",
              "Bed Frame",
              "Bookshelf",
              "Coffee Table",
              "Wardrobe",
              "Armchair",
            ].map((term) => (
              <span
                key={term}
                onClick={() => setValue(term)}
                className="px-4 py-2 bg-gray-100 dark:bg-zinc-500 dark:text-zinc-100 dark:shadow-zinc-100 rounded-full text-gray-600 cursor-pointer hover:bg-gray-200 hover:shadow-md transition duration-300"
              >
                {term}
              </span>
            ))}
          </div>
        )
      }
      {
        // loading
        isFetching && (
          <div className="flex justify-center items-center min-h-[250px] w-full">
            <div className="loader"></div>
          </div>
        )
      }
      {
        // not found
        !data?.data?.total && isSuccess && value.trim() && !isFetching && (
          <div>
            <p className="text-red-500">Product not found</p>
          </div>
        )
      }
    </div>
  );
};

export default React.memo(HeaderSearch);
