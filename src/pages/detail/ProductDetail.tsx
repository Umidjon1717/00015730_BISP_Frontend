import { ReactNode, useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "./Detail.scss";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { IProduct, IReview } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../../redux/features/cart-slice";
import { RootState } from "../../redux";
import { resolveImageUrl } from "@/config/env";

const ProductDetail = ({
  product,
  category,
  id,
}: {
  product: IProduct;
  category: any;
  id: number;
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const cart = useSelector((state: RootState) => state.cart.value);
  const [activeTab, setActiveTab] = useState("description");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const dispatch = useDispatch();
  const Modal = ({
    imageUrl,
    onClose,
  }: {
    imageUrl: string;
    onClose: () => void;
  }) => {
    return (
      <div
        className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50"
        onClick={onClose}
      >
        <div
          className="relative"
          onClick={(e) => e.stopPropagation()}
          style={{ width: "90%", maxWidth: "600px", maxHeight: "80vh" }}
        >
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-white text-3xl p-2"
          >
            &times;
          </button>
          <img
            src={imageUrl}
            alt="Modal Image"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    setSelectedImage(0);
    window.scrollTo({ behavior: "smooth", top: 0, left: 0 });
  }, [id, product]);

  const renderRating = (rating: number): ReactNode => {
    const fullStars: number = Math.floor(rating);
    const hasHalfStar: boolean = rating % 1 >= 0.5;
    const emptyStars: number = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center text-yellow-500">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} />
        ))}
        {hasHalfStar && <FaStarHalfAlt />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div id="product__detail" className="container mx-auto my-10 ">
        <div className="grid grid-cols-2 gap-8 max-[990px]:grid-cols-1 pb-10">
          <div className="flex">
            <div className="product__detail flex flex-col space-y-4 mr-4 overflow-y-auto h-80 no-scrollbar">
              {product?.images.map((img, index) => (
                <img
                  key={index}
                  src={resolveImageUrl(img)}
                  alt={`Thumbnail ${index + 1}`}
                  className="
                  w-full max-w-[160px] h-auto aspect-video object-cover 
                  sm:max-w-[120px] 
                  md:max-w-[140px] 
                  lg:max-w-[180px] 
                  xl:max-w-[200px] 
                  rounded cursor-pointer border-2 border-gray-200 hover:border-blue-500"
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>

            <div>
              <div className="w-full max-w-lg h-80 overflow-hidden">
                <img
                  src={resolveImageUrl(product.images?.[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                  onClick={() => {
                    setModalImage(
                      resolveImageUrl(product.images?.[selectedImage])
                    );
                    setIsModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
          {isModalOpen && (
            <Modal
              imageUrl={modalImage}
              onClose={() => setIsModalOpen(false)}
            />
          )}

          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl text-[#9F9F9F]  mt-2">
              RS. {product.price.toLocaleString()}
            </p>
            <div className="mt-4 flex items-center space-x-2">
              {renderRating(product.averageRating)}
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-200 mt-4">
              {product.description}
            </p>
            <div className="mt-4">
              <span className="font-thin">Color </span>
              <div className="flex items-center space-x-2 mt-2">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4">
              {/* <div className="flex items-center border border-gray-800 dark:border-gray-200 rounded-lg hover:border-bg-primary hover:text-white hover:bg-bg-primary dark:hover:border-bg-primary duration-300">
                <button
                  className="px-[10px] py-1 rounded-lg text-sm font-bold hover:text-bg-primary dark:hover:bg-zinc-900 hover:bg-white duration-150"
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                >
                  -
                </button>
                <span className="text-base px-[6px]">{quantity}</span>
                <button
                  className="px-[10px] py-1 rounded-lg text-sm font-bold hover:text-bg-primary dark:hover:bg-zinc-900 hover:bg-white duration-150"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div> */}

              <button
                onClick={() => dispatch(addCart(product))}
                className="py-1 px-4 border border-black dark:border-gray-200 text-sm text-black dark:text-gray-200 rounded-lg dark:hover:text-black hover:text-white hover:bg-bg-primary dark:hover:border-bg-primary hover:border-bg-primary duration-300"
              >
                {cart?.some((c) => c.id === product.id)
                  ? "Product added"
                  : "Add to cart"}
              </button>

              <button className="py-1 px-4 border border-black dark:border-gray-200 text-sm text-black dark:text-gray-200 rounded-lg dark:hover:text-black hover:text-white hover:bg-bg-primary dark:hover:border-bg-primary hover:border-bg-primary duration-300">
                + Compare
              </button>
            </div>

            <div className="flex items-center space-x-4 mt-8"></div>
            <hr className="font-bold" />
            <div className="mt-8">
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-2">
                SKU: {product.sku}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-2">
                Category: {category?.data?.category?.name}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                Tags: {product.tags.join(", ")}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                Stock: {product.stock}
              </p>

              <p className="flex items-center text-sm text-gray-800 dark:text-gray-200 mt-4 space-x-3">
                <span>Share:</span>
                <FaFacebook
                  className="w-4 h-4 cursor-pointer dark:text-gray-200 hover:text-bg-primary dark:hover:text-bg-primary duration-300"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                />
                <FaLinkedin
                  className="w-4 h-4 cursor-pointer dark:text-gray-200 hover:text-bg-primary dark:hover:text-bg-primary duration-300"
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                />
                <FaTwitter
                  className="w-4 h-4 cursor-pointer dark:text-gray-200 hover:text-bg-primary dark:hover:text-bg-primary duration-300"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                />
              </p>
            </div>
          </div>
        </div>
        <hr />
        <div className="mt-10 md:mt-20 lg:mt-32">
          <div className="flex  justify-center space-x-4 md:space-x-8 max-[400px]:space-x-3 lg:space-x-14 mb-6">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-2 sm:px-3 md:px-4 py-2 text-sm sm:text-base md:text-lg max-[400px]:text-sm  font-semibold ${
                activeTab === "description"
                  ? "border-b-2 border-black dark:border-white"
                  : "text-gray-500"
              } hover:text-black dark:hover:text-white transition duration-300`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("additionalInfo")}
              className={`px-2 sm:px-3 md:px-4 py-2 text-sm sm:text-base md:text-lg max-[400px]:text-sm  font-semibold ${
                activeTab === "additionalInfo"
                  ? "border-b-2 border-black dark:border-white"
                  : "text-gray-500"
              } hover:text-black dark:hover:text-white transition duration-300`}
            >
              Additional Information
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-2 sm:px-3 md:px-4 py-2 text-sm sm:text-base max-[400px]:text-sm  md:text-lg font-semibold ${
                activeTab === "reviews"
                  ? "border-b-2 border-black dark:border-white"
                  : "text-gray-500"
              } hover:text-black dark:hover:text-white transition duration-300`}
            >
              Reviews
            </button>
          </div>

          {activeTab === "description" && (
            <div>
              <p className="text-sm md:text-base text-gray-800 dark:text-gray-200">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "additionalInfo" && (
            <div className="text-sm md:text-base text-gray-800 dark:text-gray-200 space-y-2">
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>Colors:</strong> {product.colors.join(", ")}
              </p>
              <p>
                <strong>Price:</strong> {product.price.toLocaleString()} USD
              </p>
              <p>
                <strong>Rating:</strong> {product.averageRating}
              </p>
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
              <p>
                <strong>Tags:</strong> {product.tags.join(", ")}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-h-96 overflow-y-auto space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.slice(0, 5).map((review: IReview) => (
                  <div key={review.id} className="border-b py-4">
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm md:text-base text-gray-500">
                  No reviews available
                </p>
              )}

              {product.reviews && product.reviews.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className="text-blue-600 hover:underline transition duration-300"
                  >
                    Show all reviews
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-16 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-14">
          {product.images.slice(0, 2).map((img, index) => (
            <img
              key={index}
              src={resolveImageUrl(img)}
              alt={`Product Image ${index + 1}`}
              className="
              w-full h-auto object-cover rounded-lg cursor-pointer
              sm:max-h-48 md:max-h-64 lg:max-h-80 xl:max-h-96 aspect-video"
              onClick={() => {
                setModalImage(resolveImageUrl(img));
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>

        <hr />
      </div>
    </>
  );
};

export default ProductDetail;
