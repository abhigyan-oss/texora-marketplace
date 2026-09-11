import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  User,
  MapPin,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { API_URL } from "../config/api";


interface Order {
  _id: string;
  total: number;
  status: string;
  createdAt?: string;
  items?: {
    product?: string;
    name?: string;
    price?: number;
    quantity?: number;
    image?: string;
  }[];
}

interface UserData {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

const BuyerDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user: UserData | null = JSON.parse(
    localStorage.getItem("texora-user") || "null"
  );

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const userId = user.id || user._id;
      const token = localStorage.getItem("texora-token");

      if (!userId) {
        throw new Error("User information is missing");
      }

      if (!token) {
        throw new Error("Please login again");
      }

      const response = await fetch(
        `${API_URL}/orders/buyer/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
      console.error("Failed to fetch orders:", error);

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

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const totalSpent = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Buyer Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Welcome back{" "}
              {user?.name?.split(" ")[0] || ""} 👋
            </h1>

            <p className="mt-3 text-slate-600">
              Track your orders and manage your marketplace activity.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              <ShoppingBag size={18} />
              Browse Fabrics
            </Link>

          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Orders */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Package size={22} />
              </div>

              <span className="text-3xl font-bold text-slate-900">
                {totalOrders}
              </span>
            </div>

            <p className="mt-5 font-semibold text-slate-900">
              Total Orders
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Orders placed on Texora
            </p>
          </div>

          {/* Pending Orders */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={22} />
              </div>

              <span className="text-3xl font-bold text-slate-900">
                {pendingOrders}
              </span>
            </div>

            <p className="mt-5 font-semibold text-slate-900">
              Pending Orders
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Waiting for supplier response
            </p>
          </div>

          {/* Completed Orders */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>

              <span className="text-3xl font-bold text-slate-900">
                {completedOrders}
              </span>
            </div>

            <p className="mt-5 font-semibold text-slate-900">
              Completed
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Successfully fulfilled orders
            </p>
          </div>

          {/* Total Spending */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-lg font-bold text-purple-600">
                ₹
              </div>

              <span className="text-xl font-bold text-slate-900 sm:text-2xl">
                ₹{totalSpent.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="mt-5 font-semibold text-slate-900">
              Total Spending
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total marketplace purchases
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* Recent Orders */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Orders
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest marketplace orders
                </p>
              </div>

              <Package
                className="text-indigo-600"
                size={22}
              />
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">

                <Loader2
                  size={35}
                  className="animate-spin text-indigo-600"
                />

                <p className="mt-4 text-sm text-slate-500">
                  Loading your orders...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="py-12 text-center">

                <p className="font-medium text-red-500">
                  {error}
                </p>

                <button
                  onClick={fetchOrders}
                  className="mt-4 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading &&
              !error &&
              orders.length === 0 && (
                <div className="py-16 text-center">

                  <ShoppingBag
                    size={45}
                    className="mx-auto text-slate-300"
                  />

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    No orders yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Start exploring fabrics and place your
                    first order.
                  </p>

                  <Link
                    to="/marketplace"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Explore Marketplace
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}

            {/* Orders List */}
            {!loading &&
              !error &&
              orders.length > 0 && (
                <div className="mt-6 space-y-4">

                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order._id}
                      className="rounded-2xl border border-slate-100 p-5 transition hover:border-indigo-200 hover:bg-slate-50"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* Order Info */}
                        <div>

                          <div className="flex flex-wrap items-center gap-3">

                            <h3 className="font-bold text-slate-900">
                              Order #
                              {order._id
                                .slice(-6)
                                .toUpperCase()}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-slate-500">
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Recently"}
                          </p>

                          <p className="mt-2 text-sm text-slate-600">
                            {order.items?.length || 0} product(s)
                          </p>
                        </div>

                        {/* Order Total */}
                        <div className="text-left sm:text-right">

                          <p className="text-sm text-slate-400">
                            Order Total
                          </p>

                          <p className="mt-1 text-xl font-bold text-slate-900">
                            ₹
                            {Number(
                              order.total || 0
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* View All Orders */}
            {!loading &&
              !error &&
              orders.length > 0 && (
                <Link
                  to="/buyer/orders"
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View All Orders
                  <ArrowRight size={16} />
                </Link>
              )}
          </div>

          {/* Buyer Profile */}
          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6">

            <div className="flex items-center gap-3">

              <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
                <User size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  {user?.name || "Buyer"}
                </h2>

                <p className="text-sm text-slate-500">
                  Marketplace Account
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="mt-6 border-t border-slate-100 pt-6">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </p>

              <p className="mt-2 break-all text-sm font-medium text-slate-900">
                {user?.email || "Not available"}
              </p>
            </div>

            {/* Account Type */}
            <div className="mt-6">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Account Type
              </p>

              <p className="mt-2 font-semibold capitalize text-slate-900">
                {user?.role || "Buyer"}
              </p>
            </div>

            {/* Location */}
            <div className="mt-6">

              <div className="flex items-center gap-2 text-slate-500">

                <MapPin size={16} />

                <span className="text-sm">
                  India
                </span>
              </div>
            </div>

            {/* Marketplace Button */}
            <Link
              to="/marketplace"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Explore Marketplace
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
