import React from "react";
import { useGetProductsQuery } from "../../redux/api/product-api";
import Hero from "./Hero";
import Products from "../../components/products/Products";
import Browse from "./Browse";
import Insparation from "./Insparation";
import Skeleton from "../../components/products/Skeleton";
import Stats from "./Stats";
import Features from "./Features";
import Testimonials from "./Testimonials";
import Gallery from "./Gallery";

const Home = () => {
  const { data, isLoading, isError } = useGetProductsQuery({ limit: 8 });
  return (
    <div>
      <Hero />
      <Browse />
      <Stats />
      {isLoading ? (
        <Skeleton count={8} />
      ) : isError ? (
        <div className="container my-10 text-center text-red-500">
          Failed to load products. Check API URL and backend status.
        </div>
      ) : data?.data?.products?.length ? (
        <Products data={data.data.products} title="Our products" />
      ) : (
        <div className="container my-10 text-center text-gray-500">
          No products found yet.
        </div>
      )}
      <Features />
      <Insparation />
      <Testimonials />
      <Gallery />
    </div>
  );
};

export default React.memo(Home);
