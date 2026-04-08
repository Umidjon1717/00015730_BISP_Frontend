import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useGetWishlistQuery } from "../../redux/api/wishlist-api";
import Products from "../../components/products/Products";
import { useEffect } from "react";
import { useCheckTokenQuery } from "@/redux/api/customer-api";
import EmptyWishlist from "./EmptyWishlist";

const Wishlist = () => {
  const wishlist = useSelector((state: RootState) => state.wishlist.value);
  const token = useSelector((state: RootState) => state.token.access_token);
  const { data: tokenData } = useCheckTokenQuery(null, {
    skip: Boolean(!token),
  });
  const { data } = useGetWishlistQuery(Number(tokenData?.customer?.id), {
    skip: Boolean(!tokenData),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Products
        data={token ? data?.data?.products : wishlist}
        title={
          data?.data?.products?.length > 0 || wishlist?.length > 0 ? (
            "Your like products"
          ) : (
            <EmptyWishlist />
          )
        }
      />
    </>
  );
};

export default Wishlist;
