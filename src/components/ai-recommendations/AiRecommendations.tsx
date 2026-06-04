import { useState, useEffect } from "react";
import { aiRecommend, AiProduct } from "@/utils/ai-api";
import { resolveImageUrl } from "@/config/env";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "@/redux/features/cart-slice";
import { IProduct } from "@/types";
import { BsStars } from "react-icons/bs";

function toIProduct(p: AiProduct): IProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    images: p.images ?? [],
    colors: p.colors ?? [],
    tags: p.tags ?? [],
    stock: p.stock,
    is_liked: false,
    averageRating: 0,
    sku: "",
    discount: { percent: 0 },
    reviews: [],
  };
}

const SkeletonCard = () => (
  <div className="min-w-[220px] w-[220px] bg-white dark:bg-zinc-800 rounded-xl shadow overflow-hidden animate-pulse shrink-0">
    <div className="h-[180px] bg-gray-200 dark:bg-zinc-700" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
      <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded mt-2" />
    </div>
  </div>
);

interface Props {
  productId: number;
}

const AiRecommendations = ({ productId }: Props) => {
  const [products, setProducts] = useState<AiProduct[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    setFailed(false);
    setProducts([]);
    aiRecommend(productId)
      .then((res) => {
        setProducts(res.recommendations.slice(0, 5));
        setReason(res.reason);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [productId]);

  if (failed || (!loading && products.length === 0)) return null;

  return (
    <div className="container my-10">
      <div className="flex items-center gap-2 mb-1">
        <BsStars className="w-5 h-5 text-bg-primary" />
        <h2 className="text-2xl font-semibold dark:text-white">You Might Also Like</h2>
      </div>
      {reason && !loading && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-5 ml-7">{reason}</p>
      )}
      {!reason && !loading && <div className="mb-5" />}

      <div className="flex gap-5 overflow-x-auto pb-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p) => (
              <div
                key={p.id}
                className="min-w-[220px] w-[220px] group bg-white dark:bg-zinc-800 rounded-xl shadow overflow-hidden shrink-0"
              >
                <div
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="h-[180px] overflow-hidden cursor-pointer bg-gray-100 dark:bg-zinc-700"
                >
                  {p.images?.[0] ? (
                    <img
                      src={resolveImageUrl(p.images[0])}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-zinc-600 text-5xl">
                      🪑
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-1.5">
                  <h3 className="line-clamp-1 font-semibold text-sm dark:text-white">{p.name}</h3>
                  <p className="line-clamp-1 text-gray-500 dark:text-gray-400 text-xs">{p.description}</p>
                  <strong className="block text-gray-900 dark:text-white text-sm">
                    {p.price.toLocaleString()} USD
                  </strong>
                  <button
                    onClick={() => dispatch(addCart(toIProduct(p)))}
                    className="w-full mt-1 bg-bg-primary text-white py-1.5 rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default AiRecommendations;
