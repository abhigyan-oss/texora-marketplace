import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/productImages";
import { API_URL } from "../config/api";

interface Product {
  _id: string;
  name: string;
  category: string;
  material: string;
  color: string;
  description: string;
  price: number;
  minimumOrder: number;
  stock: number;
  images: string[];
  supplier?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  location?: string;
  colors?: string[];
  specifications?: {
    composition?: string;
    weave?: string;
    width?: string;
    gsm?: string;
  };
}


const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] =
    useState(false);

  // ==========================================
  // FETCH PRODUCT
  // ==========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        if (!data.product) {
          throw new Error("Product not found");
        }

        setProduct(data.product);

        setQuantity(
          Math.max(
            Number(data.product.minimumOrder) || 1,
            1
          )
        );
      } catch (err) {
        console.error(
          "Failed to fetch product:",
          err
        );

        setError(
          "Unable to load this product."
        );

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-slate-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-500">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Product not found
          </h1>

          <p className="mt-2 text-slate-500">
            {error ||
              "This product may have been removed."}
          </p>

          <Link
            to="/marketplace"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={18} />
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // PRODUCT DATA
  // ==========================================

  const minimumOrder = Math.max(
    Number(product.minimumOrder) || 1,
    1
  );

  const totalPrice =
    Number(product.price) * quantity;

  /*
   * IMPORTANT:
   *
   * Product Details uses the SAME image
   * mapping used by:
   *
   * - Texora Homepage
   * - Featured Collection
   * - Marketplace
   * - AI Assistant
   *
   * We intentionally DO NOT use:
   *
   * product.images[0]
   *
   * because those MongoDB images may be
   * different from the local Texora images.
   */

  const productImage = getProductImage(
    product.name,
    product.category
  );

  // ==========================================
  // QUANTITY CONTROLS
  // ==========================================

  const increaseQuantity = () => {
    if (
      quantity + minimumOrder <=
      product.stock
    ) {
      setQuantity(
        (prev) => prev + minimumOrder
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > minimumOrder) {
      setQuantity((prev) =>
        Math.max(
          minimumOrder,
          prev - minimumOrder
        )
      );
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      return;
    }

    addToCart(
      {
        id: product._id,
        name: product.name,
        price: Number(product.price),

        // Use exactly the same mapped image
        // displayed on this page.
        images: [productImage],

        supplier:
          product.supplier?.name ||
          "Supplier",

        category: product.category,

        minimumOrder,

        stock: product.stock,

        unit: "meter",
      },
      quantity
    );

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2500);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* ========================================
            BACK BUTTON
        ======================================== */}

        <Link
          to="/marketplace"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to marketplace
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">

          {/* ======================================
              IMAGE SECTION
          ====================================== */}

          <div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src={productImage}
                alt={product.name}
                className="h-[320px] w-full object-cover sm:h-[520px]"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            </div>

            {/* Trust information */}

            <div className="mt-5 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-400">
                  Supplier
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {product.supplier?.name ||
                    "Verified Supplier"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-400">
                  Availability
                </p>

                <p
                  className={`mt-1 font-semibold ${
                    product.stock > 0
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} meters`
                    : "Out of stock"}
                </p>
              </div>

            </div>
          </div>

          {/* ======================================
              DETAILS SECTION
          ====================================== */}

          <div>

            {/* Category + verification */}

            <div className="flex flex-wrap items-center gap-3">

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
                {product.category}
              </span>

              {product.stock > 0 && (
                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  <CheckCircle2 size={16} />
                  In stock
                </span>
              )}

            </div>

            {/* Product name */}

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {/* Supplier */}

            <div className="mt-4 flex items-center gap-2 text-slate-500">
              <MapPin size={18} />

              <span>
                {product.supplier?.name ||
                  "Verified Supplier"}

                {product.location &&
                  ` · ${product.location}`}
              </span>
            </div>

            {/* Description */}

            <p className="mt-7 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {product.description}
            </p>

            {/* ====================================
                SPECIFICATIONS
            ==================================== */}

            <div className="mt-8">

              <h2 className="text-lg font-bold text-slate-900">
                Product specifications
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">

                {/* Material */}

                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <p className="text-sm text-slate-400">
                    Material
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    {product.material ||
                      "Not specified"}
                  </p>
                </div>

                {/* Color */}

                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <p className="text-sm text-slate-400">
                    Color
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    {product.color ||
                      "Not specified"}
                  </p>
                </div>

                {/* MOQ */}

                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <p className="text-sm text-slate-400">
                    Minimum order
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    {minimumOrder} meters
                  </p>
                </div>

                {/* Price */}

                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <p className="text-sm text-slate-400">
                    Price
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString(
                      "en-IN"
                    )}
                    /meter
                  </p>
                </div>

              </div>
            </div>

            {/* ====================================
                ADDITIONAL SPECIFICATIONS
            ==================================== */}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">

              <div className="grid gap-5 sm:grid-cols-3">

                {/* Composition */}

                <div>
                  <p className="text-xs text-slate-400">
                    Composition
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {product
                      .specifications
                      ?.composition ||
                      product.material ||
                      "Not specified"}
                  </p>
                </div>

                {/* Weave */}

                <div>
                  <p className="text-xs text-slate-400">
                    Weave
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {product
                      .specifications
                      ?.weave ||
                      "Not specified"}
                  </p>
                </div>

                {/* Width */}

                <div>
                  <p className="text-xs text-slate-400">
                    Width
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {product
                      .specifications
                      ?.width ||
                      "Not specified"}
                  </p>
                </div>

              </div>
            </div>

            {/* ====================================
                COLORS
            ==================================== */}

            {product.colors &&
              product.colors.length > 0 && (

                <div className="mt-7">

                  <h2 className="font-bold text-slate-900">
                    Available colors
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-3">

                    {product.colors.map(
                      (color) => (
                        <span
                          key={color}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                        >
                          {color}
                        </span>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* ====================================
                PURCHASE CARD
            ==================================== */}

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              {/* Price */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>
                  <p className="text-sm text-slate-400">
                    Price per meter
                  </p>

                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString(
                      "en-IN"
                    )}

                    <span className="ml-1 text-sm font-medium text-slate-400">
                      / meter
                    </span>
                  </p>
                </div>

                {/* Total */}

                <div className="sm:text-right">
                  <p className="text-sm text-slate-400">
                    Estimated total
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    ₹
                    {totalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

              </div>

              {/* =================================
                  QUANTITY
              ================================= */}

              <div className="mt-6 flex items-center justify-between gap-4">

                <div>
                  <p className="font-semibold text-slate-700">
                    Quantity
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Minimum{" "}
                    {minimumOrder} meters
                  </p>
                </div>

                <div className="flex items-center rounded-xl border border-slate-200">

                  {/* Decrease */}

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <=
                      minimumOrder
                    }
                    className="p-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="min-w-[80px] text-center font-semibold">
                    {quantity} m
                  </span>

                  {/* Increase */}

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity +
                        minimumOrder >
                      product.stock
                    }
                    className="p-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>

                </div>
              </div>

              {/* =================================
                  ADD TO CART
              ================================= */}

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={
                  product.stock <= 0
                }
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-white transition ${
                  product.stock <= 0
                    ? "cursor-not-allowed bg-slate-400"
                    : addedToCart
                    ? "bg-emerald-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {product.stock <= 0 ? (
                  "Out of stock"
                ) : addedToCart ? (
                  <>
                    <Check size={20} />
                    Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingCart
                      size={20}
                    />
                    Add to cart
                  </>
                )}
              </button>

              {/* =================================
                  VIEW CART
              ================================= */}

              {addedToCart && (
                <Link
                  to="/cart"
                  className="mt-3 flex w-full items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  View Cart
                </Link>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;