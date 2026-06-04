import { useGetSingleProductQuery } from "@/redux/api/product-api";
import { resolveImageUrl } from "@/config/env";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "@/redux/features/cart-slice";
import { AiProduct } from "@/utils/ai-api";

interface Props {
  product: AiProduct;
  variant?: "grid" | "compact";
}

const AiProductCard = ({ product, variant = "grid" }: Props) => {
  const { data: real, isLoading } = useGetSingleProductQuery(product.id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const name = real?.name ?? product.name;
  const description = real?.description ?? product.description;
  const price = real?.price ?? product.price;
  const image = real?.images?.[0] ?? product.images?.[0];

  if (variant === "compact") {
    return (
      <div className="min-w-[220px] w-[220px] group bg-white dark:bg-zinc-800 rounded-xl shadow overflow-hidden shrink-0">
        <div
          onClick={() => navigate(`/product/${product.id}`)}
          className="h-[180px] overflow-hidden cursor-pointer bg-gray-100 dark:bg-zinc-700"
        >
          {isLoading ? (
            <div className="w-full h-full animate-pulse bg-gray-200 dark:bg-zinc-700" />
          ) : image ? (
            <img
              src={resolveImageUrl(image)}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-zinc-600 text-5xl select-none">
              🛋️
            </div>
          )}
        </div>
        <div className="p-3 space-y-1.5">
          <h3 className="line-clamp-1 font-semibold text-sm dark:text-white">{name}</h3>
          <p className="line-clamp-1 text-gray-500 dark:text-gray-400 text-xs">{description}</p>
          <strong className="block text-gray-900 dark:text-white text-sm">
            {price.toLocaleString()} USD
          </strong>
          <button
            onClick={() =>
              real
                ? dispatch(addCart(real))
                : dispatch(
                    addCart({
                      id: product.id,
                      name: product.name,
                      description: product.description ?? "",
                      price: product.price,
                      images: product.images ?? [],
                      colors: product.colors ?? [],
                      tags: product.tags ?? [],
                      stock: product.stock ?? 0,
                      is_liked: false,
                      averageRating: 0,
                      sku: "",
                      discount: { percent: 0 },
                      reviews: [],
                    })
                  )
            }
            className="w-full mt-1 bg-bg-primary text-white py-1.5 rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden">
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative h-[280px] max-[620px]:h-[220px] overflow-hidden cursor-pointer bg-gray-100 dark:bg-zinc-700"
      >
        {isLoading ? (
          <div className="w-full h-full animate-pulse bg-gray-200 dark:bg-zinc-700" />
        ) : image ? (
          <img
            src={resolveImageUrl(image)}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-zinc-600 text-6xl select-none">
            🛋️
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h2 className="line-clamp-1 text-lg font-semibold dark:text-white">{name}</h2>
        <p className="line-clamp-2 text-gray-500 dark:text-gray-400 text-sm">{description}</p>
        <strong className="block text-gray-900 dark:text-white font-semibold">
          {price.toLocaleString()} USD
        </strong>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 border border-bg-primary text-bg-primary py-2 rounded-lg text-sm hover:bg-bg-primary hover:text-white transition-colors"
          >
            View
          </button>
          <button
            onClick={() =>
              real
                ? dispatch(addCart(real))
                : dispatch(
                    addCart({
                      id: product.id,
                      name: product.name,
                      description: product.description ?? "",
                      price: product.price,
                      images: product.images ?? [],
                      colors: product.colors ?? [],
                      tags: product.tags ?? [],
                      stock: product.stock ?? 0,
                      is_liked: false,
                      averageRating: 0,
                      sku: "",
                      discount: { percent: 0 },
                      reviews: [],
                    })
                  )
            }
            className="flex-1 bg-bg-primary text-white py-2 rounded-lg text-sm hover:bg-amber-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiProductCard;
