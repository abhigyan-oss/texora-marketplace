import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  PackagePlus,
  ShoppingBag,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { API_URL } from "../config/api";


const SupplierDashboard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("texora-token");

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        productsResponse,
        ordersResponse,
      ] = await Promise.all([
        fetch(
          `${API_URL}/products/my-products`,
          { headers }
        ),
        fetch(
          `${API_URL}/orders/supplier/my-orders`,
          { headers }
        ),
      ]);

      const productsData =
        await productsResponse.json();

      const ordersData =
        await ordersResponse.json();

      if (!productsResponse.ok) {
        throw new Error(
          productsData.message ||
            "Failed to fetch products"
        );
      }

      if (!ordersResponse.ok) {
        throw new Error(
          ordersData.message ||
            "Failed to fetch orders"
        );
      }

      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);

    } catch (error) {
      console.error(
        "Failed to fetch dashboard data:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => Number(product.stock) > 0
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const inventoryAlerts = products.filter(
    (product) =>
      Number(product.stock) >= 0 &&
      Number(product.stock) <= 50
  ).length;

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">

          <Loader2
            size={42}
            className="mx-auto animate-spin text-indigo-600"
          />

          <p className="mt-4 font-medium text-slate-600">
            Loading dashboard...
          </p>

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="max-w-md rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">

          <AlertTriangle
            size={45}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to load dashboard
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={fetchDashboardData}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Supplier Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Manage your marketplace business.
            </h1>

            <p className="mt-3 text-slate-600">
              Monitor products, inventory and incoming customer orders.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <Link
              to="/supplier/products/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              <PackagePlus size={18} />
              Add Product
            </Link>

          </div>

        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Boxes size={22} />
              </div>

              <span className="text-3xl font-bold text-slate-900">
                {totalProducts}
              </span>

            </div>

            <p className="mt-5 font-semibold text-slate-900">
              Total Products
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Products in your catalog
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>

              <span className="text-3xl font-bold text-slate-900">
                {activeProducts}
              </span>

            </div>

            <p className="mt-5 font-semibold text-slate-900">
              Active Products
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Currently available
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock3 size={22} />
              </div>

              <span className="text-3xl font-bold text-slate-900">
                {pendingOrders}
              </span>

            </div>

            <p className="mt-5 font-semibold text-slate-900">
              Pending Orders
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Awaiting your response
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-center justify-between">

              <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
                <AlertTriangle size={22} />
              </div>

              <span className="text-3xl font-bold text-slate-900">
                {inventoryAlerts}
              </span>

            </div>

            <p className="mt-5 font-semibold text-slate-900">
              Inventory Alerts
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Products needing attention
            </p>

          </div>

        </div>

        {/* Main Content */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* Recent Orders */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Recent Orders
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest orders received from buyers
                </p>

              </div>

              <ShoppingBag
                size={22}
                className="text-indigo-600"
              />

            </div>

            {orders.length === 0 ? (

              <div className="py-16 text-center">

                <ShoppingBag
                  size={44}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  No orders yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Incoming buyer orders will appear here.
                </p>

              </div>

            ) : (

              <div className="mt-6 space-y-4">

                {orders.slice(0, 5).map((order: any) => (

                  <div
                    key={order._id}
                    className="rounded-2xl border border-slate-100 p-5 transition hover:border-indigo-200 hover:bg-slate-50"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="font-bold text-slate-900">
                            #{order._id?.slice(-6).toUpperCase()}
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
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recently"}

                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          {order.items?.length || 0} product(s)
                        </p>

                      </div>

                      <div className="text-left sm:text-right">

                        <p className="text-sm text-slate-400">
                          Order Total
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-900">
                          ₹{Number(
                            order.total || 0
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>
            )}

            <Link
              to="/supplier/orders"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View All Orders
              <ArrowRight size={16} />
            </Link>

          </div>

          {/* Quick Actions */}
          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-6 space-y-3">

              <Link
                to="/supplier/products/new"
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
              >

                <div>

                  <p className="font-semibold text-slate-900">
                    Add New Product
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Create a new fabric listing
                  </p>

                </div>

                <ArrowRight size={18} />

              </Link>

              <Link
                to="/supplier/inventory"
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
              >

                <div>

                  <p className="font-semibold text-slate-900">
                    Manage Inventory
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Update stock and availability
                  </p>

                </div>

                <ArrowRight size={18} />

              </Link>

              <Link
                to="/supplier/orders"
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
              >

                <div>

                  <p className="font-semibold text-slate-900">
                    Manage Orders
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Review and update order status
                  </p>

                </div>

                <ArrowRight size={18} />

              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SupplierDashboard;
