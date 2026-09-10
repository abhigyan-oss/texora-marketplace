import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  // If no order data exists
  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Package
            size={48}
            className="mx-auto text-slate-400"
          />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            No order found
          </h1>

          <p className="mt-2 text-slate-500">
            We couldn't find your order details.
          </p>

          <button
            onClick={() => navigate("/marketplace")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Explore Marketplace
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const orderId = order._id || order.id || "N/A";

  const createdDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : new Date().toLocaleDateString("en-IN");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-16">

        {/* Success Icon */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={48} />
          </div>

          <h1 className="mt-6 text-4xl font-bold text-slate-900">
            Order Placed Successfully!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
            Thank you for your order. Your supplier will review
            and process your request shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">

            <div>
              <p className="text-sm text-slate-400">
                Order ID
              </p>

              <p className="mt-1 font-bold text-slate-900">
                #{orderId}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-sm text-slate-400">
                Order Date
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {createdDate}
              </p>
            </div>

          </div>

          {/* Status */}
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-amber-50 px-5 py-4">

            <div>
              <p className="font-semibold text-slate-900">
                Order Status
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your order has been received.
              </p>
            </div>

            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
              {order.status || "Pending"}
            </span>

          </div>

          {/* Items */}
          <div className="mt-8">

            <h2 className="text-xl font-bold text-slate-900">
              Order Items
            </h2>

            <div className="mt-5 space-y-4">

              {order.items?.map((item: any, index: number) => (
                <div
                  key={item._id || item.product || index}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
                >

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100">
                      <Package
                        size={24}
                        className="text-slate-400"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.quantity} meters × ₹
                      {Number(item.price).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <p className="font-bold text-slate-900">
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toLocaleString("en-IN")}
                  </p>

                </div>
              ))}

            </div>

          </div>

          {/* Total */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">

            <span className="text-lg font-bold text-slate-900">
              Total Amount
            </span>

            <span className="text-2xl font-bold text-indigo-600">
              ₹{Number(order.total || 0).toLocaleString("en-IN")}
            </span>

          </div>

        </div>

        {/* Next Steps */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">

          <Link
            to="/marketplace"
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700"
          >
            View My Orders
            <ArrowRight size={20} />
          </Link>

        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;