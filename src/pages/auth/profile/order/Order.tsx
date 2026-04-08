import React from "react";
import { useCheckTokenQuery } from "@/redux/api/customer-api";
import {
  useDeleteOrderMutation,
  useGetOrderByCustomerIdQuery,
} from "@/redux/api/order-api";
import { resolveImageUrl } from "@/config/env";

const Order = () => {
  const { data } = useCheckTokenQuery(null);
  const [deletingOrderId, setDeletingOrderId] = React.useState<number | null>(
    null
  );

  const [deleteOrder, { isLoading: deleteLoading }] = useDeleteOrderMutation();
  const { data: orderData, isLoading } = useGetOrderByCustomerIdQuery(
    data?.customer?.id,
    {
      skip: Boolean(!data),
    }
  );

  if (isLoading) {
    return (
      <p className="text-center text-lg dark:text-white">Loading orders...</p>
    );
  }

  if (!orderData?.data?.order?.length) {
    return (
      <p className="text-center text-lg dark:text-white">No orders found</p>
    );
  }

  const handleDeleteOrder = async (id: number) => {
    setDeletingOrderId(id);
    try {
      await deleteOrder(id).unwrap();
    } finally {
      setDeletingOrderId(null);
    }
  };

  return (
    <div className="container">
      <h2 className="text-3xl max-sm:text-[24px] font-semibold mb-6 dark:text-white">
        My Orders
      </h2>

      {orderData.data.order.map((order: any) => (
        <div
          key={order.id}
          className="border rounded-md p-6 max-sm:p-2 mb-8 bg-white dark:bg-zinc-900 dark:border-gray-700 transition-transform transform hover:scale-[1.02]"
        >
          <div className="flex relative flex-col sm:flex-row justify-between items-start sm:items-center max-sm:w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Order ID: {order.id} - Status:{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {order.status}
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 sm:mt-0">
              {new Date(order.order_date).toLocaleString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </p>
            <button
              onClick={() => handleDeleteOrder(order?.id)}
              className="text-white absolute max-sm:top-0 top-7 hover:bg-opacity-85 right-0 rounded-md py-1 px-4 font-semibold text-lg bg-red-400"
            >
              Delete
            </button>
            {deleteLoading && order?.id === deletingOrderId && (
              <p className="text-red-500">Deleting ...</p>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 mt-4">
            <strong>Address:</strong> {order.order_address.region},{" "}
            {order.order_address.district}, {order.order_address.street}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            <strong>Total Price:</strong> ${order.total_price}
          </p>

          <div className="flex flex-col md:flex-row gap-6 mt-6 flex-wrap">
            {order.order_details.map((detail: any, index: number) => (
              <div
                key={index}
                className="border p-4 max-sm:p-2 rounded-lg flex flex-col sm:flex-row items-center gap-6 max-sm:gap-2 bg-gray-100 dark:bg-zinc-900 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
              >
                <img
                  src={resolveImageUrl(detail?.product?.images?.[0])}
                  alt={detail.product.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-md"
                />
                <div className="text-center sm:text-left">
                  <h4 className="font-medium text-gray-900 dark:text-gray-200">
                    {detail.product.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Quantity: {detail.quantity}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Price: $
                    {(
                      detail.product.price -
                      (detail.product.price *
                        detail.product?.discount?.percent || 0) /
                        100
                    ).toFixed(2)}
                  </p>

                  {detail.product.discount?.percent && (
                    <p className="text-red-500 text-sm mt-2">
                      Discount: {detail.product.discount.percent}% OFF
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(Order);
