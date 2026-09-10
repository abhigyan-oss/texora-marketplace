import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:5000/api";

interface FormData {
  fullName: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= HANDLE INPUT =================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ================= VALIDATION =================

  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "phone",
      "email",
      "address",
      "city",
      "state",
      "pincode",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof FormData].trim()) {
        setError(
          `Please enter your ${
            field === "fullName"
              ? "full name"
              : field
          }`
        );

        return false;
      }
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(formData.phone)) {
      setError(
        "Please enter a valid 10-digit phone number"
      );
      return false;
    }

    const pincodeRegex = /^\d{6}$/;

    if (!pincodeRegex.test(formData.pincode)) {
      setError(
        "Please enter a valid 6-digit pincode"
      );
      return false;
    }

    return true;
  };

  // ================= PLACE ORDER =================

  const handlePlaceOrder = async () => {
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("texora-token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            items: cartItems.map((item) => ({
              product: item.id,
              quantity: Number(item.quantity),
            })),

            shippingAddress: formData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to place order"
        );
      }

      // Clear cart after successful order
      clearCart();

      // Navigate to confirmation
      navigate("/order-confirmation", {
        state: {
          order: data.order,
        },
      });
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while placing your order"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= EMPTY CART =================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingBag
              size={36}
              className="text-gray-500"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h1>

          <p className="text-gray-500 mb-6">
            Add some products before proceeding
            to checkout.
          </p>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <ArrowLeft size={18} />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center">
              <CheckCircle
                className="text-white"
                size={23}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Checkout
              </h1>

              <p className="text-gray-500">
                Review your order and enter shipping
                details
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* SHIPPING FORM */}

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Shipping Information
                  </h2>

                  <p className="text-sm text-gray-500">
                    Where should we deliver your
                    order?
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* FULL NAME */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* COMPANY */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* ADDRESS */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="House number, street, area"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black resize-none"
                  />
                </div>

                {/* CITY */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* STATE */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* PINCODE */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}

          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package size={20} />
                </div>

                <h2 className="text-xl font-bold">
                  Order Summary
                </h2>
              </div>

              {/* ITEMS */}

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag
                            size={20}
                            className="text-gray-400"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>

                      <p className="font-semibold mt-1">
                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>

                  <span>
                    ₹
                    {cartTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>

                  <span>To be calculated</span>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                  <span>Estimated Total</span>

                  <span>
                    ₹
                    {cartTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>

              {/* PLACE ORDER */}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-6 bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                No payment is required for this
                prototype checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;