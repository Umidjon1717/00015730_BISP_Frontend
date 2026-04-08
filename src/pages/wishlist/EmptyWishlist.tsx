import { useNavigate } from "react-router-dom";
import emptyWishlistImage from "@/assets/images/wish-list.png"; 

const EmptyWishlist = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 h-[500px] sm:h-[600px]">
      <img
        src={emptyWishlistImage}
        alt="Empty Wishlist"
        className="w-32 sm:w-48 md:w-60 mb-6 opacity-80"
      />
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4">
        Your Wishlist is Empty
      </h1>

      <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-[80%]">
        Explore our collection and add your favorite items to your wishlist!
      </p>

      <button
        className="px-3 sm:px-4 py-1 lg:text-2xl lg:font-medium sm:py-2 bg-[#B88E2F] text-white rounded-md shadow-md hover:bg-[#a07424] transition duration-300 text-sm sm:text-base"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
};

export default EmptyWishlist;
