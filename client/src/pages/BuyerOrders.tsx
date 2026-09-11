import { useEffect, useState } from "react";
import {
  Package,
  Clock3,
  CheckCircle2,
  Truck,
  Loader2,
  ShoppingBag,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { API_URL } from "../config/api";


interface OrderItem {
  _id?: string;
  name?: string;
  image?: string;
  price: number;
  quantity: number;
  product?: {
    name?: string;
    images?: string[];
  };
}

interface Order {
  _id: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  shippingAddress?: {
    fullName?: string;
    city?: string;
    state?: string;
  };
}

const BuyerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in user
  const user = JSON.parse(
    localStorage.getItem("texora-user") || "null"
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user) {
        throw new Error("Please login to view your orders");
      }

      const userId = user.id || user._id;

      if (!userId) {
        throw new Error("User information is missing. Please login again.");
      }

      const response = await fetch(
        `${API_URL}/orders/buyer/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch buyer orders:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          color: "bg-amber-50 text-amber-600",
          icon: <Clock3 size={18} />,
          message: "Your order is waiting for supplier confirmation",
        };

      case "Accepted":
        return {
          color: "bg-indigo-50 text-indigo-600",
          icon: <CheckCircle2 size={18} />,
          message: "Supplier has accepted your order",
        };

      case "Preparing":
        return {
          color: "bg-blue-50 text-blue-600",
          icon: <Package size={18} />,
          message: "Your order is being prepared",
        };

      case "Ready for Dispatch":
        return {
          color: "bg-purple-50 text-purple-600",
          icon: <Truck size={18} />,
          message: "Your order is ready for dispatch",
        };

      case "Completed":
        return {
          color: "bg-emerald-50 text-emerald-600",
          icon: <CheckCircle2 size={18} />,
          message: "Your order has been completed",
        };

      default:
        return {
          color: "bg-slate-100 text-slate-600",
          icon: <Clock3 size={18} />,
          message: "Order status unavailable",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <Loader2
          size={45}
          className="animate-spin text-indigo-600"
        />

        <p className="mt-5 text-slate-500">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Buyer Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              My Orders
            </h1>

            <p className="mt-3 text-slate-600">
              Track and manage your marketplace orders.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-10 rounded-3xl border border-red-100 bg-red-50 py-16 text-center">

            <AlertTriangle
              size={42}
              className="mx-auto text-red-500"
            />

            <p className="mt-4 font-semibold text-red-600">
              {error}
            </p>

            <button
              onClick={fetchOrders}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Empty Orders */}
        {!error && orders.length === 0 && (

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white py-24 text-center">

            <ShoppingBag
              size={55}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No orders yet
            </h2>

            <p className="mt-2 text-slate-500">
              Start exploring products and place your first order.
            </p>

          </div>

        )}

        {/* Orders */}
        {!error && orders.length > 0 && (

          <div className="mt-10 space-y-6">

            {orders.map((order) => {

              const status = getStatusConfig(order.status);

              return (

                <div
                  key={order._id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
                >

                  {/* Order Header */}
                  <div className="flex flex-col justify-between gap-5 border-b border-slate-100 bg-slate-50 p-6 md:flex-row md:items-center">

                    <div>

                      <div className="flex items-center gap-3">

                        <Package
                          size={22}
                          className="text-indigo-600"
                        />

                        <h2 className="text-xl font-bold text-slate-900">
                          Order #
                          {order._id
                            ?.slice(-6)
                            .toUpperCase()}
                        </h2>

                      </div>

                      <p className="mt-2 text-sm text-slate-500">

                        Ordered on{" "}

                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "Recently"}

                      </p>

                    </div>

                    {/* Status */}
                    <div
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.color}`}
                    >

                      {status.icon}

                      {order.status}

                    </div>

                  </div>

                  {/* Products */}
                  <div className="p-6">

                    <div className="space-y-4">

                      {order.items?.map(
                        (item, index) => (

                          <div
                            key={item._id || index}
                            className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
                          >

                            <div className="flex items-center gap-4">

                              {item.image ||
                              item.product?.images?.[0] ? (

                                <img
                                  src={
                                    item.image ||
                                    item.product?.images?.[0]
                                  }
                                  alt={
                                    item.name ||
                                    item.product?.name ||
                                    "Product"
                                  }
                                  className="h-16 w-16 rounded-xl object-cover"
                                />

                              ) : (

                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100">

                                  <Package
                                    size={22}
                                    className="text-slate-400"
                                  />

                                </div>

                              )}

                              <div>

                                <h3 className="font-semibold text-slate-900">

                                  {item.name ||
                                    item.product?.name ||
                                    "Product"}

                                </h3>

                                <p className="mt-1 text-sm text-slate-500">

                                  Quantity: {item.quantity}

                                </p>

                              </div>

                            </div>

                            <p className="font-bold text-slate-900">

                              ₹
                              {(
                                Number(item.price || 0) *
                                Number(item.quantity || 0)
                              ).toLocaleString("en-IN")}

                            </p>

                          </div>

                        )
                      )}

                    </div>

                    {/* Status Message */}
                    <div className="mt-6 rounded-2xl bg-slate-50 p-4">

                      <p className="text-sm text-slate-500">
                        Order Status
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {status.message}
                      </p>

                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex flex-col justify-between gap-5 border-t border-slate-100 pt-6 md:flex-row md:items-center">

                      <div>

                        <p className="text-sm text-slate-500">
                          Delivery Address
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">

                          {order.shippingAddress?.fullName ||
                            "Not available"}

                        </p>

                        <p className="text-sm text-slate-500">

                          {order.shippingAddress?.city || ""}
                          {order.shippingAddress?.city &&
                          order.shippingAddress?.state
                            ? ", "
                            : ""}
                          {order.shippingAddress?.state || ""}

                        </p>

                      </div>

                      <div className="text-left md:text-right">

                        <p className="text-sm text-slate-500">
                          Total Amount
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">

                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString("en-IN")}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>
    </div>
  );
};

export default BuyerOrders;
