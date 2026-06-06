import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addCart } from "@/redux/features/cart-slice";
import { resolveImageUrl } from "@/config/env";
import RoomScene, { PlacedItem, RBProduct, CATEGORY_COLORS } from "./RoomScene";

const CATEGORY_NAMES: Record<number, string> = {
  0: "All",
  1: "Living Room",
  2: "Bedroom",
  3: "Dining",
  4: "Office",
  5: "Outdoor",
  6: "Lighting",
};

const ROOM_SIZES = [
  { label: "Small 4×4m", size: 4 },
  { label: "Medium 6×6m", size: 6 },
  { label: "Large 8×8m", size: 8 },
];

// Realistic default dimensions per category (meters) — used when API has no dims
const CATEGORY_DIMS: Record<number, { width: number; length: number; height: number }> = {
  1: { width: 2.0,  length: 0.95, height: 0.88 }, // Sofa
  2: { width: 1.6,  length: 2.0,  height: 0.55 }, // Bed
  3: { width: 1.6,  length: 0.9,  height: 0.76 }, // Dining table
  4: { width: 1.4,  length: 0.65, height: 0.76 }, // Desk
  5: { width: 1.5,  length: 0.55, height: 0.82 }, // Outdoor bench
  6: { width: 0.4,  length: 0.4,  height: 1.7  }, // Floor lamp
};
const DEFAULT_DIMS = { width: 1, length: 1, height: 0.8 };

function uid(): string {
  return (crypto as { randomUUID?: () => string }).randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function clampDim(v: unknown, def: number, max = 8): number {
  const n = Number(v);
  if (!n || n <= 0) return def;
  if (n > max) return max;
  return n;
}

export default function RoomBuilder() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<RBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [roomSize, setRoomSize] = useState(6);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(0);

  // Fetch products from the furniture API
  useEffect(() => {
    fetch("https://zero0015730-bisp-backend.onrender.com/api/products")
      .then((r) => r.json())
      .then((data) => {
        const arr: RBProduct[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data?.products)
          ? data.data.products
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setProducts(arr);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Stable handlers
  const handleRotate = useCallback((id: string) => {
    setPlacedItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, rotationY: item.rotationY + Math.PI / 2 }
          : item
      )
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setPlacedItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const handleUpdatePosition = useCallback(
    (id: string, pos: [number, number, number]) => {
      setPlacedItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, position: pos } : item))
      );
    },
    []
  );

  const handleAddToCart = useCallback(
    (productId: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      dispatch(
        addCart({
          id: product.id,
          name: product.name,
          description: "",
          price: product.price ?? 0,
          images: product.images ?? [],
          colors: product.colors ?? [],
          tags: [],
          stock: 99,
          is_liked: false,
          averageRating: 0,
          sku: String(product.id),
          discount: { percent: 0 },
          reviews: [],
          categoryId: product.categoryId,
        })
      );
      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
      });
    },
    [products, dispatch]
  );

  const handleAddToRoom = useCallback((product: RBProduct) => {
    const dims = CATEGORY_DIMS[product.categoryId] ?? DEFAULT_DIMS;
    const w = clampDim(product.width,  dims.width);
    const l = clampDim(product.length, dims.length);
    const h = clampDim(product.height, dims.height, 4);
    const newId = uid();

    setPlacedItems((prev) => {
      const occupied = prev.some(
        (i) => Math.abs(i.position[0]) < 0.8 && Math.abs(i.position[2]) < 0.8
      );
      const offset = occupied ? (prev.length % 4) * 1.6 - 2.4 : 0;
      const zOff   = occupied ? Math.floor(prev.length / 4) * 1.6 : 0;
      return [
        ...prev,
        {
          id: newId,
          productId: product.id,
          name: product.name,
          width: w,
          length: l,
          height: h,
          categoryId: product.categoryId,
          position: [offset, 0, zOff], // y=0: group sits at floor level
          rotationY: 0,
        },
      ];
    });
    setSelectedId(newId);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Escape") {
        setSelectedId(null);
        return;
      }
      if (!selectedId) return;
      if (e.key === "r" || e.key === "R") handleRotate(selectedId);
      else if (e.key === "Delete" || e.key === "Backspace")
        handleRemove(selectedId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, handleRotate, handleRemove]);

  // Filtered products list
  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name?.toLowerCase().includes(q);
    const matchCat = categoryFilter === 0 || p.categoryId === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 dark:bg-zinc-900 overflow-hidden">
      {/* ── Furniture sidebar ── */}
      <aside className="w-[300px] shrink-0 flex flex-col bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">
            Furniture Catalog
          </h2>
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-bg-primary"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5 p-3 border-b border-gray-200 dark:border-zinc-700">
          {Object.entries(CATEGORY_NAMES).map(([id, name]) => (
            <button
              key={id}
              onClick={() => setCategoryFilter(Number(id))}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                categoryFilter === Number(id)
                  ? "bg-bg-primary text-white"
                  : "bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 dark:bg-zinc-700 rounded-xl h-40 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={handleAddToRoom}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Canvas area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar: room size + item count */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 shrink-0">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium mr-1">
            Room:
          </span>
          {ROOM_SIZES.map(({ label, size }) => (
            <button
              key={size}
              onClick={() => setRoomSize(size)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                roomSize === size
                  ? "bg-bg-primary text-white"
                  : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {placedItems.length} item
            {placedItems.length !== 1 ? "s" : ""} in room
          </span>
          {placedItems.length > 0 && (
            <button
              onClick={() => {
                setPlacedItems([]);
                setSelectedId(null);
              }}
              className="text-sm text-red-500 hover:text-red-700 transition-colors font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* 3D canvas */}
        <div className="flex-1 relative overflow-hidden">
          <RoomScene
            placedItems={placedItems}
            selectedId={selectedId}
            roomSize={roomSize}
            products={products}
            onSelectItem={setSelectedId}
            onDeselectAll={() => setSelectedId(null)}
            onUpdatePosition={handleUpdatePosition}
            onRotate={handleRotate}
            onRemove={handleRemove}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}

// ── Product card in sidebar ──
function ProductCard({
  product,
  onAdd,
}: {
  product: RBProduct;
  onAdd: (p: RBProduct) => void;
}) {
  const fallbackColor = CATEGORY_COLORS[product.categoryId] ?? "#aaaaaa";
  const imgSrc = product.images?.[0]
    ? resolveImageUrl(product.images[0])
    : null;

  return (
    <div className="bg-gray-50 dark:bg-zinc-700 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-600 flex flex-col">
      <div className="relative h-24 overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-full h-full items-center justify-center text-white text-xl font-bold"
          style={{
            background: fallbackColor,
            display: imgSrc ? "none" : "flex",
          }}
        >
          {product.name?.[0] ?? "?"}
        </div>
      </div>
      <div className="p-2 flex flex-col flex-1">
        <p className="text-xs font-semibold text-gray-800 dark:text-white line-clamp-2 leading-tight mb-1">
          {product.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          ${product.price?.toLocaleString() ?? "—"}
        </p>
        <button
          onClick={() => onAdd(product)}
          className="mt-auto w-full bg-bg-primary text-white text-xs py-1.5 rounded-lg hover:opacity-90 transition-opacity font-semibold"
        >
          + Add to Room
        </button>
      </div>
    </div>
  );
}
