import { useState } from "react";
import Products from "../../components/products/Products";
import { IProduct } from "../../types";

const RelatedProducts = ({
  relatedProducts,
  productId,
}: {
  relatedProducts: IProduct[];
  productId: number;
}) => {
  const [visibleProducts, setVisibleProducts] = useState(4);

  const showMoreProducts = () => {
    setVisibleProducts((prev) => prev + 4);
  };

  const relatedProductsWithoutSameId = relatedProducts.filter(
    (prod: IProduct) => prod.id !== Number(productId)
  );

  return (
    <>
      <Products
        title="Related products"
        data={relatedProductsWithoutSameId.slice(0, visibleProducts)}
      />
      <div className="container my-10 max-[620px]:my-4 mt-20">
        {visibleProducts < relatedProductsWithoutSameId.length && (
          <div className="text-center mt-6">
            <button
              onClick={showMoreProducts}
              className="px-14 py-2 border border-[#B88E2F] text-[#B88E2F] text-lg hover:bg-[#B88E2F] hover:text-white"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default RelatedProducts;
