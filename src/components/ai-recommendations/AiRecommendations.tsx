import { useState, useEffect } from "react";
import { aiRecommend, AiProduct } from "@/utils/ai-api";
import { BsStars } from "react-icons/bs";
import AiProductCard from "@/components/ai-product-card/AiProductCard";

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
              <AiProductCard key={p.id} product={p} variant="compact" />
            ))}
      </div>
    </div>
  );
};

export default AiRecommendations;
