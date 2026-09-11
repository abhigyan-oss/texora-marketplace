import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Save,
  PackageCheck,
} from "lucide-react";
import { API_URL } from "../config/api";


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
  available?: boolean;
}

interface EditForm {
  name: string;
  description: string;
  category: string;
  material: string;
  color: string;
  price: string;
  minimumOrder: string;
  stock: string;
  available: boolean;
}

const SupplierInventory = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    description: "",
    category: "",
    material: "",
    color: "",
    price: "",
    minimumOrder: "",
    stock: "",
    available: true,
  });

  const [savingEdit, setSavingEdit] = useState(false);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("texora-token");

      if (!token) {
        throw new Error("Please login again");
      }

      const response = await fetch(
        `${API_URL}/products/my-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setInventory(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // UPDATE STOCK
  // ==========================================

  const updateStock = async (
    productId: string,
    newStock: number
  ) => {
    try {
      setUpdatingId(productId);

      const token = localStorage.getItem("texora-token");

      if (!token) {
        throw new Error("Please login again");
      }

      const response = await fetch(
        `${API_URL}/products/${productId}/stock`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            stock: newStock,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update stock"
        );
      }

      setInventory((previousInventory) =>
        previousInventory.map((product) =>
          product._id === productId
            ? {
                ...product,
                stock: data.product.stock,
              }
            : product
        )
      );
    } catch (error) {
      console.error("Update stock error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update stock"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // INCREASE STOCK
  // ==========================================

  const increaseStock = (
    productId: string,
    currentStock: number
  ) => {
    updateStock(productId, currentStock + 50);
  };

  // ==========================================
  // DECREASE STOCK
  // ==========================================

  const decreaseStock = (
    productId: string,
    currentStock: number
  ) => {
    const newStock = Math.max(0, currentStock - 50);

    updateStock(productId, newStock);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (product: Product) => {
    setEditingProduct(product);

    setEditForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      material: product.material || "",
      color: product.color || "",
      price: String(product.price ?? ""),
      minimumOrder: String(product.minimumOrder ?? ""),
      stock: String(product.stock ?? ""),
      available:
        product.available !== undefined
          ? product.available
          : product.stock > 0,
    });
  };

  // ==========================================
  // CLOSE EDIT MODAL
  // ==========================================

  const closeEditModal = () => {
    if (savingEdit) return;

    setEditingProduct(null);
  };

  // ==========================================
  // EDIT INPUT HANDLER
  // ==========================================

  const handleEditChange = (
    field: keyof EditForm,
    value: string | boolean
  ) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==========================================
  // SAVE PRODUCT EDIT
  // ==========================================

  const saveProduct = async () => {
    if (!editingProduct) return;

    try {
      setSavingEdit(true);

      const token = localStorage.getItem("texora-token");

      if (!token) {
        throw new Error("Please login again");
      }

      if (!editForm.name.trim()) {
        throw new Error("Product name is required");
      }

      if (!editForm.category.trim()) {
        throw new Error("Category is required");
      }

      const price = Number(editForm.price);
      const minimumOrder = Number(editForm.minimumOrder);
      const stock = Number(editForm.stock);

      if (Number.isNaN(price) || price <= 0) {
        throw new Error("Price must be greater than 0");
      }

      if (
        Number.isNaN(minimumOrder) ||
        minimumOrder <= 0
      ) {
        throw new Error(
          "Minimum order quantity must be greater than 0"
        );
      }

      if (Number.isNaN(stock) || stock < 0) {
        throw new Error(
          "Stock cannot be negative"
        );
      }

      const response = await fetch(
        `${API_URL}/products/${editingProduct._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: editForm.name.trim(),
            description: editForm.description.trim(),
            category: editForm.category.trim(),
            material: editForm.material.trim(),
            color: editForm.color.trim(),
            price,
            minimumOrder,
            stock,
            available: editForm.available,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update product"
        );
      }

      const updatedProduct =
        data.product || data.updatedProduct;

      if (updatedProduct) {
        setInventory((previousInventory) =>
          previousInventory.map((product) =>
            product._id === editingProduct._id
              ? updatedProduct
              : product
          )
        );
      } else {
        await fetchProducts();
      }

      setEditingProduct(null);

      alert("Product updated successfully.");
    } catch (error) {
      console.error("Update product error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update product"
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const deleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product._id);

      const token = localStorage.getItem("texora-token");

      if (!token) {
        throw new Error("Please login again");
      }

      const response = await fetch(
        `${API_URL}/products/${product._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setInventory((previousInventory) =>
        previousInventory.filter(
          (item) => item._id !== product._id
        )
      );

      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Delete product error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // STOCK STATUS
  // ==========================================

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        style: "bg-rose-50 text-rose-600",
      };
    }

    if (stock <= 50) {
      return {
        label: "Limited Stock",
        style: "bg-amber-50 text-amber-600",
      };
    }

    return {
      label: "In Stock",
      style: "bg-emerald-50 text-emerald-600",
    };
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Supplier Panel
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              Inventory Management
            </h1>

            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Manage products, pricing, stock, MOQ and availability.
            </p>
          </div>

          <button
            onClick={fetchProducts}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Inventory
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2
              size={45}
              className="animate-spin text-indigo-600"
            />

            <p className="mt-5 text-slate-500">
              Loading inventory...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mt-10 rounded-3xl border border-red-100 bg-red-50 py-16 text-center">
            <AlertTriangle
              size={40}
              className="mx-auto text-red-500"
            />

            <p className="mt-4 font-semibold text-red-600">
              {error}
            </p>

            <button
              onClick={fetchProducts}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          inventory.length === 0 && (
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white py-20 text-center">
              <Boxes
                size={50}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No products yet
              </h2>

              <p className="mt-2 text-slate-500">
                Add products to start managing your inventory.
              </p>
            </div>
          )}

        {/* INVENTORY TABLE */}
        {!loading &&
          !error &&
          inventory.length > 0 && (
            <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px]">

                  <thead className="border-b border-slate-200 bg-slate-50">

                    <tr>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Product
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Price
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        MOQ
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Stock
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Availability
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {inventory.map((product) => {
                      const stockStatus = getStockStatus(
                        product.stock
                      );

                      const isAvailable =
                        product.available !== undefined
                          ? product.available
                          : product.stock > 0;

                      return (
                        <tr
                          key={product._id}
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                        >

                          {/* PRODUCT */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-4">

                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-14 w-14 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
                                  <Boxes
                                    size={22}
                                    className="text-slate-400"
                                  />
                                </div>
                              )}

                              <div>
                                <p className="font-semibold text-slate-900">
                                  {product.name}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  {product.category}{" "}
                                  •{" "}
                                  {product.material || "Fabric"}
                                </p>
                              </div>

                            </div>

                          </td>

                          {/* PRICE */}
                          <td className="px-6 py-5">

                            <p className="font-semibold text-slate-900">
                              ₹
                              {Number(
                                product.price
                              ).toLocaleString("en-IN")}
                            </p>

                            <p className="text-xs text-slate-500">
                              per unit
                            </p>

                          </td>

                          {/* MOQ */}
                          <td className="px-6 py-5">

                            <p className="font-semibold text-slate-900">
                              {product.minimumOrder}
                            </p>

                            <p className="text-xs text-slate-500">
                              units
                            </p>

                          </td>

                          {/* STOCK */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2">

                              <Boxes
                                size={17}
                                className="text-indigo-500"
                              />

                              <span className="font-bold text-slate-900">
                                {product.stock}
                              </span>

                              <span className="text-sm text-slate-500">
                                units
                              </span>

                            </div>

                            <span
                              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stockStatus.style}`}
                            >
                              {stockStatus.label}
                            </span>

                          </td>

                          {/* AVAILABILITY */}
                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                isAvailable
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  isAvailable
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                                }`}
                              />

                              {isAvailable
                                ? "Available"
                                : "Unavailable"}
                            </span>

                          </td>

                          {/* ACTIONS */}
                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-2">

                              <button
                                disabled={
                                  updatingId === product._id ||
                                  product.stock === 0
                                }
                                onClick={() =>
                                  decreaseStock(
                                    product._id,
                                    product.stock
                                  )
                                }
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                −50
                              </button>

                              <button
                                disabled={
                                  updatingId === product._id
                                }
                                onClick={() =>
                                  increaseStock(
                                    product._id,
                                    product.stock
                                  )
                                }
                                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                              >
                                {updatingId === product._id
                                  ? "..."
                                  : "+50"}
                              </button>

                              <button
                                onClick={() =>
                                  openEditModal(product)
                                }
                                className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                              >
                                <Pencil size={15} />
                                Edit
                              </button>

                              <button
                                disabled={
                                  deletingId === product._id
                                }
                                onClick={() =>
                                  deleteProduct(product)
                                }
                                className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                              >
                                {deletingId === product._id ? (
                                  <Loader2
                                    size={15}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={15} />
                                )}

                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            </div>
          )}

        {/* SUMMARY */}
        {!loading &&
          !error &&
          inventory.length > 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-3">

              {/* TOTAL */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">

                  <Boxes className="text-indigo-600" />

                  <div>
                    <p className="text-sm text-slate-500">
                      Total Products
                    </p>

                    <p className="text-2xl font-bold text-slate-900">
                      {inventory.length}
                    </p>
                  </div>

                </div>
              </div>

              {/* IN STOCK */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">

                  <CheckCircle2 className="text-emerald-600" />

                  <div>
                    <p className="text-sm text-slate-500">
                      In Stock
                    </p>

                    <p className="text-2xl font-bold text-slate-900">
                      {
                        inventory.filter(
                          (product) =>
                            product.stock > 50
                        ).length
                      }
                    </p>
                  </div>

                </div>
              </div>

              {/* NEEDS ATTENTION */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">

                  <AlertTriangle className="text-amber-600" />

                  <div>
                    <p className="text-sm text-slate-500">
                      Needs Attention
                    </p>

                    <p className="text-2xl font-bold text-slate-900">
                      {
                        inventory.filter(
                          (product) =>
                            product.stock <= 50
                        ).length
                      }
                    </p>
                  </div>

                </div>
              </div>

            </div>
          )}
      </div>

      {/* ==========================================
          EDIT PRODUCT MODAL
          ========================================== */}

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">

          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Supplier Panel
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Edit Product
                </h2>
              </div>

              <button
                onClick={closeEditModal}
                disabled={savingEdit}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
              >
                <X size={22} />
              </button>

            </div>

            {/* MODAL BODY */}
            <div className="grid gap-5 p-6 md:grid-cols-2">

              {/* PRODUCT NAME */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Name
                </label>

                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) =>
                    handleEditChange(
                      "name",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Product name"
                />

              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(event) =>
                    handleEditChange(
                      "description",
                      event.target.value
                    )
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Describe the product..."
                />

              </div>

              {/* CATEGORY */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <input
                  type="text"
                  value={editForm.category}
                  onChange={(event) =>
                    handleEditChange(
                      "category",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Cotton"
                />

              </div>

              {/* MATERIAL */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Material
                </label>

                <input
                  type="text"
                  value={editForm.material}
                  onChange={(event) =>
                    handleEditChange(
                      "material",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Organic Cotton"
                />

              </div>

              {/* COLOR */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Color
                </label>

                <input
                  type="text"
                  value={editForm.color}
                  onChange={(event) =>
                    handleEditChange(
                      "color",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="White"
                />

              </div>

              {/* PRICE */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Price per Unit
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={editForm.price}
                    onChange={(event) =>
                      handleEditChange(
                        "price",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="250"
                  />

                </div>

              </div>

              {/* MOQ */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Minimum Order Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  value={editForm.minimumOrder}
                  onChange={(event) =>
                    handleEditChange(
                      "minimumOrder",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="10"
                />

              </div>

              {/* STOCK */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Available Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={editForm.stock}
                  onChange={(event) =>
                    handleEditChange(
                      "stock",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="100"
                />

              </div>

              {/* AVAILABILITY */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Availability
                </label>

                <button
                  type="button"
                  onClick={() =>
                    handleEditChange(
                      "available",
                      !editForm.available
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-xl border p-4 transition ${
                    editForm.available
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <PackageCheck
                      size={20}
                      className={
                        editForm.available
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }
                    />

                    <div className="text-left">

                      <p className="font-semibold text-slate-900">
                        {editForm.available
                          ? "Product is available"
                          : "Product is unavailable"}
                      </p>

                      <p className="text-sm text-slate-500">
                        {editForm.available
                          ? "Buyers can see this product as available."
                          : "Buyers will see this product as unavailable."}
                      </p>

                    </div>

                  </div>

                  <div
                    className={`relative h-6 w-11 rounded-full transition ${
                      editForm.available
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        editForm.available
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </div>

                </button>

              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white p-6 sm:flex-row sm:justify-end">

              <button
                onClick={closeEditModal}
                disabled={savingEdit}
                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={saveProduct}
                disabled={savingEdit}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingEdit ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierInventory;
