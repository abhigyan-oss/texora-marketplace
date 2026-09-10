import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/productImages";

interface Supplier {
  _id: string;
  name: string;
  email: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  material: string;
  color: string;
  price: number;
  minimumOrder: number;
  stock: number;
  images: string[];
  supplier: Supplier | string;
  unit?: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = "http://localhost:5000/api";

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState("");

  const [searchParams] = useSearchParams();

  const { addToCart } = useCart();

  // ==========================================
  // READ SEARCH FROM URL
  // ==========================================

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";

    setSearch(urlSearch);
    setSelectedCategory("All");
  }, [searchParams]);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

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

        setProducts(data.products || []);
      } catch (err) {
        console.error("Marketplace fetch error:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ==========================================
  // CATEGORY ORDER
  // ==========================================

  const categoryOrder = [
    "Cotton",
    "Silk",
    "Linen",
    "Denim",
    "Rayon",
    "Velvet",
    "Satin",
    "Wool",
  ];

  const categories = [
    "All",
    ...categoryOrder.filter((category) =>
      products.some(
        (product) =>
          product.category?.toLowerCase() === category.toLowerCase()
      )
    ),
  ];

  // ==========================================
  // ADDITIONAL CATEGORIES
  // ==========================================

  const additionalCategories = Array.from(
    new Set(
      products
        .map((product) => product.category)
        .filter(
          (category) =>
            !categoryOrder.some(
              (orderedCategory) =>
                orderedCategory.toLowerCase() === category.toLowerCase()
            )
        )
    )
  );

  const finalCategories = [
    ...categories,
    ...additionalCategories,
  ];

  // ==========================================
  // FILTER + SEARCH + SORT
  // ==========================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // SEARCH
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();

      result = result.filter((product) => {
        const supplierName =
          typeof product.supplier === "string"
            ? product.supplier
            : product.supplier?.name || "";

        const searchableText = `
          ${product.name}
          ${product.description}
          ${product.category}
          ${product.material}
          ${product.color}
          ${supplierName}
        `.toLowerCase();

        // ------------------------------------------
        // SMART CATEGORY SEARCH
        // ------------------------------------------

        const categoryAliases: Record<string, string[]> = {
          technical: [
            "denim",
            "rayon",
            "synthetic",
            "technical",
          ],

          wholesale: [
            "cotton",
            "linen",
            "denim",
            "rayon",
            "velvet",
            "satin",
            "wool",
          ],

          apparel: [
            "cotton",
            "linen",
            "denim",
            "rayon",
            "silk",
            "satin",
          ],

          "home textiles": [
            "linen",
            "velvet",
            "cotton",
          ],
        };

        const aliases = categoryAliases[searchTerm];

        if (aliases) {
          return aliases.some((keyword) =>
            searchableText.includes(keyword)
          );
        }

        return searchableText.includes(searchTerm);
      });
    }

    // CATEGORY
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    // MAX PRICE
    if (maxPrice) {
      const priceLimit = Number(maxPrice);

      if (!Number.isNaN(priceLimit)) {
        result = result.filter(
          (product) => product.price <= priceLimit
        );
      }
    }

    // SORT
    if (sortBy === "low-high") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    maxPrice,
    sortBy,
  ]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setMaxPrice("");
    setSortBy("default");
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = (product: Product) => {
    const minimumOrder =
      Number(product.minimumOrder) || 1;

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
        category: product.category,
        stock: product.stock,
        minimumOrder,
        unit: product.unit || "meter",
        supplier:
          typeof product.supplier === "string"
            ? product.supplier
            : product.supplier?.name,
      },
      minimumOrder
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 font-medium text-slate-600">
            Loading marketplace...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MARKETPLACE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">

          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Marketplace
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Discover quality fabrics.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Explore fabrics from verified suppliers
            across India. Compare materials,
            specifications, pricing and minimum
            order quantities.
          </p>

        </div>
      </section>

      {/* MAIN */}

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* SEARCH + SORT */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* SEARCH */}

          <div className="relative w-full lg:max-w-xl">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search fabrics, materials, suppliers..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
              >
                <X size={18} />
              </button>
            )}

          </div>

          {/* SORT */}

          <div className="flex items-center gap-3">

            <SlidersHorizontal
              size={18}
              className="text-slate-500"
            />

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="default">
                Sort: Recommended
              </option>

              <option value="low-high">
                Price: Low to High
              </option>

              <option value="high-low">
                Price: High to Low
              </option>

              <option value="name">
                Name: A-Z
              </option>
            </select>

          </div>

        </div>

        {/* PRICE FILTER */}

        <div className="mt-8 grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Maximum Price (₹ / meter)
            </label>

            <input
              type="number"
              min="0"
              placeholder="Example: 300"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          <div className="flex items-end">

            <button
              type="button"
              onClick={clearFilters}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <X size={17} />
              Clear All Filters
            </button>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="mt-8">

          <div className="flex flex-wrap gap-3">

            {finalCategories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {category}
              </button>
            ))}

          </div>

        </div>

        {/* RESULTS HEADER */}

        <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Available Fabrics
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}{" "}
              found
            </p>

          </div>

          {(search ||
            selectedCategory !== "All" ||
            maxPrice ||
            sortBy !== "default") && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-2 self-start rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 sm:self-auto"
            >
              <X size={16} />
              Reset filters
            </button>
          )}

        </div>

        {/* PRODUCT GRID */}

        {filteredProducts.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredProducts.map((product) => {

              const supplierName =
                typeof product.supplier === "string"
                  ? product.supplier
                  : product.supplier?.name;

              const image = getProductImage(
                product.name,
                product.category
              );

              return (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >

                  {/* IMAGE */}

                  <div className="relative h-72 overflow-hidden bg-slate-100">

                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    {/* CATEGORY */}

                    <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 backdrop-blur">
                      {product.category}
                    </span>

                    {/* STOCK */}

                    <span
                      className={`absolute right-5 top-5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} available`
                        : "Out of stock"}
                    </span>

                    {/* QUICK ADD */}

                    {product.stock > 0 && (
                      <div className="absolute inset-x-5 bottom-5 translate-y-16 transition duration-300 group-hover:translate-y-0">

                        <button
                          type="button"
                          onClick={() =>
                            handleAddToCart(product)
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-indigo-600"
                        >
                          <ShoppingCart size={18} />
                          Add MOQ to Cart
                        </button>

                      </div>
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="p-6">

                    {/* TITLE */}

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="text-xl font-bold text-slate-900">
                          {product.name}
                        </h3>

                        <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                          <MapPin size={15} />
                          India
                        </div>

                      </div>

                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-emerald-500"
                      />

                    </div>

                    {/* SUPPLIER */}

                    <p className="mt-4 text-sm text-slate-500">
                      Supplier:{" "}
                      <span className="font-medium text-slate-700">
                        {supplierName ||
                          "Verified Supplier"}
                      </span>
                    </p>

                    {/* SPECIFICATIONS */}

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-xs text-slate-400">
                          Material
                        </p>

                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-800">
                          {product.material}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-xs text-slate-400">
                          MOQ
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {product.minimumOrder}{" "}
                          {product.unit || "meters"}
                        </p>

                      </div>

                    </div>

                    {/* COLOR */}

                    <div className="mt-3 rounded-xl bg-slate-50 p-3">

                      <p className="text-xs text-slate-400">
                        Color
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {product.color}
                      </p>

                    </div>

                    {/* PRICE + DETAILS */}

                    <Link
                      to={`/products/${product._id}`}
                      className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5"
                    >

                      <div>

                        <p className="text-xs text-slate-400">
                          Starting from
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                          ₹{product.price}

                          <span className="ml-1 text-sm font-medium text-slate-400">
                            /{" "}
                            {product.unit || "meter"}
                          </span>
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-100 p-2 transition group-hover:bg-indigo-600 group-hover:text-white">

                        <ArrowRight size={20} />

                      </div>

                    </Link>

                  </div>

                </article>
              );
            })}

          </div>
        )}

        {/* EMPTY STATE */}

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Search
                size={28}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No products found
            </h3>

            <p className="mt-2 text-slate-500">
              Try searching for a different
              fabric, supplier or category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Clear filters
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default Marketplace;