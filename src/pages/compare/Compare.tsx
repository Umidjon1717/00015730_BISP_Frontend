import { RootState } from "@/redux";
import { clearCompare, removeCompare } from "@/redux/features/compare-slice";
import { resolveImageUrl } from "@/config/env";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const formatPrice = (price: number) => `${price.toLocaleString()} USD`;

export default function Compare() {
  const dispatch = useDispatch();
  const compareItems = useSelector((state: RootState) => state.compare.value);

  if (!compareItems.length) {
    return (
      <section className="container py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h1 className="text-4xl font-semibold dark:text-white">
            Compare Products
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            You have not selected any products to compare yet. Add products from
            the product detail page or the shop grid to compare their features
            side by side.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-gray-900 px-6 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-gray-200"
          >
            Go to Shop
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold dark:text-white">
            Compare Products
          </h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
            Review selected products side by side and choose the best fit for
            your space.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/shop"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900 dark:border-zinc-700 dark:text-gray-200 dark:hover:border-white dark:hover:text-white"
          >
            Add More Products
          </Link>
          <button
            onClick={() => dispatch(clearCompare())}
            className="h-11 rounded-xl bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Clear Compare
          </button>
        </div>
      </div>

      {compareItems.length < 2 && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Add at least one more product for a more useful comparison.
        </div>
      )}

      <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full border-collapse">
          <tbody>
            <tr className="border-b border-gray-200 dark:border-zinc-800">
              <th className="min-w-[180px] px-6 py-5 text-left text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                Product
              </th>
              {compareItems.map((product) => (
                <td
                  key={product.id}
                  className="min-w-[280px] border-l border-gray-200 px-6 py-5 align-top dark:border-zinc-800"
                >
                  <img
                    src={resolveImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="h-52 w-full rounded-2xl object-cover"
                  />
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold dark:text-white">
                        {product.name}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {product.description}
                      </p>
                    </div>
                    <button
                      onClick={() => dispatch(removeCompare(product.id))}
                      className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/30"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-200 dark:border-zinc-800">
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Price
              </th>
              {compareItems.map((product) => (
                <td
                  key={`${product.id}-price`}
                  className="border-l border-gray-200 px-6 py-5 text-base font-semibold text-gray-900 dark:border-zinc-800 dark:text-white"
                >
                  {formatPrice(product.price)}
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-200 dark:border-zinc-800">
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Rating
              </th>
              {compareItems.map((product) => (
                <td
                  key={`${product.id}-rating`}
                  className="border-l border-gray-200 px-6 py-5 text-gray-700 dark:border-zinc-800 dark:text-gray-200"
                >
                  {product.averageRating || 0} / 5
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-200 dark:border-zinc-800">
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Stock
              </th>
              {compareItems.map((product) => (
                <td
                  key={`${product.id}-stock`}
                  className="border-l border-gray-200 px-6 py-5 text-gray-700 dark:border-zinc-800 dark:text-gray-200"
                >
                  {product.stock}
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-200 dark:border-zinc-800">
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Colors
              </th>
              {compareItems.map((product) => (
                <td
                  key={`${product.id}-colors`}
                  className="border-l border-gray-200 px-6 py-5 dark:border-zinc-800"
                >
                  <div className="flex flex-wrap gap-2">
                    {product.colors?.map((color) => (
                      <span
                        key={`${product.id}-${color}`}
                        className="h-7 w-7 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-200 dark:border-zinc-800">
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Tags
              </th>
              {compareItems.map((product) => (
                <td
                  key={`${product.id}-tags`}
                  className="border-l border-gray-200 px-6 py-5 text-gray-700 dark:border-zinc-800 dark:text-gray-200"
                >
                  {product.tags?.length ? product.tags.join(", ") : "No tags"}
                </td>
              ))}
            </tr>

            <tr>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                SKU
              </th>
              {compareItems.map((product) => (
                <td
                  key={`${product.id}-sku`}
                  className="border-l border-gray-200 px-6 py-5 text-gray-700 dark:border-zinc-800 dark:text-gray-200"
                >
                  {product.sku}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
