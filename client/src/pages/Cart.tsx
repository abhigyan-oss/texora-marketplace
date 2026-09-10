import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  PackageCheck,
} from "lucide-react";

import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-xl text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <ShoppingBag size={36} />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            Explore our marketplace and find the
            perfect fabrics for your business.
          </p>

          <Link
            to="/marketplace"
            className="mt-7 inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Explore Marketplace
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* Back */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Continue shopping
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Shopping Cart
            </h1>

            <p className="mt-2 text-slate-500">
              Review your fabric requirements before checkout.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <PackageCheck size={18} />
            {cartItems.length}{" "}
            {cartItems.length === 1
              ? "product"
              : "products"}
          </div>

        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* ================= CART ITEMS ================= */}
          <div className="space-y-5">

            {cartItems.map((item) => {

              const minimumOrder =
                item.minimumOrder ?? 1;

              const stock =
                item.stock ?? Infinity;

              const itemTotal =
                item.price * item.quantity;

              const canDecrease =
                item.quantity > minimumOrder;

              const canIncrease =
                item.quantity + minimumOrder <= stock;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                  <div className="flex flex-col gap-5 sm:flex-row">

                    {/* Product Image */}
                    <Link
                      to={`/products/${item.id}`}
                      className="shrink-0"
                    >
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-40 w-full rounded-2xl object-cover transition hover:opacity-90 sm:h-32 sm:w-40"
                        />
                      ) : (
                        <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-400 sm:h-32 sm:w-40">
                          No image
                        </div>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          {item.category && (
                            <span className="text-sm font-semibold text-indigo-600">
                              {item.category}
                            </span>
                          )}

                          <Link
                            to={`/products/${item.id}`}
                          >
                            <h2 className="mt-1 text-xl font-bold text-slate-900 transition hover:text-indigo-600">
                              {item.name}
                            </h2>
                          </Link>

                          {item.supplier && (
                            <p className="mt-1 text-sm text-slate-500">
                              Supplier: {item.supplier}
                            </p>
                          )}

                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={19} />
                        </button>

                      </div>

                      {/* Bottom */}
                      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                        {/* Quantity */}
                        <div>

                          <p className="text-sm font-semibold text-slate-700">
                            Quantity
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            MOQ: {minimumOrder} meters
                          </p>

                          <div className="mt-3 flex w-fit items-center rounded-xl border border-slate-200">

                            <button
                              type="button"
                              disabled={!canDecrease}
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(
                                    minimumOrder,
                                    item.quantity -
                                      minimumOrder
                                  )
                                )
                              }
                              className="p-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={17} />
                            </button>

                            <span className="min-w-[90px] text-center font-semibold text-slate-800">
                              {item.quantity} m
                            </span>

                            <button
                              type="button"
                              disabled={!canIncrease}
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.min(
                                    stock,
                                    item.quantity +
                                      minimumOrder
                                  )
                                )
                              }
                              className="p-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus size={17} />
                            </button>

                          </div>

                          {stock !== Infinity && (
                            <p className="mt-2 text-xs text-slate-400">
                              {stock} meters available
                            </p>
                          )}

                        </div>

                        {/* Price */}
                        <div className="sm:text-right">

                          <p className="text-sm text-slate-400">
                            ₹
                            {Number(item.price).toLocaleString(
                              "en-IN"
                            )}
                            /meter
                          </p>

                          <p className="mt-1 text-2xl font-bold text-slate-900">
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                      </div>

                    </div>
                  </div>

                </div>
              );
            })}

          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">

            <h2 className="text-xl font-bold text-slate-900">
              Order Summary
            </h2>

            {/* Products */}
            <div className="mt-6 space-y-4 border-b border-slate-100 pb-6">

              <div className="flex justify-between text-slate-600">
                <span>
                  Products
                </span>

                <span>
                  {cartItems.length}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>
                  Total quantity
                </span>

                <span>
                  {cartItems.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}{" "}
                  m
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>
                  Subtotal
                </span>

                <span className="font-semibold text-slate-900">
                  ₹
                  {cartTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>
                  Shipping
                </span>

                <span className="font-medium text-emerald-600">
                  To be calculated
                </span>
              </div>

            </div>

            {/* Total */}
            <div className="mt-6 flex items-center justify-between">

              <span className="text-lg font-bold text-slate-900">
                Estimated Total
              </span>

              <span className="text-2xl font-bold text-slate-900">
                ₹
                {cartTotal.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* Checkout */}
            <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-4 font-semibold text-white transition hover:bg-indigo-700"
            >
              Proceed to Checkout
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              Payment is not required for this prototype.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;