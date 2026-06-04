import { useState } from "react";
import { aiSearch, AiProduct } from "@/utils/ai-api";
import { resolveImageUrl } from "@/config/env";
import { useDispatch } from "react-redux";
import { addCart } from "@/redux/features/cart-slice";
import { useNavigate } from "react-router-dom";
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

const AiSearch = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AiProduct[] | null>(null);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setExplanation("");
    try {
      const res = await aiSearch(trimmed);
      setResults(res.products ?? []);
      setExplanation(res.explanation ?? "");
    } catch {
      setError("Search failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      {/* Banner */}
      <div className="bg-[#F9F1E7] dark:bg-zinc-900 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 text-bg-primary border border-amber-200 dark:border-amber-800 rounded-full px-4 py-1.5 text-sm font-medium mb-4 shadow-sm">
          <BsStars className="w-4 h-4" />
          AI-Powered Search
        </div>
        <h1 className="text-4xl max-[620px]:text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Find Your Perfect Furniture
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto px-4 text-sm">
          Describe what you're looking for in plain language — our AI will find the best matches for you.
        </p>
      </div>

      <div className="container py-10">
        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-10 flex gap-3 max-[500px]:flex-col">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g. "comfortable grey sofa under $500"'
            className="flex-1 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white rounded-xl px-5 py-3 focus:outline-none focus:border-bg-primary transition-colors text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="bg-bg-primary text-white px-7 py-3 rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors font-semibold text-sm whitespace-nowrap flex items-center gap-2"
          >
            <BsStars className="w-4 h-4" />
            {loading ? "Searching…" : "AI Search"}
          </button>
        </div>

        {/* Spinner */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 dark:border-zinc-700 border-t-bg-primary rounded-full animate-spin" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">AI is finding matches for you…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {/* AI explanation */}
        {explanation && !loading && (
          <div className="max-w-2xl mx-auto mb-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3 items-start">
            <BsStars className="w-5 h-5 text-bg-primary shrink-0 mt-0.5" />
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{explanation}</p>
          </div>
        )}

        {/* Results */}
        {results !== null && !loading && (
          <>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6 text-center">
              {results.length === 0
                ? "No products matched your search."
                : `Found ${results.length} result${results.length !== 1 ? "s" : ""}`}
            </p>

            {results.length === 0 ? (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                <p>Try a different description, like <em>"wooden dining table for 6"</em>.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-8 max-[1240px]:grid-cols-3 max-[990px]:grid-cols-2 max-[620px]:gap-4 max-[500px]:grid-cols-1">
                {results.map((p) => (
                  <div
                    key={p.id}
                    className="group bg-white dark:bg-zinc-800 rounded-lg shadow overflow-hidden"
                  >
                    <div
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="relative h-[280px] max-[620px]:h-[220px] overflow-hidden cursor-pointer bg-gray-100 dark:bg-zinc-700"
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
                      <h2 className="line-clamp-1 text-lg font-semibold dark:text-white">{p.name}</h2>
                      <p className="line-clamp-2 text-gray-500 dark:text-gray-400 text-sm">{p.description}</p>
                      <strong className="block text-gray-900 dark:text-white font-semibold">
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
            )}
          </>
        )}

        {/* Empty state before first search */}
        {results === null && !loading && !error && (
          <div className="text-center py-20 text-gray-300 dark:text-zinc-600 select-none">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 dark:text-gray-500">Enter a description above to search with AI</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSearch;
