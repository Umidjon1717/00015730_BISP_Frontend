import { useState } from "react";
import { aiRoomStyle, AiProduct } from "@/utils/ai-api";
import { resolveImageUrl } from "@/config/env";
import { useDispatch } from "react-redux";
import { addCart } from "@/redux/features/cart-slice";
import { useNavigate } from "react-router-dom";
import { IProduct } from "@/types";
import { BsStars, BsLightbulb } from "react-icons/bs";

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

const RoomStyle = () => {
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    suggestions: AiProduct[];
    designTips: string;
    totalEstimate: number;
  } | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const desc = description.trim();
    if (!desc || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const budgetNum = budget ? Number(budget) : undefined;
      const res = await aiRoomStyle(desc, budgetNum);
      setResult(res);
    } catch {
      setError("Failed to get suggestions. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Banner */}
      <div className="bg-[#F9F1E7] dark:bg-zinc-900 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 text-bg-primary border border-amber-200 dark:border-amber-800 rounded-full px-4 py-1.5 text-sm font-medium mb-4 shadow-sm">
          <BsStars className="w-4 h-4" />
          AI Room Stylist
        </div>
        <h1 className="text-4xl max-[620px]:text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Design Your Dream Room
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto px-4 text-sm">
          Describe your room style and budget, and our AI will curate the perfect furniture selection for you.
        </p>
      </div>

      <div className="container py-12">
        {/* Form */}
        <div className="max-w-2xl mx-auto mb-12 bg-white dark:bg-zinc-800 rounded-2xl shadow p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe your room style <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="e.g. modern minimalist living room with neutral tones and natural wood accents..."
              className="w-full border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-bg-primary transition-colors resize-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget (USD) — <span className="text-gray-400 font-normal">optional</span>
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 1500"
              min={0}
              className="w-full border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-bg-primary transition-colors text-sm"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !description.trim()}
            className="w-full bg-bg-primary text-white py-3 rounded-xl font-semibold hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating suggestions…
              </>
            ) : (
              <>
                <BsStars className="w-4 h-4" />
                Get Suggestions
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto mb-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-8">
            {/* Design tips callout */}
            <div className="max-w-3xl mx-auto bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 flex gap-4 items-start">
              <BsLightbulb className="w-6 h-6 text-bg-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">AI Design Tips</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {result.designTips}
                </p>
              </div>
            </div>

            {/* Total estimate */}
            <div className="text-center">
              <span className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-6 py-2.5 text-gray-700 dark:text-gray-300 font-medium shadow text-sm">
                Estimated Total:
                <strong className="text-bg-primary text-lg">
                  ${result.totalEstimate.toLocaleString()}
                </strong>
              </span>
            </div>

            {/* Product grid */}
            {result.suggestions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Suggested Furniture
                </h2>
                <div className="grid grid-cols-4 gap-6 max-[1240px]:grid-cols-3 max-[990px]:grid-cols-2 max-[620px]:gap-4 max-[500px]:grid-cols-1">
                  {result.suggestions.map((p) => (
                    <div
                      key={p.id}
                      className="group bg-white dark:bg-zinc-800 rounded-xl shadow overflow-hidden"
                    >
                      <div
                        onClick={() => navigate(`/product/${p.id}`)}
                        className="relative h-[240px] max-[620px]:h-[200px] overflow-hidden cursor-pointer bg-gray-100 dark:bg-zinc-700"
                      >
                        {p.images?.[0] ? (
                          <img
                            src={resolveImageUrl(p.images[0])}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-zinc-600 text-6xl">
                            🪑
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold line-clamp-1 dark:text-white">{p.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                          {p.description}
                        </p>
                        <strong className="block text-gray-900 dark:text-white">
                          {p.price.toLocaleString()} USD
                        </strong>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => navigate(`/product/${p.id}`)}
                            className="flex-1 border border-bg-primary text-bg-primary py-2 rounded-lg text-sm hover:bg-bg-primary hover:text-white transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => dispatch(addCart(toIProduct(p)))}
                            className="flex-1 bg-bg-primary text-white py-2 rounded-lg text-sm hover:bg-amber-600 transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state before first submit */}
        {!result && !loading && !error && (
          <div className="text-center py-16 text-gray-300 dark:text-zinc-600 select-none">
            <div className="text-6xl mb-4">🛋️</div>
            <p className="text-gray-400 dark:text-gray-500">
              Fill in the form above to get AI-curated furniture suggestions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomStyle;
