import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../../types";


const Hero = ({ data: product }: { data: IProduct }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#F9F1E7] dark:bg-zinc-800 w-full">
      <div className="container py-5 px-4 md:px-6 lg:px-8 flex flex-wrap items-center">
        <span
          onClick={() => navigate("/")}
          className="font-medium cursor-pointer text-sm md:text-base mr-3 text-[#9F9F9F] dark:text-gray-300 hover:text-bg-primary duration-300"
        >
          Home
        </span>
        <MdOutlineArrowForwardIos className="inline-block dark:text-gray-100 text-black text-xs md:text-sm" />
        <span
          onClick={() => navigate("/shop")}
          className="font-light cursor-pointer text-sm md:text-base mx-3 text-[#9F9F9F] dark:text-gray-300 hover:text-bg-primary duration-300"
        >
          Shop
        </span>
        <MdOutlineArrowForwardIos className="inline-block dark:text-gray-100 text-black text-xs md:text-sm" />
        <span className="hidden sm:inline-block text-[#9F9F9F] text-lg md:text-xl mx-3">|</span>
        {product && (
          <span className="text-sm md:text-base text-gray-700 dark:text-gray-200 truncate max-w-xs md:max-w-sm">
            {product.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default Hero;
