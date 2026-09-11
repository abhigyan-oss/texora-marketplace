import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { getProductImage } from "../../utils/productImages";

interface Supplier {
  _id: string;
  name?: string;
  email?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category?: string;
  material?: string;
  description?: string;
  unit?: string;

  supplier?: string | Supplier;

  minimumOrder?: number;
  moq?: number;
  stock?: number;
  availability?: string;
}

const API_URL = "http://localhost:5000/api";

const FeaturedProducts = () => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(
          Array.isArray(data.products)
            ? data.products
            : []
        );
      } catch (err) {
        console.error(
          "Failed to fetch featured products:",
          err
        );

        setError(
          "Unable to load featured products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getSupplierName = (
    supplier?: string | Supplier
  ) => {
    if (!supplier) {
      return "Verified Supplier";
    }

    if (typeof supplier === "string") {
      return supplier;
    }

    return (
      supplier.name ||
      supplier.email ||
      "Verified Supplier"
    );
  };

  const handleQuickAdd = (
    product: Product
  ) => {
    const minimumOrder =
      product.minimumOrder ??
      product.moq ??
      1;

    const stock =
      product.stock ?? Infinity;

    if (stock <= 0) {
      return;
    }

    const quantity = Math.min(
      minimumOrder,
      stock
    );

    const productImage = getProductImage(
      product.name,
      product.category
    );

    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        images: [productImage],
        unit: product.unit,

        supplier:
          getSupplierName(product.supplier),

        category: product.category,

        minimumOrder,
        stock: product.stock,
      },
      quantity
    );
  };

  /* --------------------------------
     LOADING STATE
  -------------------------------- */

  if (loading) {
    return (
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" />

              <p className="text-sm font-medium text-slate-500">
                Loading featured products...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* --------------------------------
     ERROR STATE
  -------------------------------- */

  if (error) {
    return (
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <p className="font-medium text-red-600">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* --------------------------------
     EMPTY STATE
  -------------------------------- */

  if (products.length === 0) {
    return (
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              No featured products available.
            </p>

            <Link
              to="/marketplace"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              Browse Marketplace
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* --------------------------------
     MAIN
  -------------------------------- */

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ============================
            SECTION HEADER
        ============================ */}

        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-purple-600" />

              <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
                Featured Collection
              </span>
            </div>

            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Quality fabrics from{" "}
              <span className="text-purple-600">
                trusted suppliers
              </span>
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
              Discover premium textile materials
              from verified suppliers across India.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
            data-cursor="interactive"
          >
            View All

            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* ============================
            PRODUCT GRID
        ============================ */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {products
            .slice(0, 4)
            .map((product) => {

              /*
               * IMPORTANT:
               * Use the same image mapping as Marketplace
               * and AI Assistant.
               */
              const image = getProductImage(
                product.name,
                product.category
              );

              const minimumOrder =
                product.minimumOrder ??
                product.moq ??
                1;

              const stock =
                product.stock ?? 0;

              const isOutOfStock =
                stock <= 0;

              const supplierName =
                getSupplierName(
                  product.supplier
                );

              return (
                <article
                  key={product._id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl"
                >

                  {/* ========================
                      PRODUCT IMAGE
                  ======================== */}

                  <Link
                    to={`/products/${product._id}`}
                    className="relative block overflow-hidden"
                    data-cursor="interactive"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                          No Image Available
                        </div>
                      )}

                    </div>

                    {/* CATEGORY */}

                    {product.category && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur-sm">
                        {product.category}
                      </span>
                    )}

                    {/* STOCK */}

                    {isOutOfStock ? (
                      <span className="absolute right-4 top-4 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="absolute right-4 top-4 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 shadow-sm">
                        In Stock
                      </span>
                    )}
                  </Link>

                  {/* ========================
                      PRODUCT CONTENT
                  ======================== */}

                  <div className="flex flex-1 flex-col p-5">

                    {/* MATERIAL */}

                    {product.material && (
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-600">
                        {product.material}
                      </p>
                    )}

                    {/* PRODUCT NAME */}

                    <Link
                      to={`/products/${product._id}`}
                      className="mb-2 block"
                      data-cursor="interactive"
                    >
                      <h3 className="overflow-hidden text-lg font-bold text-slate-900 transition-colors group-hover:text-purple-600">
                        {product.name}
                      </h3>
                    </Link>

                    {/* DESCRIPTION */}

                    {product.description && (
                      <p
                        className="mb-4 overflow-hidden text-sm leading-6 text-slate-500"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient:
                            "vertical",
                        }}
                      >
                        {product.description}
                      </p>
                    )}

                    {/* SUPPLIER */}

                    <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin
                        size={14}
                        className="shrink-0 text-slate-400"
                      />

                      <span className="truncate">
                        {supplierName}
                      </span>
                    </div>

                    {/* PRICE */}

                    <div className="mb-2">
                      <span className="text-2xl font-bold text-slate-900">
                        ₹{product.price}
                      </span>

                      {product.unit && (
                        <span className="ml-1 text-sm text-slate-400">
                          / {product.unit}
                        </span>
                      )}
                    </div>

                    {/* MOQ */}

                    <div className="mb-5 flex items-center gap-2 text-xs text-slate-500">
                      <Package
                        size={14}
                        className="shrink-0"
                      />

                      <span>
                        MOQ:{" "}
                        <strong className="font-semibold text-slate-700">
                          {minimumOrder}
                          {product.unit
                            ? ` ${product.unit}`
                            : " units"}
                        </strong>
                      </span>
                    </div>

                    {/* ========================
                        BUTTONS
                    ======================== */}

                    <div className="mt-auto flex gap-2">

                      {/* VIEW DETAILS */}

                      <Link
                        to={`/products/${product._id}`}
                        className="flex flex-1 items-center justify-center rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                        data-cursor="interactive"
                      >
                        View Details
                      </Link>

                      {/* QUICK ADD */}

                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() =>
                          handleQuickAdd(
                            product
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                        data-cursor="interactive"
                        title={
                          isOutOfStock
                            ? "Out of stock"
                            : `Add ${minimumOrder} ${product.unit || "units"}`
                        }
                      >
                        <ShoppingCart
                          size={15}
                        />

                        <span className="hidden xl:inline">
                          Quick Add
                        </span>
                      </button>

                    </div>
                  </div>
                </article>
              );
            })}
        </div>

        {/* ============================
            BOTTOM CTA
        ============================ */}

        <div className="mt-10 text-center">
          <Link
            to="/marketplace"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-purple-600"
            data-cursor="interactive"
          >
            Explore all fabrics

            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;