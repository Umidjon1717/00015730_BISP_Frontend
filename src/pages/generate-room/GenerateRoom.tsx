import { useState } from "react";
import { aiGenerateRoom, GenerateRoomResponse } from "@/utils/ai-api";
import AiProductCard from "@/components/ai-product-card/AiProductCard";
import { BsStars, BsImage } from "react-icons/bs";
import { MdOutlineSquareFoot } from "react-icons/md";

const GenerateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateRoomResponse | null>(null);

  const canSubmit = roomName.trim() && Number(width) > 0 && Number(length) > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await aiGenerateRoom({
        roomName: roomName.trim(),
        width: Number(width),
        length: Number(length),
        style: style.trim() || undefined,
        budget: budget ? Number(budget) : undefined,
      });
      setResult(res);
    } catch {
      setError("Room generation failed. Please check your connection and try again.");
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
          AI Room Generator
        </div>
        <h1 className="text-4xl max-[620px]:text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Generate Your Room
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto px-4 text-sm">
          Enter your room dimensions and style preferences — our AI will generate a visual layout and curate the perfect furniture for you.
        </p>
      </div>

      <div className="container py-12">
        {/* Form */}
        <div className="max-w-2xl mx-auto mb-10 bg-white dark:bg-zinc-800 rounded-2xl shadow p-6 space-y-5">
          {/* Room name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Living Room, Bedroom, Office"
              className="w-full border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-bg-primary transition-colors text-sm"
            />
          </div>

          {/* Width + Length */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Width (m) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g. 5"
                min={1}
                step={0.5}
                className="w-full border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-bg-primary transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Length (m) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g. 4"
                min={1}
                step={0.5}
                className="w-full border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-bg-primary transition-colors text-sm"
              />
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Style — <span className="text-gray-400 font-normal">optional</span>
            </label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g. modern minimalist, rustic, scandinavian"
              className="w-full border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-bg-primary transition-colors text-sm"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget (USD) — <span className="text-gray-400 font-normal">optional</span>
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 2000"
              min={0}
              className="w-full border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-bg-primary transition-colors text-sm"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-bg-primary text-white py-3 rounded-xl font-semibold hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <BsStars className="w-4 h-4" />
                Generate Room
              </>
            )}
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="max-w-2xl mx-auto mb-10 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-5">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-amber-200 dark:border-amber-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-bg-primary rounded-full animate-spin" />
                <BsImage className="absolute inset-0 m-auto w-6 h-6 text-bg-primary" />
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-200 font-semibold text-base mb-1">
              Designing your room…
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              This may take 15–20 seconds while our AI generates the layout and image.
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto mb-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Generated image */}
            {result.imageUrl && (
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={result.imageUrl}
                  alt={`Generated ${result.roomName}`}
                  className="w-full object-cover max-h-[520px]"
                />
              </div>
            )}

            {/* Room name + dimensions */}
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl max-[620px]:text-2xl font-bold text-gray-900 dark:text-white">
                {result.roomName}
              </h2>
              <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-bg-primary rounded-full px-3 py-1 text-sm font-medium">
                <MdOutlineSquareFoot className="w-4 h-4" />
                {result.dimensions}
              </span>
              {result.style && (
                <span className="inline-flex items-center bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 rounded-full px-3 py-1 text-sm capitalize">
                  {result.style}
                </span>
              )}
            </div>

            {/* Layout description quote box */}
            {result.layoutDescription && (
              <blockquote className="border-l-4 border-bg-primary bg-[#F9F1E7] dark:bg-amber-900/10 rounded-r-xl px-6 py-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                  {result.layoutDescription}
                </p>
              </blockquote>
            )}

            {/* Product grid */}
            {result.selectedProducts?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
                  Suggested Furniture
                </h3>
                <div className="grid grid-cols-4 gap-6 max-[1240px]:grid-cols-3 max-[990px]:grid-cols-2 max-[620px]:gap-4 max-[500px]:grid-cols-1">
                  {result.selectedProducts.map((p) => (
                    <AiProductCard key={p.id} product={p} variant="grid" />
                  ))}
                </div>
              </div>
            )}

            {/* Total estimate */}
            <div className="flex justify-center pt-2 pb-6">
              <div className="inline-flex items-center gap-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl px-8 py-4 shadow">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Estimated total:</span>
                <strong className="text-bg-primary text-2xl font-bold">
                  ${result.totalEstimate.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="text-center py-12 select-none">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-gray-400 dark:text-gray-500">
              Fill in your room details above to generate a design
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateRoom;
