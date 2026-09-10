import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  Loader2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

interface Product {
  _id?: string;
  name?: string;
  images?: string[];
  supplier?: string;
}

interface OrderItem {
  _id?: string;
  product?: Product;
  name?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Buyer {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface ShippingAddress {
  fullName?: string;
  company?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface Order {
  _id: string;
  buyer?: Buyer;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  total: number;
  status: string;
  createdAt?: string;
}

const SupplierOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("texora-token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/orders/supplier/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch supplier orders:", error);

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

  const updateOrderStatus = async (
    orderId: string,
    status: string
  ) => {
    try {
      setUpdatingId(orderId);

      const token = localStorage.getItem("texora-token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/orders/${orderId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order status"
        );
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Update order status error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update order"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-600";

      case "Preparing":
        return "bg-blue-50 text-blue-600";

      case "Accepted":
        return "bg-indigo-50 text-indigo-600";

      case "Ready for Dispatch":
        return "bg-purple-50 text-purple-600";

      case "Pending":
        return "bg-amber-50 text-amber-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getNextStatus = (status: string) => {
    switch (status) {
      case "Pending":
        return "Accepted";

      case "Accepted":
        return "Preparing";

      case "Preparing":
        return "Ready for Dispatch";

      case "Ready for Dispatch":
        return "Completed";

      default:
        return null;
    }
  };

  const getNextButtonText = (status: string) => {
    switch (status) {
      case "Pending":
        return "Accept Order";

      case "Accepted":
        return "Start Preparing";

      case "Preparing":
        return "Ready to Dispatch";

      case "Ready for Dispatch":
        return "Mark Completed";

      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Back Button */}
        <Link
          to="/supplier/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Supplier Panel
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Manage Orders
            </h1>

            <p className="mt-3 text-slate-600">
              Review incoming orders and update their status.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />

            Refresh Orders
          </button>
        </div>

        {/* Summary Cards */}
        {!loading && !error && (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* Total Orders */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Orders
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {orders.length}
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-3">
                  <ShoppingBag
                    size={24}
                    className="text-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Pending Orders
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {
                      orders.filter(
                        (order) => order.status === "Pending"
                      ).length
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-3">
                  <Clock3
                    size={24}
                    className="text-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Completed Orders */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Completed Orders
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {
                      orders.filter(
                        (order) => order.status === "Completed"
                      ).length
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3">
                  <CheckCircle2
                    size={24}
                    className="text-emerald-500"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2
              size={45}
              className="animate-spin text-indigo-600"
            />

            <p className="mt-5 text-slate-500">
              Loading orders...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-3xl border border-red-100 bg-red-50 py-16 text-center">
            <p className="font-semibold text-red-600">
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

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white py-20 text-center shadow-sm">
            <ShoppingBag
              size={50}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No orders yet
            </h2>

            <p className="mt-2 text-slate-500">
              Buyer orders for your products will appear here.
            </p>

            <Link
              to="/supplier/products/new"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Add Product
            </Link>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="mt-10 space-y-5">

            {orders.map((order) => {
              const nextStatus = getNextStatus(order.status);

              return (
                <div
                  key={order._id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >

                  {/* Top Section */}
                  <div className="flex flex-col justify-between gap-5 md:flex-row">

                    <div>
                      <div className="flex flex-wrap items-center gap-3">

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

                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

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

                      <p className="mt-2 text-sm text-slate-600">
                        Buyer:{" "}
                        <span className="font-semibold text-slate-800">
                          {order.buyer?.name ||
                            "Unknown Buyer"}
                        </span>
                      </p>

                      {order.buyer?.email && (
                        <p className="mt-1 text-sm text-slate-500">
                          {order.buyer.email}
                        </p>
                      )}
                    </div>

                    {/* Status Icon */}
                    <div className="flex items-start">

                      {order.status === "Completed" ? (
                        <CheckCircle2
                          size={24}
                          className="text-emerald-500"
                        />
                      ) : (
                        <Clock3
                          size={24}
                          className="text-amber-500"
                        />
                      )}

                    </div>
                  </div>

                  {/* Products */}
                  <div className="mt-6 space-y-3">

                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                      Ordered Products
                    </p>

                    {order.items?.map(
                      (item, index) => (
                        <div
                          key={item._id || index}
                          className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                        >

                          <div className="flex items-center gap-4">

                            {/* Product Image */}
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
                                className="h-14 w-14 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-200">
                                <Package
                                  size={20}
                                  className="text-slate-400"
                                />
                              </div>
                            )}

                            {/* Product Details */}
                            <div>
                              <p className="font-semibold text-slate-900">
                                {item.name ||
                                  item.product?.name ||
                                  "Product"}
                              </p>

                              <p className="text-sm text-slate-500">
                                Quantity: {item.quantity}
                              </p>

                              <p className="text-xs text-slate-400">
                                ₹
                                {Number(
                                  item.price || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}{" "}
                                each
                              </p>
                            </div>
                          </div>

                          {/* Item Total */}
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

                  {/* Footer */}
                  <div className="mt-6 flex flex-col justify-between gap-5 border-t border-slate-200 pt-5 md:flex-row md:items-center">

                    {/* Shipping */}
                    <div>
                      <p className="text-sm text-slate-500">
                        Delivery To
                      </p>

                      <p className="font-semibold text-slate-900">
                        {order.shippingAddress?.fullName ||
                          "Customer"}
                      </p>

                      {order.shippingAddress?.address && (
                        <p className="mt-1 text-sm text-slate-500">
                          {order.shippingAddress.address}
                        </p>
                      )}

                      <p className="text-sm text-slate-500">
                        {order.shippingAddress?.city ||
                          "City"}

                        {order.shippingAddress?.state &&
                          `, ${order.shippingAddress.state}`}

                        {order.shippingAddress?.pincode &&
                          ` - ${order.shippingAddress.pincode}`}
                      </p>
                    </div>

                    {/* Total + Action */}
                    <div className="flex flex-wrap items-center gap-4">

                      <div>
                        <p className="text-sm text-slate-500">
                          Order Total
                        </p>

                        <p className="text-2xl font-bold text-slate-900">
                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      {/* Next Status Button */}
                      {nextStatus && (
                        <button
                          disabled={
                            updatingId === order._id
                          }
                          onClick={() =>
                            updateOrderStatus(
                              order._id,
                              nextStatus
                            )
                          }
                          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingId === order._id
                            ? "Updating..."
                            : getNextButtonText(
                                order.status
                              )}
                        </button>
                      )}

                      {/* Completed */}
                      {order.status === "Completed" && (
                        <span className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-600">
                          <CheckCircle2 size={18} />
                          Completed
                        </span>
                      )}

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

export default SupplierOrders;