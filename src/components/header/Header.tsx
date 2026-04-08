import { FC, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { links } from "../../static";
import logo from "/logo.svg";
import {
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FiSearch, FiShoppingBag } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import useOnlineonline from "@/hooks/useOnlineStatus";
import "./Header.scss";
import HeaderSearch from "./HeaderSearch";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import Switch from "./Switcher";
import { useCheckTokenQuery } from "../../redux/api/customer-api";
import { useGetWishlistQuery } from "../../redux/api/wishlist-api";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const Header: FC = () => {
  const token = useSelector((state: RootState) => state.token.access_token);
  const { online, firstEnter } = useOnlineonline();
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { data, isSuccess } = useCheckTokenQuery(null, {
    skip: Boolean(!token),
  });

  const wishlist = useSelector((state: RootState) => state.wishlist.value);
  const cart = useSelector((state: RootState) => state.cart.value);

  const { data: wishlistData } = useGetWishlistQuery(
    Number(data?.customer?.id),
    { skip: Boolean(!data) }
  );

  const totalWishlist = wishlistData
    ? wishlistData?.data?.products?.length
    : wishlist?.length
    ? wishlist?.length
    : 0;

  const cartTotal = cart?.length || 0;

  const handleClear = () => {
    setMenuOpen(false);
  };
  const ref = useOutsideClick(handleClear);

  const navigate = useNavigate();
  return (
    <div
      className={`bg-white dark:bg-zinc-950 w-full shadow-sm sticky left-0 z-50 transition-colors duration-300 ${
        !online && firstEnter ? "top-6" : "top-0"
      } ${online && firstEnter ? "header-animete" : ""}`}
    >
      <div
        id="header"
        className="container relative mx-auto h-20 flex justify-between items-center font-poppins max-[725px]:h-14 max-[767px]:h-16"
      >
        <div
          onClick={() => navigate("/")}
          className="flex items-center hover:opacity-70 duration-200"
        >
          <img
            src={logo}
            alt="logo.svg"
            className="h-14 w-14 cursor-pointer max-[767px]:h-10 max-[767px]:w-10"
          />
          <h2 className="ml-1 text-[30px] font-montserrat font-semibold cursor-pointer max-[767px]:text-[24px]">
            Furnishings
          </h2>
        </div>
        <div className="flex items-center gap-12 max-[986px]:hidden">
          {links?.map((link) => (
            <NavLink
              to={link.href}
              key={link.href}
              className="text-center font-medium text-lg hover:text-bg-primary duration-200"
            >
              {link.title}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center justify-between py-3 min-[987px]:gap-6 gap-1">
          <div>
            <Switch />
          </div>

          <FiSearch
            className="h-6 w-6 cursor-pointer hover:text-bg-primary duration-200 max-[986px]:hidden"
            onClick={() => setSearchOpen(true)}
          />
          <NavLink to={"/wishlist"} className="relative ">
            <AiOutlineHeart className="h-6 w-6 hover:text-bg-primary duration-200 max-[986px]:hidden" />
            {!!totalWishlist && (
              <span className="absolute max-[986px]:hidden top-[-5px] right-[-5px] bg-bg-primary  w-4 rounded-full text-white flex items-center justify-center text-[12px] h-4">
                {totalWishlist}
              </span>
            )}
          </NavLink>
          <NavLink to={"/cart"} className={"relative"}>
            {!!cartTotal && (
              <span className="absolute max-[986px]:hidden top-[-5px] right-[-5px] bg-bg-primary  w-4 rounded-full text-white flex items-center justify-center text-[12px] h-4">
                {cartTotal}
              </span>
            )}
            <AiOutlineShoppingCart className="h-6 w-6 hover:text-bg-primary duration-200 max-[986px]:hidden" />
          </NavLink>
          <NavLink to={token ? "/auth/profile/self" : "/auth/sign-in"}>
            {isSuccess ? (
              <div className="w-8 h-8 bg-bg-primary max-[986px]:hidden rounded-full flex items-center justify-center text-white uppercase">
                {data?.customer?.first_name?.trim()?.slice(0, 1)}
              </div>
            ) : (
              <LuUser className="h-6 w-6 hover:text-bg-primary duration-200 max-[986px]:hidden" />
            )}
          </NavLink>
          <MdMenu
            className="h-6 w-6 min-[987px]:hidden hover:text-bg-primary duration-200 cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          />
        </div>
      </div>
      <HeaderSearch setSearchOpen={setSearchOpen} searchOpen={searchOpen} />
      <div
        ref={ref}
        className={`absolute w-full bg-white dark:bg-black shadow-md z-50 transition-all duration-500 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col justify-center items-center py-4 gap-4">
          <div className="w-full border-b grid place-items-center pb-3">
            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-medium hover:text-bg-primary duration-200"
            >
              About
            </NavLink>
          </div>
          <div className="w-full border-b grid place-items-center pb-3">
            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-medium hover:text-bg-primary duration-200"
            >
              Contact
            </NavLink>
          </div>
          <div className="w-full grid place-items-center">
            <NavLink
              to={token ? "/auth/profile/self" : "/auth/sign-in"}
              onClick={() => setMenuOpen(false)}
              className="text-lg font-medium hover:text-bg-primary duration-200"
            >
              Profile
            </NavLink>
          </div>
        </div>
      </div>
      <div id="header" className="max-[986px]:block hidden font-poppins-light">
        <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-black opacity-95 py-2 flex items-center justify-evenly z-50 max-[725px]:h-14 max-[767px]:h-16">
          <NavLink to={"/"}>
            <div className="flex flex-col items-center hover:text-bg-primary duration-200">
              <AiOutlineHome className="h-5 w-5" />
              <p className="text-xs">Home</p>
            </div>
          </NavLink>
          <NavLink to={"/shop"}>
            <div className="flex flex-col items-center hover:text-bg-primary duration-200">
              <FiShoppingBag className="h-5 w-5" />
              <p className="text-xs">Shop</p>
            </div>
          </NavLink>
          <NavLink to={"/wishlist"} className={"relative"}>
            <div className="flex flex-col items-center hover:text-bg-primary duration-200">
              <AiOutlineHeart className="h-5 w-5" />
              {!!totalWishlist && (
                <span className="absolute top-[-5px] right-[4px] bg-bg-primary  w-4 rounded-full text-white flex items-center justify-center text-[12px] h-4">
                  {totalWishlist}
                </span>
              )}
              <p className="text-xs">Wishlist</p>
            </div>
          </NavLink>
          <NavLink to={"/cart"} className={"relative"}>
            <div className="flex flex-col items-center hover:text-bg-primary duration-200">
              {!!cartTotal && (
                <span className="absolute top-[-5px] right-[-5px] bg-bg-primary  w-4 rounded-full text-white flex items-center justify-center text-[12px] h-4">
                  {cartTotal}
                </span>
              )}
              <AiOutlineShoppingCart className="h-5 w-5" />
              <p className="text-xs">Cart</p>
            </div>
          </NavLink>
          <div className="flex  cursor-pointer flex-col justify-center items-center hover:text-bg-primary duration-200">
            <FiSearch
              className="h-5 w-5"
              onClick={() => {
                setSearchOpen(true);
              }}
            />
            <p className="text-xs"> Search</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
