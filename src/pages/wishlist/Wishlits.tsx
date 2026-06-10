import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { useGetWishlistQuery } from "../../redux/api/wishlist-api";
import Products from "../../components/products/Products";
import { useEffect } from "react";
import { useCheckTokenQuery } from "@/redux/api/customer-api";
import EmptyWishlist from "./EmptyWishlist";
import { IProduct } from "@/types";

const Wishlist = () => {
  const localWishlist = useSelector((state: RootState) => state.wishlist.value);
  const token = useSelector((state: RootState) => state.token.access_token);

  const { data: tokenData } = useCheckTokenQuery(null, { skip: !token });

  const customerId = tokenData?.customer?.id;
  const { data, isLoading } = useGetWishlistQuery(Number(customerId), {
    skip: !customerId,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Normalize response — backend may return { data: { products: [] } }, { data: [] }, or []
  const apiProducts: IProduct[] =
    data?.data?.products ??
    (Array.isArray(data?.data) ? (data.data as unknown as IProduct[]) : null) ??
    (Array.isArray(data) ? (data as unknown as IProduct[]) : []);

  const displayItems = token ? apiProducts : localWishlist;

  if (token && isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loader" />
      </div>
    );
  }

  if (displayItems.length === 0) {
    return <EmptyWishlist />;
  }

  return <Products data={displayItems} title="Your liked products" />;
};

export default Wishlist;
